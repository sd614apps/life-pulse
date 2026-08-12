import { describe, it, expect } from 'vitest';
import { cn } from '@/lib/utils';
import { createPageUrl } from '@/utils/index';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names', () => {
      expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('resolves tailwind conflicts', () => {
      expect(cn('p-2', 'p-4')).toBe('p-4');
    });

    it('handles conditional classes', () => {
      expect(cn('base', false && 'hidden', 'visible')).toBe('base visible');
    });
  });

  describe('createPageUrl', () => {
    it('prefixes page name with slash', () => {
      expect(createPageUrl('Dashboard')).toBe('/Dashboard');
    });

    it('replaces spaces with hyphens', () => {
      expect(createPageUrl('My Page')).toBe('/My-Page');
    });

    it('handles empty string', () => {
      expect(createPageUrl('')).toBe('/');
    });
  });
});
