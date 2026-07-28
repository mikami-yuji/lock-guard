/**
 * Lockキーの識別子
 */
export type LockKeyType = 'NumLock' | 'CapsLock' | 'ScrollLock' | 'Insert' | 'WinKey' | 'FnKey';

/**
 * キーの制御モード
 * - normal: 通常通り（OSの標準動作）
 * - force_on: 常時ONに固定（押されてOFFになっても自動で復元）
 * - force_off: 常時OFFに固定
 * - blocked: キー押下自体を完全ブロック（無効化）
 */
export type LockMode = 'normal' | 'force_on' | 'force_off' | 'blocked';

/**
 * 各Lockキーの個別設定と現在の状態
 */
export type LockKeyConfig = {
  id: LockKeyType;
  name: string;
  description: string;
  isCurrentlyActive: boolean;
  mode: LockMode;
  preventAccidentalPress: boolean;
  soundAlertEnabled: boolean;
};

/**
 * Lockキー設定マップ
 */
export type LockStateMap = Record<LockKeyType, LockKeyConfig>;

/**
 * プロファイル定義
 */
export type UserProfile = {
  id: string;
  name: string;
  description: string;
  iconName: string;
  keyConfigs: LockStateMap;
  createdAt: string;
  updatedAt: string;
};

/**
 * スクリプト書き出しフォーマット
 */
export type ScriptFormat = 'autohotkey' | 'powershell' | 'registry';

/**
 * 通知・サウンド設定
 */
export type SoundNotificationSettings = {
  enableSound: boolean;
  volume: number;
  enableToastNotification: boolean;
  enableVoiceAlert: boolean;
};
