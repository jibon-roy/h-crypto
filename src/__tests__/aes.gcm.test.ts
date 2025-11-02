import { aesEncrypt, aesDecrypt } from "../hybrid/aes";
import { randomKey, randomIVForAlgorithm } from "../utils/keyGenerator";
import type { AESConfig } from "../types";

describe("AES-GCM encrypt/decrypt", () => {
  test("roundtrip encrypt and decrypt returns original data for GCM", async () => {
    const config: AESConfig = {
      secretKey: randomKey(32),
      iv: randomIVForAlgorithm("aes-256-gcm" as any),
      salt: "testsalt",
      algorithm: "aes-256-gcm",
    };

    const payload = { hello: "gcm", n: 99 };
    const encrypted = await aesEncrypt(payload, config);
    expect(typeof encrypted).toBe("string");

    const decrypted = await aesDecrypt(encrypted, config);
    expect(decrypted).toEqual(payload);
  });
});
