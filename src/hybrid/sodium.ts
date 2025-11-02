import sodium from "libsodium-wrappers";

async function ready() {
  await sodium.ready;
  return sodium;
}

function toBase64(buf: Uint8Array) {
  if (typeof window !== "undefined") {
    let binary = "";
    for (let i = 0; i < buf.length; i++) binary += String.fromCharCode(buf[i]);
    return btoa(binary);
  }
  // Node

  const Buffer = require("buffer").Buffer;
  return Buffer.from(buf).toString("base64");
}

function fromBase64(b64: string) {
  if (typeof window !== "undefined") {
    const binary = atob(b64);
    const len = binary.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) bytes[i] = binary.charCodeAt(i);
    return bytes;
  }
  // Node
  const Buffer = require("buffer").Buffer;
  return new Uint8Array(Buffer.from(b64, "base64"));
}

export const generateSodiumKeyPair = async (): Promise<{
  publicKey: string;
  privateKey: string;
}> => {
  const s = await ready();
  const kp = s.crypto_box_keypair();
  return {
    publicKey: toBase64(kp.publicKey),
    privateKey: toBase64(kp.privateKey),
  };
};

export const sodiumSeal = async (
  plaintext: string,
  recipientPublicKeyB64: string
): Promise<string> => {
  const s = await ready();
  const pub = fromBase64(recipientPublicKeyB64);
  const pt = new TextEncoder().encode(plaintext);
  const cipher = s.crypto_box_seal(pt, pub);
  return toBase64(cipher);
};

export const sodiumUnseal = async (
  cipherB64: string,
  recipientPublicKeyB64: string,
  recipientPrivateKeyB64: string
): Promise<string> => {
  const s = await ready();
  const pub = fromBase64(recipientPublicKeyB64);
  const priv = fromBase64(recipientPrivateKeyB64);
  const cipher = fromBase64(cipherB64);
  const opened = s.crypto_box_seal_open(cipher, pub, priv);
  return new TextDecoder().decode(opened);
};

export default {
  generateSodiumKeyPair,
  sodiumSeal,
  sodiumUnseal,
};
