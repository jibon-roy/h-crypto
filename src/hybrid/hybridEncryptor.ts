import { aesEncrypt, aesDecrypt } from "./aes";
import { sodiumSeal, sodiumUnseal } from "./sodium";
import { HybridEncryptConfig } from "../types";

export const hybridEncrypt = async (
  data: Record<string, any>,
  config: HybridEncryptConfig
): Promise<string> => {
  const aesEncrypted = await aesEncrypt(data, config.aes);

  // Encrypt AES key & IV using recipient public key (sodium sealed box)
  const keyData = JSON.stringify({
    secretKey: config.aes.secretKey,
    iv: config.aes.iv,
    salt: config.aes.salt,
  });

  const encryptedKey = await sodiumSeal(keyData, config.rsa.publicKey);

  return JSON.stringify({
    encryptedData: aesEncrypted,
    encryptedKey,
  });
};

export const hybridDecrypt = async (
  token: string,
  config: HybridEncryptConfig
): Promise<Record<string, any> | null> => {
  try {
    const { encryptedData, encryptedKey } = JSON.parse(token);

    // Decrypt AES key info using recipient keypair (sodium sealed box)
    const keyInfo = JSON.parse(
      await sodiumUnseal(
        encryptedKey,
        config.rsa.publicKey,
        config.rsa.privateKey
      )
    );

    // Merge decrypted AES config with provided
    const aesConfig = { ...config.aes, ...keyInfo };

    return await aesDecrypt(encryptedData, aesConfig);
  } catch {
    return null;
  }
};
