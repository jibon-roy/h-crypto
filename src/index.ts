export * from "./types";
export * from "./hybrid/aes";
export * from "./hybrid/rsa";
export * from "./hybrid/hybridEncryptor";
export * from "./utils/keyGenerator";

// Backwards-compat: some users import `generateKeyPair` (older README/examples).
// Provide a named alias to the RSA key generator for convenience.
export { generateRSAKeys as generateKeyPair } from "./hybrid/rsa";
