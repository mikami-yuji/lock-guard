import {
  generateAutoHotkeyScript,
  generatePowerShellScript,
  generateRegistryScript,
  exportScriptByFormat,
} from '../scriptGenerator';
import { createDefaultLockStateMap, updateLockKeyMode } from '../lockManager';

describe('scriptGenerator tests with full branch coverage', () => {
  const defaultLockMap = createDefaultLockStateMap();

  test('generateAutoHotkeyScript handles all modes for CapsLock, NumLock, ScrollLock, Insert, and WinKey', () => {
    let map = { ...defaultLockMap };
    map = updateLockKeyMode(map, 'CapsLock', 'force_on');
    map = updateLockKeyMode(map, 'NumLock', 'blocked');
    map = updateLockKeyMode(map, 'ScrollLock', 'force_on');
    map = updateLockKeyMode(map, 'WinKey', 'blocked');
    map = updateLockKeyMode(map, 'Insert', 'blocked');

    const script1 = generateAutoHotkeyScript(map);
    expect(script1).toContain('SetCapsLockState "AlwaysOn"');
    expect(script1).toContain('*NumLock::Return');
    expect(script1).toContain('SetScrollLockState "AlwaysOn"');
    expect(script1).toContain('LWin::Return');
    expect(script1).toContain('*Insert::Return');

    // 次に CapsLock: force_off, NumLock: force_off, ScrollLock: force_off, ScrollLock: blocked, WinKey: force_off, Insert: force_off
    let map2 = { ...defaultLockMap };
    map2 = updateLockKeyMode(map2, 'CapsLock', 'force_off');
    map2 = updateLockKeyMode(map2, 'NumLock', 'force_off');
    map2 = updateLockKeyMode(map2, 'ScrollLock', 'force_off');
    map2 = updateLockKeyMode(map2, 'WinKey', 'force_off');
    map2 = updateLockKeyMode(map2, 'Insert', 'force_off');

    const script2 = generateAutoHotkeyScript(map2);
    expect(script2).toContain('SetCapsLockState "AlwaysOff"');
    expect(script2).toContain('SetNumLockState "AlwaysOff"');
    expect(script2).toContain('SetScrollLockState "AlwaysOff"');
    expect(script2).toContain('LWin::Return');
    expect(script2).toContain('*Insert::Return');

    let map3 = { ...defaultLockMap };
    map3 = updateLockKeyMode(map3, 'ScrollLock', 'blocked');
    const script3 = generateAutoHotkeyScript(map3);
    expect(script3).toContain('*ScrollLock::Return');
  });

  test('generatePowerShellScript handles NumLock and CapsLock options', () => {
    let map = { ...defaultLockMap };
    map = updateLockKeyMode(map, 'NumLock', 'force_on');
    map = updateLockKeyMode(map, 'CapsLock', 'blocked');

    const ps = generatePowerShellScript(map);
    expect(ps).toContain('InitialKeyboardIndicators');
    expect(ps).toContain('CapsLock block setting recorded');
  });

  test('generateRegistryScript handles NumLock force_on and force_off', () => {
    let mapOn = { ...defaultLockMap };
    mapOn = updateLockKeyMode(mapOn, 'NumLock', 'force_on');
    const regOn = generateRegistryScript(mapOn);
    expect(regOn).toContain('"InitialKeyboardIndicators"="2"');

    let mapOff = { ...defaultLockMap };
    mapOff = updateLockKeyMode(mapOff, 'NumLock', 'force_off');
    const regOff = generateRegistryScript(mapOff);
    expect(regOff).toContain('"InitialKeyboardIndicators"="0"');
  });

  test('exportScriptByFormat handles all formats including fallback', () => {
    expect(exportScriptByFormat('autohotkey', defaultLockMap)).toContain('AutoHotkey');
    expect(exportScriptByFormat('powershell', defaultLockMap)).toContain('PowerShell');
    expect(exportScriptByFormat('registry', defaultLockMap)).toContain('Registry');
    // @ts-ignore
    expect(exportScriptByFormat('unknown', defaultLockMap)).toContain('AutoHotkey');
  });
});
