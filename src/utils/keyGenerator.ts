// Isomorphic random key / IV generation
// Uses Web Crypto in browsers and Node crypto on server.
function nodeCrypto() {
  // dynamic require to avoid bundler issues in browser
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("crypto");
}

export const randomKey = (length = 32): string => {
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.getRandomValues
  ) {
    const arr = new Uint8Array(length);
    window.crypto.getRandomValues(arr);
    // hex string
    return Array.from(arr)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, length);
  }

  const crypto = nodeCrypto();
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};

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
