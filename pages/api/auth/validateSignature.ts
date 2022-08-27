import { recoverPersonalSignature } from "eth-sig-util";
import { bufferToHex } from "ethereumjs-util";
import jwt from "jsonwebtoken";
import { initializeApollo } from "../../../graphql/apollo";
import { GetUserByPublicKeyDocument, RefreshNonceDocument } from "../../../graphql/generated/graphql";
import get from "lodash/fp/get";
import getOr from "lodash/fp/getOr";
import { NextApiRequest, NextApiResponse } from "next";

const adminContext = {
  headers: {
    "x-hasura-admin-secret": process.env.GRAPHQL_ADMIN_API_KEY,
  },
};

const nonceSignedByAddress = (publicAddress: string, nonce: string, signature: string) => {
  const msgBufferHex = bufferToHex(Buffer.from(nonce, "utf8"));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  const proofOfSignature = address.toLowerCase() === publicAddress.toLowerCase();
  return proofOfSignature;
};

const createHasuraJWT = async (userId: string) => {
  const jwtContent = {
    sub: userId,
    "https://hasura.io/jwt/claims": {
      "x-hasura-allowed-roles": ["user"],
      "x-hasura-default-role": "user",
      "x-hasura-user-id": userId,
    },
  };
  const accessToken = await jwt.sign(
    jwtContent,
    process.env.JWT_SECRET, // TODO generate a real secret and put it in config
    {
      algorithm: "HS256",
      expiresIn: "30d",
    }
  );

  return accessToken;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // TODO move some of this to middleware
  const { body, headers, method } = req;

  if (method !== "POST") return res.status(404);
  if (headers["x-hasura-action-secret"] !== process.env.ACTION_SECRET) return res.status(401);

  const { signature, public_address: publicAddress } = getOr({}, "input.args", body);
  if (!signature || !publicAddress) return res.status(400);

  // Get the current nonce for the user
  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: GetUserByPublicKeyDocument,
    variables: {
      publicKey: publicAddress,
    },
  });

  const nonce = get("user[0].nonce", data);
  const userId = get("user[0].id", data);

  // Check that the signature is the result of the public address signing the nonce
  const hasSignedNonce = nonceSignedByAddress(publicAddress, nonce, signature);
  if (!hasSignedNonce) res.status(401);

  // refresh the nonce so it cannot be used again
  await apolloClient.mutate({
    mutation: RefreshNonceDocument,
    variables: {
      publicKey: publicAddress,
    },
    context: adminContext,
  });

  // Return a valid JWT
  const accessToken = await createHasuraJWT(userId);
  res.status(200).json({ accessToken });
}
