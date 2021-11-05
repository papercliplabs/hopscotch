import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import { initializeApollo } from '../../../graphql/apollo';
import { GetUserByPublicKeyDocument, RefreshNonceDocument } from '../../../graphql/generated/graphql';
import get from 'lodash/fp/get';
import getOr from 'lodash/fp/getOr';

const adminContext = {
  headers: {
    "x-hasura-admin-secret": process.env.GRAPHQL_ADMIN_API_KEY,
    }
};

export default async function handler(req, res) {
  // TODO move some of this to middle ware
  const {body, headers, method} = req;
  console.log("got the body", {body, headers});

  if (method !== 'POST') return res.status(404);
  if (headers['x-hasura-action-secret'] !== process.env.ACTION_SECRET) return res.status(401);

  const { signature, public_address: publicAddress } = getOr({}, 'input.args', body);
  console.log("got the body", {body, headers});

  if (!signature || !publicAddress) return res.status(400);

  const apolloClient = initializeApollo();
  const { data } = await apolloClient.query({
    query: GetUserByPublicKeyDocument,
    variables: {
      publicKey: publicAddress,
    }
  });

  console.log('we here', data);
  const nonce = get('users[0].nonce', data)
  const userId = get('users[0].id', data)
  const name = get('users[0].name', data)

  const msgBufferHex = bufferToHex(Buffer.from(nonce, 'utf8'));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  console.log('refreshing for', {publicAddress, address, nonce, adminContext});
  const proofOfSignature = address.toLowerCase() === publicAddress.toLowerCase();
  if (proofOfSignature) {
    // refresh the nonce so it cannot be used again
    const refreshResponse = await apolloClient.mutate({
      mutation: RefreshNonceDocument,
      variables: {
        publicKey: publicAddress,
      },
      context: adminContext,
    });
    console.log('refreshResponse', refreshResponse);
    const jwtContent = {
      sub: userId,
      name: name,
      "https://hasura.io/jwt/claims": {
        "x-hasura-allowed-roles": ["user"],
        "x-hasura-default-role": "user",
        "x-hasura-user-id": userId,
      }
    }
    const accessToken = await jwt.sign(
      jwtContent,
      process.env.JWT_SECRET, // TODO generate a real secret and put it in config
      {
        algorithm: "HS256",
        expiresIn: "30d",
      }
    )
    res.status(200).json({accessToken})
  } else {
    res.status(401).json({accessToken: ""})
  }
}