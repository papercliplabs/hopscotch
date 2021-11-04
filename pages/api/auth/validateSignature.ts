import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import { initializeApollo } from '../../../graphql/apollo';
import { GetUserByPublicKeyDocument, RefreshNonceDocument } from '../../../graphql/generated/graphql';
import get from 'lodash/fp/get';

const adminContext = {
  headers: {
    "x-hasura-admin-secret": process.env.GRAPHQL_ADMIN_API_KEY,
    }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    return res.status(400)
  }

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
    const token = await jwt.sign(
      {
        payload: {
          id: userId,
          publicAddress,
        },
      },
      "JWTSECRET", // TODO generate a real secret and put it in config
      {
        algorithm: "HS256", // TODO see which algo is best
      }
    )
    res.status(200).json({data: "YOUIN", token})
  } else {
    res.status(401).json({data: "YOUOUT"})
  }
}