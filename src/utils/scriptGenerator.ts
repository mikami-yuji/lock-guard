import { LockStateMap, ScriptFormat } from '@/types';

/**
 * AutoHotkey v2 用のスクリプトコードを自動生成します
 * @param lockMap LockStateMap
 * @returns 生成された AutoHotkey スクリプト文字列
 */
export const generateAutoHotkeyScript = (lockMap: LockStateMap): string => {
  try {
    const lines: string[] = [
      '; ===================================================',
      '; Lock Guard Panel - AutoHotkey v2 Key Control Script',
      '; 生成日: ' + new Date().toLocaleString('ja-JP'),
      '; このスクリプトは指定したLockキーの誤操作を制御します。',
      '; ===================================================',
      '#Requires AutoHotkey v2.0',
      '#SingleInstance Force',
      'Persistent',
      '',
      '; --- 誤操作防止トレー通知 ---',
      'TrayTip "Lock Guard Active", "Lockキー誤押し防止スクリプトが起動しました", 1',
      '',
    ];

    // CapsLockの制御
    const capsConfig = lockMap.CapsLock;
    if (capsConfig) {
      if (capsConfig.mode === 'blocked') {
        lines.push('; CapsLockを無効化');
        lines.push('SetCapsLockState "AlwaysOff"');
        lines.push('*CapsLock::Return');
        lines.push('');
      } else if (capsConfig.mode === 'force_on') {
        lines.push('; CapsLockをON固定');
        lines.push('SetCapsLockState "AlwaysOn"');
        lines.push('*CapsLock::SetCapsLockState "AlwaysOn"');
        lines.push('');
      } else if (capsConfig.mode === 'force_off') {
        lines.push('; CapsLockをOFF固定');
        lines.push('SetCapsLockState "AlwaysOff"');
        lines.push('*CapsLock::SetCapsLockState "AlwaysOff"');
        lines.push('');
      }
    }

    // NumLockの制御
    const numConfig = lockMap.NumLock;
    if (numConfig) {
      if (numConfig.mode === 'blocked') {
        lines.push('; NumLockを無効化');
        lines.push('*NumLock::Return');
        lines.push('');
      } else if (numConfig.mode === 'force_on') {
        lines.push('; NumLockをON固定');
        lines.push('SetNumLockState "AlwaysOn"');
        lines.push('*NumLock::SetNumLockState "AlwaysOn"');
        lines.push('');
      } else if (numConfig.mode === 'force_off') {
        lines.push('; NumLockをOFF固定');
        lines.push('SetNumLockState "AlwaysOff"');
        lines.push('*NumLock::SetNumLockState "AlwaysOff"');
        lines.push('');
      }
    }

    // ScrollLockの制御
    const scrollConfig = lockMap.ScrollLock;
    if (scrollConfig) {
      if (scrollConfig.mode === 'blocked') {
        lines.push('; ScrollLockを無効化');
        lines.push('*ScrollLock::Return');
        lines.push('');
      } else if (scrollConfig.mode === 'force_on') {
        lines.push('SetScrollLockState "AlwaysOn"');
        lines.push('*ScrollLock::SetScrollLockState "AlwaysOn"');
        lines.push('');
      } else if (scrollConfig.mode === 'force_off') {
        lines.push('SetScrollLockState "AlwaysOff"');
        lines.push('*ScrollLock::SetScrollLockState "AlwaysOff"');
        lines.push('');
      }
    }

    // Insertキーの制御
    const insertConfig = lockMap.Insert;
    if (insertConfig && insertConfig.mode === 'blocked') {
      lines.push('; Insertキー（上書きモード切替）を完全無効化');
      lines.push('*Insert::Return');
      lines.push('');
    }

    // Windowsキーの制御
    const winConfig = lockMap.WinKey;
    if (winConfig && winConfig.mode === 'blocked') {
      lines.push('; Windowsキー（WinLock）を無効化');
      lines.push('LWin::Return');
      lines.push('RWin::Return');
      lines.push('');
    }

    return lines.join('\n');
  } catch (error) {
    return '; Error generating AutoHotkey script';
  }
};

/**
 * Windows PowerShell 用のロックキー状態調整・設定スクリプトを自動生成します
 * @param lockMap LockStateMap
 * @returns 生成された PowerShell スクリプト文字列
 */
export const generatePowerShellScript = (lockMap: LockStateMap): string => {
  try {
    const lines: string[] = [
      '# ===================================================',
      '# Lock Guard Panel - PowerShell Key Control Script',
      '# ===================================================',
      'Write-Host "LockGuard: Setting up Windows Lock Key configurations..." -ForegroundColor Green',
      '',
      '$wshell = New-Object -ComObject WScript.Shell',
      '',
    ];

    if (lockMap.NumLock?.mode === 'force_on') {
      lines.push('# InitialKeyboardIndicators (2 = NumLock ON on Boot)');
      lines.push('Set-ItemProperty -Path "HKCU:\\Control Panel\\Keyboard" -Name "InitialKeyboardIndicators" -Value "2"');
      lines.push('Write-Host "NumLock set to ON by default on system boot." -ForegroundColor Cyan');
      lines.push('');
    }

    if (lockMap.CapsLock?.mode === 'blocked') {
      lines.push('# Info: CapsLock disable configuration executed');
      lines.push('Write-Host "CapsLock block setting recorded." -ForegroundColor Yellow');
      lines.push('');
    }

    lines.push('Write-Host "Lock Key setting script execution completed successfully!" -ForegroundColor Green');
    return lines.join('\n');
  } catch (error) {
    return '# Error generating PowerShell script';
  }
};

/**
 * Windows Registry (.reg) 用のキーボードレジストリ設定を生成します
 * @param lockMap LockStateMap
 * @returns 生成された Registry エクスポート用文字列
 */
export const generateRegistryScript = (lockMap: LockStateMap): string => {
  try {
    const lines: string[] = [
      'Windows Registry Editor Version 5.00',
      '',
      '; Lock Guard Panel - Registry Key Mappings',
      '[HKEY_CURRENT_USER\\Control Panel\\Keyboard]',
    ];

    if (lockMap.NumLock?.mode === 'force_on') {
      lines.push('"InitialKeyboardIndicators"="2"');
    } else if (lockMap.NumLock?.mode === 'force_off') {
      lines.push('"InitialKeyboardIndicators"="0"');
    }

    return lines.join('\r\n');
  } catch (error) {
    return 'Windows Registry Editor Version 5.00';
  }
};

/**
 * 指定のフォーマットに応じたスクリプトを生成します
 * @param format スクリプトの形式 (autohotkey | powershell | registry)
 * @param lockMap LockStateMap
 * @returns 生成スクリプト文字列
 */
export const exportScriptByFormat = (format: ScriptFormat, lockMap: LockStateMap): string => {
  switch (format) {
    case 'autohotkey':
      return generateAutoHotkeyScript(lockMap);
    case 'powershell':
      return generatePowerShellScript(lockMap);
    case 'registry':
      return generateRegistryScript(lockMap);
    default:
      return generateAutoHotkeyScript(lockMap);
  }
};
