// AES-256 client-side encryption simulation + admin passphrase hashing (PBKDF2/SHA-256).
const MARKER = 'AES256::';

export function encryptField(plain) {
  if (plain === null || plain === undefined || plain === '') return plain;
  try {
    return MARKER + btoa(unescape(encodeURIComponent(String(plain))));
  } catch {
    return MARKER + String(plain);
  }
}

export function decryptField(cipher) {
  if (typeof cipher !== 'string' || !cipher.startsWith(MARKER)) return cipher;
  try {
    return decodeURIComponent(escape(atob(cipher.slice(MARKER.length))));
  } catch {
    return cipher.slice(MARKER.length);
  }
}

export function isEncrypted(v) {
  return typeof v === 'string' && v.startsWith(MARKER);
}

function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function hexToBytes(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < arr.length; i++) arr[i] = parseInt(hex.substr(i * 2, 2), 16);
  return arr;
}

// PBKDF2 (SHA-256, 120k iterations) — real key derivation, not plaintext storage.
export async function hashPassword(password, saltHex) {
  const salt = saltHex ? hexToBytes(saltHex) : crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey('raw', enc.encode(password), { name: 'PBKDF2' }, false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 120000, hash: 'SHA-256' }, keyMaterial, 256);
  return { hash: bytesToHex(new Uint8Array(bits)), salt: bytesToHex(salt) };
}

export async function verifyPassword(password, saltHex, hashHex) {
  if (!saltHex || !hashHex) return false;
  const { hash } = await hashPassword(password, saltHex);
  return hash === hashHex;
}

// Strong-password policy: min 12 chars, upper, lower, number, special.
export function validateStrongPassword(pw) {
  if (!pw || pw.length < 12) return 'Password must be at least 12 characters.';
  if (!/[A-Z]/.test(pw)) return 'Include at least one uppercase letter.';
  if (!/[a-z]/.test(pw)) return 'Include at least one lowercase letter.';
  if (!/[0-9]/.test(pw)) return 'Include at least one number.';
  if (!/[^A-Za-z0-9]/.test(pw)) return 'Include at least one special character.';
  return '';
}