/**
 * プロファイル入力データのバリデーション結果型
 */
export type ValidationResult = {
  isValid: boolean;
  sanitizedValue: string;
  errorMessage?: string;
};

/**
 * プロファイル名の入力値を検証およびサニタイズします
 * @param input Name string
 * @returns ValidationResult
 */
export const validateProfileName = (input: string): ValidationResult => {
  try {
    if (!input || typeof input !== 'string') {
      return {
        isValid: false,
        sanitizedValue: '',
        errorMessage: 'プロファイル名を入力してください。',
      };
    }

    const trimmedValue = input.trim();

    if (trimmedValue.length === 0) {
      return {
        isValid: false,
        sanitizedValue: '',
        errorMessage: '空のプロファイル名は使用できません。',
      };
    }

    if (trimmedValue.length > 30) {
      return {
        isValid: false,
        sanitizedValue: trimmedValue.substring(0, 30),
        errorMessage: 'プロファイル名は30文字以内で入力してください。',
      };
    }

    // 不正なタグや特殊文字のエスケープ処理
    const sanitized = trimmedValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return {
      isValid: true,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      sanitizedValue: '',
      errorMessage: '入力の検証中にエラーが発生しました。',
    };
  }
};

/**
 * プロファイル説明文の入力値を検証およびサニタイズします
 * @param input Description string
 * @returns ValidationResult
 */
export const validateProfileDescription = (input: string): ValidationResult => {
  try {
    if (!input || typeof input !== 'string') {
      return {
        isValid: true,
        sanitizedValue: '',
      };
    }

    const trimmedValue = input.trim();

    if (trimmedValue.length > 150) {
      return {
        isValid: false,
        sanitizedValue: trimmedValue.substring(0, 150),
        errorMessage: '説明文は150文字以内で入力してください。',
      };
    }

    const sanitized = trimmedValue
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;');

    return {
      isValid: true,
      sanitizedValue: sanitized,
    };
  } catch (error) {
    return {
      isValid: false,
      sanitizedValue: '',
      errorMessage: '説明文の検証中にエラーが発生しました。',
    };
  }
};
