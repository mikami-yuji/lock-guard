'use client';

import React, { useEffect, useState } from 'react';
import { LockStateMap } from '@/types';
import { evaluateKeyPressGuard } from '@/utils/lockManager';
import { Keyboard, AlertTriangle, ShieldCheck } from 'lucide-react';

type KeyVisualizerProps = {
  lockStateMap: LockStateMap;
};

/**
 * リアルタイムキーボード監視＆ガードテストコンポーネント
 */
export const KeyVisualizer: React.FC<KeyVisualizerProps> = ({ lockStateMap }): React.ReactElement => {
  const [lastPressedKey, setLastPressedKey] = useState<string>('なし');
  const [guardLog, setGuardLog] = useState<{ time: string; msg: string; isBlocked: boolean }[]>([]);

  useEffect((): (() => void) => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      const code = e.code;
      const keyName = e.key;
      setLastPressedKey(`${keyName} (${code})`);

      const evaluation = evaluateKeyPressGuard(code, lockStateMap);

      if (evaluation.alertMessage) {
        const newLog = {
          time: new Date().toLocaleTimeString('ja-JP'),
          msg: evaluation.alertMessage,
          isBlocked: evaluation.shouldBlock,
        };

        setGuardLog((prev) => [newLog, ...prev].slice(0, 5));

        // サウンドアラート再生（Web Audio APIによる効果音合成）
        if (evaluation.triggerSound) {
          playAlertBeep(evaluation.shouldBlock);
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
  }, [lockStateMap]);

  // Web Audio APIによる短音ビープ再生
  const playAlertBeep = (isBlocked: boolean): void => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = isBlocked ? 'sawtooth' : 'sine';
      osc.frequency.setValueAtTime(isBlocked ? 220 : 440, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch (e) {
      // AudioContext未許可時の無視
    }
  };

  const activeLocks = Object.values(lockStateMap).filter((k) => k.isCurrentlyActive);
  const blockedLocks = Object.values(lockStateMap).filter((k) => k.mode === 'blocked');

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-xl border border-indigo-500/20">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-100">キー入力リアルタイムガード</h2>
            <p className="text-xs text-slate-400">キーボードで実際にNumLockやCapsLockを押してテストできます</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">アクティブ指示器:</span>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900/80 rounded-xl border border-slate-800">
            {activeLocks.length > 0 ? (
              activeLocks.map((k) => (
                <span
                  key={k.id}
                  className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                >
                  {k.name}
                </span>
              ))
            ) : (
              <span className="text-xs text-slate-500">なし</span>
            )}
          </div>
        </div>
      </div>

      {/* テストログ & 押下キーインジケーター */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80 flex flex-col justify-between">
          <span className="text-xs font-semibold text-slate-400 mb-2 block">直近に検知した物理キー:</span>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-slate-800/80 rounded-lg text-sm font-mono text-sky-300 border border-slate-700 shadow-inner">
              {lastPressedKey}
            </div>
            <span className="text-xs text-slate-500">（ブラウザイベントキャプチャ中）</span>
          </div>
        </div>

        <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-400">ガード・誤操作判定ログ:</span>
            <span className="text-[10px] text-slate-500">（最新5件）</span>
          </div>
          {guardLog.length === 0 ? (
            <p className="text-xs text-slate-600 py-2">Lockキーを押すとここに判定結果が表示されます。</p>
          ) : (
            <div className="space-y-1.5 max-h-28 overflow-y-auto">
              {guardLog.map((log, index) => (
                <div
                  key={index}
                  className={`text-xs p-1.5 rounded flex items-center gap-2 ${
                    log.isBlocked
                      ? 'bg-rose-500/10 text-rose-300 border border-rose-500/20'
                      : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                  }`}
                >
                  {log.isBlocked ? <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 text-rose-400" /> : <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0 text-emerald-400" />}
                  <span className="text-[10px] opacity-75 font-mono">{log.time}</span>
                  <span className="truncate">{log.msg}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
