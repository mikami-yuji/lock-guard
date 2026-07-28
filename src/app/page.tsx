'use client';

import React, { useState, useEffect } from 'react';
import { LockCard } from '@/components/LockCard';
import { ScriptModal } from '@/components/ScriptModal';
import { KeyboardStatusHeader } from '@/components/KeyboardStatusHeader';
import {
  createDefaultLockStateMap,
  updateLockKeyMode,
  toggleLockState,
  evaluateKeyPressGuard,
  getDefaultProfiles,
} from '@/utils/lockManager';
import { LockStateMap, LockMode, LockKeyConfig, UserProfile } from '@/types';
import { Volume2, VolumeX, Terminal, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';

/**
 * Lock Guard ダッシュボード (1画面完結型)
 */
export default function SingleViewportDashboard(): React.ReactElement {
  const [lockMap, setLockMap] = useState<LockStateMap>(createDefaultLockStateMap());
  const [profiles] = useState<UserProfile[]>(getDefaultProfiles());
  const [activeProfileId, setActiveProfileId] = useState<string>('default');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isScriptModalOpen, setIsScriptModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // リアルタイム・インタラクション状態
  const [pressedKeyId, setPressedKeyId] = useState<LockKeyConfig['id'] | null>(null);
  const [isBeepRippling, setIsBeepRippling] = useState<boolean>(false);

  // キーキャプチャ＆誤押しガード＆リアルタイムバウンド処理
  useEffect((): (() => void) => {
    const mapCodeToKeyId = (code: string): LockKeyConfig['id'] | null => {
      if (code === 'NumLock') return 'NumLock';
      if (code === 'CapsLock') return 'CapsLock';
      if (code === 'ScrollLock') return 'ScrollLock';
      if (code === 'Insert') return 'Insert';
      if (code === 'MetaLeft' || code === 'MetaRight' || code === 'OSLeft' || code === 'OSRight') return 'WinKey';
      if (code.startsWith('F') && !isNaN(Number(code.substring(1)))) return 'FnKey';
      return null;
    };

    const handleKeyDown = (e: KeyboardEvent): void => {
      const targetKeyId = mapCodeToKeyId(e.code);
      if (targetKeyId) {
        setPressedKeyId(targetKeyId);
        setTimeout((): void => {
          setPressedKeyId(null);
        }, 400);
      }

      const evaluation = evaluateKeyPressGuard(e.code, lockMap);
      if (evaluation.alertMessage) {
        showToast(evaluation.alertMessage);

        if (soundEnabled && evaluation.triggerSound) {
          playBeepSound(evaluation.shouldBlock);
        }

        if (evaluation.shouldBlock) {
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return (): void => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [lockMap, soundEnabled]);

  // トースト表示
  const showToast = (msg: string): void => {
    setToastMessage(msg);
    setTimeout((): void => {
      setToastMessage(null);
    }, 2500);
  };

  // 短音ビープ再生＆サウンド波紋トリガー
  const playBeepSound = (isBlocked: boolean): void => {
    setIsBeepRippling(true);
    setTimeout((): void => {
      setIsBeepRippling(false);
    }, 650);

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = isBlocked ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isBlocked ? 220 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // AudioContextエラー時無視
    }
  };

  // モードの変更
  const handleModeChange = (keyId: LockKeyConfig['id'], newMode: LockMode): void => {
    const updated = updateLockKeyMode(lockMap, keyId, newMode);
    setLockMap(updated);
    showToast(`${keyId} の設定を変更しました。「PC適用スクリプトを出力」で保存してください。`);
  };

  // Active状態トグル
  const handleToggleActive = (keyId: LockKeyConfig['id']): void => {
    const updated = toggleLockState(lockMap, keyId);
    setLockMap(updated);
  };

  // プリセット適用
  const handleSelectProfile = (profile: UserProfile): void => {
    setActiveProfileId(profile.id);
    setLockMap({ ...profile.keyConfigs });
    showToast(`プロファイル「${profile.name}」を選択しました。`);
  };

  return (
    <div className="h-screen w-screen overflow-hidden flex flex-col justify-between p-4 sm:p-6 lg:p-8 ambient-bg text-zinc-100 selection:bg-zinc-100 selection:text-zinc-950 relative">
      {/* 超微細サイバーグリッド背景メッシュ */}
      <div className="absolute inset-0 cyber-grid-bg pointer-events-none z-0" />

      {/* シネマティック・ヴィネットオーバーレイ */}
      <div className="absolute inset-0 luxury-vignette z-0" />

      {/* 多層アンビエントオーラ・スポットライト */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[350px] bg-gradient-to-b from-sky-500/10 via-indigo-500/5 to-transparent rounded-full blur-[140px] pointer-events-none z-0" />
      <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse-glow" />
      <div className="absolute bottom-10 -right-32 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[160px] pointer-events-none z-0 animate-pulse-glow" />

      {/* 上部ヘッダー & リアルタイムステータスバー */}
      <header className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 pb-3 border-b border-white/10">
        <KeyboardStatusHeader lockStateMap={lockMap} />

        {/* プリセット切替セグメント */}
        <div className="mac-segmented-track flex items-center gap-1">
          {profiles.map((p) => {
            const isActive = p.id === activeProfileId;
            return (
              <button
                key={p.id}
                onClick={(): void => handleSelectProfile(p)}
                className={`px-3.5 py-1.5 rounded-lg text-xs transition-all active:scale-95 ${
                  isActive
                    ? 'mac-segmented-item-active font-bold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5 font-medium'
                }`}
              >
                {p.name.replace('モード', '').replace('プロファイル', '')}
              </button>
            );
          })}
        </div>
      </header>

      {/* 2ステップ案内ガイドバー */}
      <div className="relative z-10 my-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-zinc-900/95 via-zinc-900/90 to-zinc-900/95 border border-white/15 text-xs flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl backdrop-blur-md">
        {/* STEP 1 */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5" />
            STEP 1
          </span>
          <span className="text-zinc-200 font-medium">
            各キーの制御モード（<span className="text-emerald-400 font-bold">標準</span> / <span className="text-amber-400 font-bold">ON固定</span> / <span className="text-rose-400 font-bold">誤押しブロック</span>）を選択
          </span>
        </div>

        {/* 矢印 */}
        <div className="hidden sm:flex items-center text-zinc-500 shrink-0 px-1">
          <ArrowRight className="w-4 h-4 text-sky-400 animate-pulse-arrow" />
        </div>

        {/* STEP 2 */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <span className="px-2.5 py-1 rounded-lg bg-sky-500/15 border border-sky-500/30 text-sky-400 font-extrabold text-[11px] flex items-center gap-1.5 shrink-0 shadow-sm">
            <Terminal className="w-3.5 h-3.5" />
            STEP 2
          </span>
          <span className="text-zinc-200 font-medium">
            右下の <span className="text-sky-200 font-bold bg-white/10 px-1.5 py-0.5 rounded border border-white/15">【PC適用スクリプトを出力】</span> ボタンを押してWindowsに適用
          </span>
        </div>
      </div>

      {/* 中央エリア: 6個のキーカード (リアルタイム押下リアクティブ) */}
      <main className="relative z-10 flex-1 py-2 sm:py-3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {Object.values(lockMap).map((config) => (
          <LockCard
            key={config.id}
            config={config}
            isPressed={pressedKeyId === config.id}
            onModeChange={handleModeChange}
            onToggleActive={handleToggleActive}
          />
        ))}
      </main>

      {/* 下部ツールバー */}
      <footer className="relative z-10 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={(): void => {
              const nextState = !soundEnabled;
              setSoundEnabled(nextState);
              if (nextState) {
                playBeepSound(false);
              }
            }}
            className={`relative px-3.5 py-2 rounded-xl border font-medium flex items-center gap-2 transition-all active:scale-95 ${
              soundEnabled
                ? 'bg-zinc-900/90 text-zinc-200 border-white/10 hover:border-white/20'
                : 'bg-zinc-950 text-zinc-500 border-zinc-900'
            }`}
          >
            {/* サウンド波紋アニメーションリング */}
            {isBeepRippling && (
              <span className="absolute inset-0 rounded-xl border-2 border-emerald-400 animate-sound-ripple pointer-events-none z-20" />
            )}
            {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            <span>{soundEnabled ? '音響通知: ON' : '音響通知: OFF'}</span>
          </button>
        </div>

        {/* MacBook Space Black スタイルのメタルCTAボタン */}
        <div className="flex items-center gap-3">
          <button
            onClick={(): void => setIsScriptModalOpen(true)}
            className="cta-script-btn px-5 py-2.5 rounded-xl text-zinc-100 font-bold shadow-xl flex items-center gap-2 transition-all active:scale-95"
          >
            <Terminal className="w-4 h-4 text-sky-400" />
            <span>PC適用スクリプトを出力 (STEP 2)</span>
          </button>
        </div>
      </footer>

      {/* トースト表示 */}
      {toastMessage && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 px-4.5 py-2.5 rounded-2xl bg-zinc-900/95 backdrop-blur-md border border-white/20 text-zinc-100 text-xs font-semibold shadow-2xl flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* AHKスクリプト生成モーダル */}
      <ScriptModal
        isOpen={isScriptModalOpen}
        onClose={(): void => setIsScriptModalOpen(false)}
        lockStateMap={lockMap}
      />
    </div>
  );
}
