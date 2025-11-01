import { hybridEncrypt, hybridDecrypt } from "../hybrid/hybridEncryptor";
import { generateSodiumKeyPair } from "../hybrid/sodium";
import { randomKey, randomIV } from "../utils/keyGenerator";

describe("Hybrid encrypt/decrypt", () => {
  test("roundtrip encrypt and decrypt returns original object", async () => {
    const aes = {
      secretKey: randomKey(32),
      iv: randomIV(),
      salt: "salt",
      algorithm: "aes-256-cbc",
    };
    // generate a sodium keypair for sealed-box encryption of the AES key info
    const rsa = await generateSodiumKeyPair();

    const cfg = { aes, rsa } as any;
    const data = { ok: true, value: 123 };

    const token = await hybridEncrypt(data, cfg);
    expect(typeof token).toBe("string");

    const out = await hybridDecrypt(token, cfg);
    expect(out).toEqual(data);
  });
});
