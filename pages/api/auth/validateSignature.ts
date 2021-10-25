import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';

export default function handler(req, res) {
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
    res.status(200).json({data: "YOUIN"})
  } else {
    res.status(401).json({data: "YOUOUT"})
  }
}