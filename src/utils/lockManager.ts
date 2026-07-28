import { LockKeyType, LockMode, LockKeyConfig, LockStateMap, UserProfile } from '@/types';

/**
 * デフォルトのLockキー初期設定マップを生成します
 * @returns デフォルトのLockStateMap
 */
export const createDefaultLockStateMap = (): LockStateMap => {
  return {
    NumLock: {
      id: 'NumLock',
      name: 'NumLock',
      description: 'テンキーの数値入力を切替。誤押しによるカーソル移動を防止します。',
      isCurrentlyActive: true,
      mode: 'force_on',
      preventAccidentalPress: true,
      soundAlertEnabled: true,
    },
    CapsLock: {
      id: 'CapsLock',
      name: 'CapsLock',
      description: '英大文字入力の固定。意図しない大文字連打を防止します。',
      isCurrentlyActive: false,
      mode: 'blocked',
      preventAccidentalPress: true,
      soundAlertEnabled: true,
    },
    ScrollLock: {
      id: 'ScrollLock',
      name: 'Scroll Lock',
      description: 'Excel等のスクロール制御。現代PCではほぼ不要なキーの誤操作を防ぎます。',
      isCurrentlyActive: false,
      mode: 'blocked',
      preventAccidentalPress: true,
      soundAlertEnabled: false,
    },
    Insert: {
      id: 'Insert',
      name: 'Insert (挿入/上書き)',
      description: '文字入力時の上書きモード切替。誤って文字を消してしまう事故を防ぎます。',
      isCurrentlyActive: false,
      mode: 'blocked',
      preventAccidentalPress: true,
      soundAlertEnabled: true,
    },
    WinKey: {
      id: 'WinKey',
      name: 'Windowsキー (WinLock)',
      description: 'ゲームプレイ時や作業中のスタートメニュー誤表示を防止します。',
      isCurrentlyActive: true,
      mode: 'normal',
      preventAccidentalPress: false,
      soundAlertEnabled: false,
    },
    FnKey: {
      id: 'FnKey',
      name: 'Fn Lock',
      description: 'ファンクションキー(F1-F12)の標準動作とメディアキーの切替を固定します。',
      isCurrentlyActive: true,
      mode: 'normal',
      preventAccidentalPress: false,
      soundAlertEnabled: false,
    },
  };
};

/**
 * 特定のLockキーの制御モードを更新します
 * @param currentMap 現在のLockStateMap
 * @param targetKey 変更対象のキー
 * @param newMode 新しい制御モード
 * @returns 更新されたLockStateMap
 */
export const updateLockKeyMode = (
  currentMap: LockStateMap,
  targetKey: LockKeyType,
  newMode: LockMode
): LockStateMap => {
  try {
    const existingConfig = currentMap[targetKey];
    if (!existingConfig) {
      return { ...currentMap };
    }

    return {
      ...currentMap,
      [targetKey]: {
        ...existingConfig,
        mode: newMode,
      },
    };
  } catch (error) {
    // 例外発生時は元の状態を保持
    return currentMap;
  }
};

/**
 * 特定のLockキーのActive状態（ON/OFF）をトグルまたは直接変更します
 * @param currentMap 現在のLockStateMap
 * @param targetKey 変更対象のキー
 * @param forcedState 直接指定する場合のboolean
 * @returns 更新されたLockStateMap
 */
export const toggleLockState = (
  currentMap: LockStateMap,
  targetKey: LockKeyType,
  forcedState?: boolean
): LockStateMap => {
  try {
    const existingConfig = currentMap[targetKey];
    if (!existingConfig) {
      return { ...currentMap };
    }

    // blocked モードの場合は状態変更を受け付けない
    if (existingConfig.mode === 'blocked') {
      return currentMap;
    }

    const nextActiveState = forcedState !== undefined ? forcedState : !existingConfig.isCurrentlyActive;

    return {
      ...currentMap,
      [targetKey]: {
        ...existingConfig,
        isCurrentlyActive: nextActiveState,
      },
    };
  } catch (error) {
    return currentMap;
  }
};

/**
 * 物理キーボードイベントからLockキー押下の警告・ガード判定を行います
 * @param keyCode イベントから取得されたキーコード（例: 'NumLock', 'CapsLock'）
 * @param currentMap 現在のLockStateMap
 * @returns ガードすべきかどうか、メッセージ、音声通知要否
 */
export const evaluateKeyPressGuard = (
  keyCode: string,
  currentMap: LockStateMap
): { shouldBlock: boolean; alertMessage: string; triggerSound: boolean } => {
  const normalizedKeyMap: Record<string, LockKeyType> = {
    NumLock: 'NumLock',
    CapsLock: 'CapsLock',
    ScrollLock: 'ScrollLock',
    Insert: 'Insert',
    MetaLeft: 'WinKey',
    MetaRight: 'WinKey',
  };

  const matchedLockKey = normalizedKeyMap[keyCode];

  if (!matchedLockKey || !currentMap[matchedLockKey]) {
    return {
      shouldBlock: false,
      alertMessage: '',
      triggerSound: false,
    };
  }

  const config = currentMap[matchedLockKey];

  if (config.mode === 'blocked') {
    return {
      shouldBlock: true,
      alertMessage: `【誤押しブロック】${config.name} はロック無効化されています。`,
      triggerSound: config.soundAlertEnabled,
    };
  }

  if (config.mode === 'force_on' && !config.isCurrentlyActive) {
    return {
      shouldBlock: true,
      alertMessage: `【状態維持】${config.name} は常時ONに固定されています。`,
      triggerSound: config.soundAlertEnabled,
    };
  }

  if (config.mode === 'force_off' && config.isCurrentlyActive) {
    return {
      shouldBlock: true,
      alertMessage: `【状態維持】${config.name} は常時OFFに固定されています。`,
      triggerSound: config.soundAlertEnabled,
    };
  }

  return {
    shouldBlock: false,
    alertMessage: `${config.name} の状態が変更されました。`,
    triggerSound: false,
  };
};

/**
 * デフォルトのプリセットプロファイル一覧を取得します
 * @returns UserProfileの配列
 */
export const getDefaultProfiles = (): UserProfile[] => {
  const defaultState = createDefaultLockStateMap();

  const gamingState = { ...defaultState };
  gamingState.WinKey = { ...gamingState.WinKey, mode: 'blocked', preventAccidentalPress: true };
  gamingState.NumLock = { ...gamingState.NumLock, mode: 'force_on' };
  gamingState.CapsLock = { ...gamingState.CapsLock, mode: 'blocked' };

  const typingState = { ...defaultState };
  typingState.Insert = { ...typingState.Insert, mode: 'blocked' };
  typingState.CapsLock = { ...typingState.CapsLock, mode: 'blocked' };

  return [
    {
      id: 'default',
      name: '標準ガードプロファイル',
      description: 'NumLock固定、CapsLock/Insertキーの誤押しを標準防止します。',
      iconName: 'Shield',
      keyConfigs: defaultState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'gaming',
      name: 'ゲーミングモード',
      description: 'Windowsキーを完全に無効化し、誤操作によるデスクトップ復帰を防止します。',
      iconName: 'Gamepad',
      keyConfigs: gamingState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'document-editing',
      name: '文書作成・タイピング集中モード',
      description: 'Insert（上書きモード）キーとCapsLockを徹底ブロックします。',
      iconName: 'FileText',
      keyConfigs: typingState,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
};
