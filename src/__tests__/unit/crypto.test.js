import { describe, it, expect } from 'vitest';
import {
  encryptField,
  decryptField,
  isEncrypted,
  hashPassword,
  verifyPassword,
  validateStrongPassword,
} from '@/lib/crypto';

describe('crypto', () => {
  describe('encryptField / decryptField', () => {
    it('round-trips plain text', () => {
      const plain = 'Hello, LifePulse!';
      const cipher = encryptField(plain);
      expect(isEncrypted(cipher)).toBe(true);
      expect(decryptField(cipher)).toBe(plain);
    });

    it('passes through null, undefined, and empty string', () => {
      expect(encryptField(null)).toBe(null);
      expect(encryptField(undefined)).toBe(undefined);
      expect(encryptField('')).toBe('');
    });

    it('returns non-encrypted values unchanged from decryptField', () => {
      expect(decryptField('plain text')).toBe('plain text');
    });
  });

  describe('validateStrongPassword', () => {
    it('accepts a strong password', () => {
      expect(validateStrongPassword('SecurePass1!')).toBe('');
    });

    it('rejects short passwords', () => {
      expect(validateStrongPassword('Short1!')).toMatch(/12 characters/);
    });

    it('requires uppercase, lowercase, number, and special char', () => {
      expect(validateStrongPassword('alllowercase1!')).toMatch(/uppercase/);
      expect(validateStrongPassword('ALLUPPERCASE1!')).toMatch(/lowercase/);
      expect(validateStrongPassword('NoNumbersHere!')).toMatch(/number/);
      expect(validateStrongPassword('NoSpecialChar1')).toMatch(/special/);
    });
  });

  describe('hashPassword / verifyPassword', () => {
    it('produces deterministic hash with fixed salt', async () => {
      const salt = 'a'.repeat(32);
      const first = await hashPassword('TestPassword1!', salt);
      const second = await hashPassword('TestPassword1!', salt);
      expect(first.hash).toBe(second.hash);
      expect(first.salt).toBe(salt);
    });

    it('verifies matching password', async () => {
      const { hash, salt } = await hashPassword('TestPassword1!');
      expect(await verifyPassword('TestPassword1!', salt, hash)).toBe(true);
    });

    it('rejects wrong password', async () => {
      const { hash, salt } = await hashPassword('TestPassword1!');
      expect(await verifyPassword('WrongPassword1!', salt, hash)).toBe(false);
    });

    it('returns false when salt or hash missing', async () => {
      expect(await verifyPassword('TestPassword1!', '', 'abc')).toBe(false);
      expect(await verifyPassword('TestPassword1!', 'abc', '')).toBe(false);
    });
  });
});
