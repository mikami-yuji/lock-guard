'use client';

import React from 'react';
import { LockStateMap } from '@/types';
import { ShieldCheck, Command } from 'lucide-react';

type KeyboardStatusHeaderProps = {
  lockStateMap: LockStateMap;
};

/**
 * MacBook Pro Touch Bar / メタルバー風 リアルタイムキーボードステータスビジュアライザー
 */
export const KeyboardStatusHeader: React.FC<KeyboardStatusHeaderProps> = ({
  lockStateMap,
}): React.ReactElement => {
  const keys = Object.values(lockStateMap);

  return (
    <div className="flex items-center gap-3">
      {/* ロゴ＆ブランド */}
      <div className="flex items-center gap-2.5">
        <div className="p-2 rounded-xl bg-gradient-to-b from-zinc-800 to-zinc-950 border border-white/10 shadow-lg flex items-center justify-center">
          <Command className="w-4 h-4 text-zinc-100" />
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-zinc-100">
              LOCK GUARD
            </h1>
          </div>
        </div>
      </div>

      {/* ライブミニキーボードビジュアライザー (ハードウェアステータスバー) */}
      <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0b0b0e] border border-white/10 shadow-inner">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-1" />
        {keys.map((k) => {
          let badgeClass = 'bg-zinc-850 text-zinc-500 border-zinc-800';
          if (k.mode === 'blocked') {
            badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40 shadow-[0_0_8px_rgba(244,63,94,0.4)] animate-pulse';
          } else if (k.isCurrentlyActive) {
            badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.3)]';
          }

          return (
            <div
              key={k.id}
              className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border transition-all flex items-center gap-1 ${badgeClass}`}
            >
              <span className="opacity-75">{k.name.substring(0, 4)}</span>
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  k.mode === 'blocked'
                    ? 'bg-rose-400 shadow-[0_0_4px_#fb7185]'
                    : k.isCurrentlyActive
                    ? 'bg-emerald-400 shadow-[0_0_4px_#34d399]'
                    : 'bg-zinc-600'
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
