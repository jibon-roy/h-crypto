# h-crypto

A hybrid encryption helper focused on providing cross-platform (Node + browser-ready APIs) building blocks for hybrid encryption flows. This project provides AES helpers, sealed-box wrappers (libsodium), key generation utilities, and an easy hybrid envelope pattern.

## Install

```powershell
npm install h-crypto
# or
pnpm add h-crypto
```

## Quick notes about platform compatibility

- As of v1.x the package provides browser-safe code paths for symmetric AES operations (Web Crypto + scrypt-js) and uses libsodium-wrappers sealed boxes for cross-platform asymmetric wrapping. This allows the same high-level API to work in browsers (WASM libsodium) and Node.
- For server-only RSA/PEM flows the old `rsa` helpers remain, but the hybrid encryptor uses the sodium sealed-box helpers by default.

## Front-end (React / Next client) — client-only example

The package includes helpers to generate hex secrets and hex IVs that are easy to copy/paste into front-end code. Below is a minimal client-only React component example (adapted for Next.js client components):


   ![npm version](https://img.shields.io/npm/v/h-crypto.svg)
   ![npm downloads](https://img.shields.io/npm/dm/h-crypto.svg)
   ![License](https://img.shields.io/npm/l/h-crypto.svg)
   ![TypeScript](https://img.shields.io/badge/TypeScript-%E2%9C%93-blue)

   Hybrid encryption utilities for JavaScript and TypeScript. h-crypto implements an envelope-style hybrid encryption pattern (symmetric AES for bulk data + libsodium sealed-box or RSA for key wrapping) with browser and Node.js compatibility. It includes AES helpers, key generation, sodium sealed-box wrappers, and a simple hybrid envelope format to make end-to-end, client-to-server, and storage encryption flows easier to implement.

   Why this package (SEO-focused): hybrid encryption, envelope encryption, AES-256, libsodium sealed-box, client-side encryption, server-side encryption, TypeScript crypto library, Node and browser compatible cryptography.

   ## Install

```powershell
   npm install h-crypto
   # or
   pnpm add h-crypto
````

## Quick notes about platform compatibility

- Browser-safe code paths for symmetric AES operations (Web Crypto + scrypt-js) and libsodium-wrappers sealed boxes (WASM) for asymmetric wrapping. Works in both browser and Node.
- For server-only RSA/PEM flows legacy `rsa` helpers remain, but the recommended cross-platform default is libsodium sealed-box.

## Quick start (client)

```tsx
import { aesEncrypt, aesDecrypt, randomKey, randomIVHex } from "h-crypto";

async function demo() {
  const secretHex = randomKey(64); // AES-256 key (32 bytes -> 64 hex chars)
  const ivHex = randomIVHex(16);

  const cfg = {
    secretKey: secretHex,
    iv: ivHex,
    salt: "client-salt",
    algorithm: "aes-256-cbc",
    encoding: "base64",
    expiresIn: 3600,
  };

  const token = await aesEncrypt({ hello: "world" }, cfg);
  const recovered = await aesDecrypt(token, cfg);
  console.log({ token, recovered });
}

demo();
```

## Server example (Next.js API route)

```js
import { hybridDecrypt } from "h-crypto";

const KEYPAIR = {
  publicKey: process.env.SODIUM_PUBLIC,
  privateKey: process.env.SODIUM_PRIVATE,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: "token required" });

  const cfg = {
    aes: { algorithm: "aes-256-cbc", salt: "client-salt" },
    rsa: { publicKey: KEYPAIR.publicKey, privateKey: KEYPAIR.privateKey },
  };

  const data = await hybridDecrypt(token, cfg);
  if (!data) return res.status(400).json({ error: "decrypt failed" });
  return res.status(200).json({ data });
}
```

## API reference (short)

For full types and examples see the `src` folder. Common exports:

- `aesEncrypt(data, config)` → Promise<string>
- `aesDecrypt(token, config)` → Promise<object | null>
- `randomKey(length)` → string (hex)
- `randomIVHex(bytes)` → string (hex)
- `generateSodiumKeyPair()` → Promise<{ publicKey, privateKey }>
- `sodiumSeal(plaintext, publicKey)` → Promise<string> (base64)
- `sodiumUnseal(cipherB64, publicKey, privateKey)` → Promise<string>
- `hybridEncrypt(data, config)` → Promise<string> (envelope JSON)
- `hybridDecrypt(token, config)` → Promise<object | null>

See `src/types.ts` for `AESConfig` and `HybridEncryptConfig` details.

## Security recommendations

- Prefer AES-256 and hex-formatted keys/IVs.
- Do not store private keys or secrets in client code. Keep private keys in server-side secure storage.
- Consider using libsodium AEAD (XChaCha20-Poly1305) for stronger authenticated encryption. I can help migrate the symmetric layer if desired.

## Development & tests

```powershell
npm install
npm run build
npm test
```

## Keywords

hybrid-encryption, envelope-encryption, aes, aes-256, aes-gcm, libsodium, sealed-box, sealedbox, sodium, xchacha20, end-to-end-encryption, e2ee, client-side-encryption, server-side-encryption, web-crypto, scrypt, key-generation, cryptography, crypto-library, typescript, javascript, nodejs, browser

## Contributing

Create a branch, open a PR, and include tests for new features. The repo already contains unit tests for AES, RSA (legacy), sodium sealed-box, and hybrid flows.

---

If you'd like, I can also:

- Add GitHub Action CI and CI badges to the README (helps SEO and trust).
- Add a small example repo (Next.js) demonstrating end-to-end usage.
- Add a compact transport token helper for bundling ciphertext + iv + metadata.
