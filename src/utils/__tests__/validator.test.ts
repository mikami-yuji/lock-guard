import { validateProfileName, validateProfileDescription } from '../validator';

describe('validator tests', () => {
  describe('validateProfileName', () => {
    test('should pass for valid name', () => {
      const result = validateProfileName('カスタムプロファイル');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('カスタムプロファイル');
    });

    test('should reject empty or whitespace name', () => {
      const result = validateProfileName('   ');
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toBe('空のプロファイル名は使用できません。');
    });

    test('should truncate names longer than 30 characters', () => {
      const longName = 'A'.repeat(35);
      const result = validateProfileName(longName);
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue.length).toBe(30);
    });

    test('should sanitize HTML tags and special characters', () => {
      const dangerousName = '<script>alert("test")</script>';
      const result = validateProfileName(dangerousName);
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toContain('&lt;script&gt;');
    });
  });

  describe('validateProfileDescription', () => {
    test('should pass valid description', () => {
      const result = validateProfileDescription('プロファイルの説明です。');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('プロファイルの説明です。');
    });

    test('should handle empty description gracefully', () => {
      const result = validateProfileDescription('');
      expect(result.isValid).toBe(true);
      expect(result.sanitizedValue).toBe('');
    });

    test('should truncate long description over 150 chars', () => {
      const longDesc = 'B'.repeat(160);
      const result = validateProfileDescription(longDesc);
      expect(result.isValid).toBe(false);
      expect(result.sanitizedValue.length).toBe(150);
    });
  });
});
