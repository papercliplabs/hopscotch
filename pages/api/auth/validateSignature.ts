import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(404)
  }

  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    return res.status(400)
  }

  const msg = "TODONONCEDYNAMIC"

  const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
  const address = recoverPersonalSignature({
    data: msgBufferHex,
    sig: signature,
  });

  const proofOfSignature = address.toLowerCase() === publicAddress.toLowerCase();
  if (proofOfSignature) {
    const token = await jwt.sign(
      {
        payload: {
          id: "USERID",
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