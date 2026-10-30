const decryptCache = new Map<string, Promise<ArrayBuffer>>();

async function generateAESKey(password: string): Promise<CryptoKey> {
  const passwordBuffer = new TextEncoder().encode(password);
  const hashedPassword = await crypto.subtle.digest("SHA-256", passwordBuffer);
  return crypto.subtle.importKey(
    "raw",
    hashedPassword.slice(0, 32),
    { name: "AES-CBC" },
    false,
    ["encrypt", "decrypt"]
  );
}

export const decryptFile = (
  url: string,
  password: string
): Promise<ArrayBuffer> => {
  const cacheKey = `${url}::${password}`;
  const existing = decryptCache.get(cacheKey);
  if (existing) {
    return existing;
  }

  const promise = (async () => {
    const response = await fetch(url, { cache: "force-cache" });
    const encryptedData = await response.arrayBuffer();
    const iv = new Uint8Array(encryptedData.slice(0, 16));
    const data = encryptedData.slice(16);
    const key = await generateAESKey(password);
    return crypto.subtle.decrypt({ name: "AES-CBC", iv }, key, data);
  })();

  decryptCache.set(cacheKey, promise);
  return promise;
};

// Pre-warm character model fetch & decryption immediately on module import
if (typeof window !== "undefined") {
  void decryptFile("/models/character.enc", "Character3D#@").catch(() => {});
}
