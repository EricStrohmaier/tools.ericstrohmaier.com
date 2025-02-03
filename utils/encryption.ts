const ENCRYPTION_KEY = "boring-invoice-key";

export async function generateKey(password: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits", "deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: enc.encode("boring-invoice-salt"),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(data: string): Promise<string> {
  try {
    const key = await generateKey(ENCRYPTION_KEY);
    const enc = new TextEncoder();
    const iv = crypto.getRandomValues(new Uint8Array(12));

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      enc.encode(data)
    );

    const encryptedContentArr = new Uint8Array(encryptedContent);
    const buf = new Uint8Array(iv.length + encryptedContentArr.length);
    buf.set(iv, 0);
    buf.set(encryptedContentArr, iv.length);

    return btoa(String.fromCharCode(...buf));
  } catch (error) {
    console.error("Encryption error:", error);
    return data; // Fallback to unencrypted data if encryption fails
  }
}

export async function decryptData(encryptedData: string): Promise<string> {
  try {
    const key = await generateKey(ENCRYPTION_KEY);
    const dec = new TextDecoder();
    const buf = Uint8Array.from(atob(encryptedData), (c) => c.charCodeAt(0));

    const iv = buf.slice(0, 12);
    const encryptedContent = buf.slice(12);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      key,
      encryptedContent
    );

    return dec.decode(decryptedContent);
  } catch (error) {
    console.error("Decryption error:", error);
    return encryptedData; // Fallback to encrypted string if decryption fails
  }
}

export async function secureLocalStorage(
  key: string,
  value: any,
  encrypt = true
): Promise<void> {
  try {
    const stringValue = JSON.stringify(value);
    const storedValue = encrypt ? await encryptData(stringValue) : stringValue;
    localStorage.setItem(key, storedValue);
  } catch (error) {
    console.error("Error saving to localStorage:", error);
  }
}

export async function getFromSecureLocalStorage<T>(
  key: string,
  decrypt = true
): Promise<T | null> {
  try {
    const storedValue = localStorage.getItem(key);
    if (!storedValue) return null;

    const decryptedValue = decrypt
      ? await decryptData(storedValue)
      : storedValue;
    return JSON.parse(decryptedValue) as T;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
}
