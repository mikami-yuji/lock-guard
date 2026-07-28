import {
  createDefaultLockStateMap,
  updateLockKeyMode,
  toggleLockState,
  evaluateKeyPressGuard,
  getDefaultProfiles,
} from '../lockManager';
import { LockStateMap } from '@/types';

describe('lockManager utility tests', () => {
  let defaultStateMap: LockStateMap;

  beforeEach(() => {
    defaultStateMap = createDefaultLockStateMap();
  });

  test('createDefaultLockStateMap should initialize all Lock keys with correct default properties', () => {
    expect(defaultStateMap.NumLock).toBeDefined();
    expect(defaultStateMap.NumLock.mode).toBe('force_on');
    expect(defaultStateMap.CapsLock.mode).toBe('blocked');
    expect(defaultStateMap.Insert.mode).toBe('blocked');
    expect(defaultStateMap.ScrollLock.mode).toBe('blocked');
    expect(defaultStateMap.WinKey.mode).toBe('normal');
  });

  test('updateLockKeyMode should update specified lock key mode', () => {
    const updated = updateLockKeyMode(defaultStateMap, 'NumLock', 'blocked');
    expect(updated.NumLock.mode).toBe('blocked');
    // 他のキーは変更されていないことを確認
    expect(updated.CapsLock.mode).toBe('blocked');
  });

  test('updateLockKeyMode should handle invalid keys gracefully', () => {
    // @ts-ignore テスト用無効キー
    const updated = updateLockKeyMode(defaultStateMap, 'NonExistentKey', 'normal');
    expect(updated).toEqual(defaultStateMap);
  });

  test('toggleLockState should toggle state when not blocked', () => {
    const initialNumLockState = defaultStateMap.NumLock.isCurrentlyActive;
    const toggled = toggleLockState(defaultStateMap, 'NumLock');
    expect(toggled.NumLock.isCurrentlyActive).toBe(!initialNumLockState);
  });

  test('toggleLockState should support forcing specific boolean state', () => {
    const forced = toggleLockState(defaultStateMap, 'NumLock', false);
    expect(forced.NumLock.isCurrentlyActive).toBe(false);
  });

  test('toggleLockState should not toggle when mode is blocked', () => {
    // CapsLock は blocked 設定
    const initialCapsState = defaultStateMap.CapsLock.isCurrentlyActive;
    const result = toggleLockState(defaultStateMap, 'CapsLock');
    expect(result.CapsLock.isCurrentlyActive).toBe(initialCapsState);
  });

  test('evaluateKeyPressGuard should accurately block pressed key if configured as blocked', () => {
    const result = evaluateKeyPressGuard('CapsLock', defaultStateMap);
    expect(result.shouldBlock).toBe(true);
    expect(result.alertMessage).toContain('無効化されています');
  });

  test('evaluateKeyPressGuard should evaluate force_on when state becomes inactive', () => {
    const stateMap = { ...defaultStateMap };
    stateMap.NumLock.isCurrentlyActive = false; // 強制ONなのにOFF状態になった場合
    const result = evaluateKeyPressGuard('NumLock', stateMap);
    expect(result.shouldBlock).toBe(true);
    expect(result.alertMessage).toContain('常時ONに固定されています');
  });

  test('evaluateKeyPressGuard should evaluate force_off when state becomes active', () => {
    const stateMap = { ...defaultStateMap };
    stateMap.NumLock.mode = 'force_off';
    stateMap.NumLock.isCurrentlyActive = true;
    const result = evaluateKeyPressGuard('NumLock', stateMap);
    expect(result.shouldBlock).toBe(true);
    expect(result.alertMessage).toContain('常時OFFに固定されています');
  });

  test('evaluateKeyPressGuard should allow keypress when normal mode or unhandled key', () => {
    const normalResult = evaluateKeyPressGuard('MetaLeft', defaultStateMap);
    expect(normalResult.shouldBlock).toBe(false);

    const unknownResult = evaluateKeyPressGuard('KeyA', defaultStateMap);
    expect(unknownResult.shouldBlock).toBe(false);
  });

  test('getDefaultProfiles should return initial preset list', () => {
    const profiles = getDefaultProfiles();
    expect(profiles.length).toBeGreaterThanOrEqual(3);
    expect(profiles[0].id).toBe('default');
    expect(profiles[1].id).toBe('gaming');
    expect(profiles[2].id).toBe('document-editing');
  });
});
