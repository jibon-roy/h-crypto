// Isomorphic random key / IV generation
// Uses Web Crypto in browsers and Node crypto on server.
function nodeCrypto() {
  // dynamic require to avoid bundler issues in browser

  return require("crypto");
}

import type { AESAlgorithm } from "../types";

export const randomKey = (length = 32): string => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const arr = new Uint8Array(Math.ceil(length / 2));
    window.crypto.getRandomValues(arr);
    // hex string
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);
  }

  const crypto = nodeCrypto();
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex")
    .slice(0, length);
};

// Generate a random IV and return as hex string. `bytes` is number of bytes (default 16).
// Legacy randomIV() kept for backward compatibility: returns a latin1-like
// 16-character string where each char represents a raw byte. This mirrors
// the original behavior expected by existing consumers and tests.
export const randomIV = (): string => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    // return latin1-like string where each char is a byte
    return String.fromCharCode(...Array.from(arr));
  }

  const crypto = nodeCrypto();
  return crypto.randomBytes(16).toString("latin1").slice(0, 16);
};

// New helper: return IV as a hex string with `bytes` length (default 16 bytes -> 32 hex chars)
export const randomIVHex = (bytes = 16): string => {
  const hexLen = bytes * 2;
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const arr = new Uint8Array(bytes);
    window.crypto.getRandomValues(arr);
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, hexLen);
  }

  const crypto = nodeCrypto();
  return crypto.randomBytes(bytes).toString("hex").slice(0, hexLen);
};

// Return an IV sized appropriately for the AES algorithm.
// - For AES-GCM algorithms, return 12 bytes (96 bits) which is the recommended nonce length for GCM.
// - For other AES modes (CBC), return 16 bytes.
// By default this returns a hex string; set `hex=false` to get a latin1-like raw byte string.
export const randomIVForAlgorithm = (
  algorithm: AESAlgorithm,
  hex = true
): string => {
  const isGcm = /-gcm$/.test(algorithm);
  const bytes = isGcm ? 12 : 16;
  if (hex) return randomIVHex(bytes);

  // latin1-like raw string
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const arr = new Uint8Array(bytes);
    window.crypto.getRandomValues(arr);
    return String.fromCharCode(...Array.from(arr));
  }

  const crypto = nodeCrypto();
  return crypto.randomBytes(bytes).toString("latin1").slice(0, bytes);
};
