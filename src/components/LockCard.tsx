'use client';

import React from 'react';
import { LockKeyConfig, LockMode } from '@/types';
import { ShieldAlert, CheckCircle2, MinusCircle } from 'lucide-react';

type LockCardProps = {
  config: LockKeyConfig;
  onModeChange: (keyId: LockKeyConfig['id'], mode: LockMode) => void;
  onToggleActive: (keyId: LockKeyConfig['id']) => void;
  isPressed?: boolean;
};

/**
 * 3D Physical Keycap 刻印プレート ＆ macOS Control Center セグメントスライダー搭載ハイエンドLockカード
 */
export const LockCard: React.FC<LockCardProps> = ({
  config,
  onModeChange,
  isPressed = false,
}): React.ReactElement => {
  // キー刻印名 (3Dキーキャッププレート用)
  const getKeycapLabel = (id: LockKeyConfig['id']): string => {
    switch (id) {
      case 'NumLock':
        return 'Num ⇚';
      case 'CapsLock':
        return 'Caps ⇪';
      case 'ScrollLock':
        return 'Scr ⇳';
      case 'Insert':
        return 'Ins ⎀';
      case 'WinKey':
        return 'Win ⌘';
      case 'FnKey':
      default:
        return 'Fn 🌐';
    }
  };

  // LEDクラス
  const getLedClass = (): string => {
    if (config.mode === 'blocked') return 'apple-led-ring apple-led-blocked';
    if (config.isCurrentlyActive) return 'apple-led-ring apple-led-active';
    return 'apple-led-ring apple-led-off';
  };

  // ステータスバッジ
  const getStatusBadge = (): React.ReactElement => {
    switch (config.mode) {
      case 'blocked':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            完全遮断
          </span>
        );
      case 'force_on':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ON固定
          </span>
        );
      case 'force_off':
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <MinusCircle className="w-3 h-3 text-amber-400" />
            OFF固定
          </span>
        );
      case 'normal':
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-zinc-850 text-zinc-400 border border-zinc-750">
            {config.isCurrentlyActive ? '状態: ON' : '状態: OFF'}
          </span>
        );
    }
  };

  // モード別カードアクセントクラス
  const getCardModeClass = (): string => {
    if (config.mode === 'blocked') return 'ultra-card-blocked';
    if (config.mode === 'force_on') return 'ultra-card-force-on';
    if (config.mode === 'force_off') return 'ultra-card-force-off';
    return '';
  };

  // 物理キー押下時のバウンド＆フラッシュクラス
  const pressedCardStyle = isPressed
    ? config.mode === 'blocked'
      ? 'scale-[1.035] -translate-y-2 border-rose-400/90 shadow-[0_0_40px_rgba(244,63,94,0.7)] ring-2 ring-rose-400/50'
      : config.mode === 'force_on'
      ? 'scale-[1.035] -translate-y-2 border-emerald-400/90 shadow-[0_0_40px_rgba(52,211,153,0.7)] ring-2 ring-emerald-400/50'
      : config.mode === 'force_off'
      ? 'scale-[1.035] -translate-y-2 border-amber-400/90 shadow-[0_0_40px_rgba(245,158,11,0.7)] ring-2 ring-amber-400/50'
      : 'scale-[1.035] -translate-y-2 border-sky-400/90 shadow-[0_0_40px_rgba(14,165,233,0.7)] ring-2 ring-sky-400/50'
    : '';

  return (
    <div className={`ultra-card ${getCardModeClass()} ${pressedCardStyle} transition-all duration-200 ease-out rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full relative overflow-hidden group`}>
      {/* 繊細なメタルリフレクションハイライト */}
      <div className="absolute -inset-px bg-gradient-to-r from-white/0 via-white/10 to-white/0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* キー押下時のフラッシュオーラ */}
      {isPressed && (
        <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-emerald-500/10 to-white/10 animate-pulse pointer-events-none" />
      )}

      {/* カードヘッダー */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-3">
            {/* 3D Physical Keycap 刻印プレート (押下時キーキャップ沈み込み) */}
            <div
              className={`mac-keycap-3d px-3 py-1.5 rounded-xl font-mono text-xs font-bold text-zinc-200 shadow-md flex items-center justify-center transition-transform duration-100 ${
                isPressed ? 'translate-y-1 scale-95 border-emerald-400 bg-zinc-800 shadow-inner' : ''
              }`}
            >
              {getKeycapLabel(config.id)}
            </div>

            <div className="flex items-center gap-2">
              <div className={getLedClass()} title={config.isCurrentlyActive ? 'ACTIVE' : 'INACTIVE'} />
              <h3 className="text-sm sm:text-base font-bold text-zinc-100 tracking-tight">
                {config.name}
              </h3>
            </div>
          </div>

          {getStatusBadge()}
        </div>

        {/* 説明テキスト */}
        <p className="text-[11px] sm:text-xs text-zinc-400 leading-relaxed font-normal mb-4 min-h-[32px]">
          {config.description}
        </p>
      </div>

      {/* macOS Control Center セグメントスライダー */}
      <div className="mac-segmented-track grid grid-cols-4 gap-1">
        {(['normal', 'force_on', 'force_off', 'blocked'] as LockMode[]).map((mode) => {
          const isSelected = config.mode === mode;
          const labels: Record<LockMode, string> = {
            normal: '標準',
            force_on: 'ON固定',
            force_off: 'OFF固定',
            blocked: '遮断',
          };

          let activeStyleClass = 'mac-segmented-item-active font-semibold';
          if (isSelected) {
            if (mode === 'blocked') activeStyleClass = 'mac-segmented-item-blocked font-bold';
            else if (mode === 'force_on') activeStyleClass = 'mac-segmented-item-force-on font-bold';
            else if (mode === 'force_off') activeStyleClass = 'mac-segmented-item-force-off font-bold';
          }

          return (
            <button
              key={mode}
              onClick={(): void => onModeChange(config.id, mode)}
              className={`py-2 text-[11px] sm:text-xs rounded-lg transition-all duration-150 active:scale-95 flex items-center justify-center font-medium ${
                isSelected
                  ? activeStyleClass
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {labels[mode]}
            </button>
          );
        })}
      </div>
    </div>
  );
};
