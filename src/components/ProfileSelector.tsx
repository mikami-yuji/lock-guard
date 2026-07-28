'use client';

import React from 'react';
import Link from 'next/link';
import { UserProfile } from '@/types';
import { Shield, Gamepad, FileText, Check, ArrowRight } from 'lucide-react';

type ProfileSelectorProps = {
  profiles: UserProfile[];
  activeProfileId: string;
  onSelectProfile: (profile: UserProfile) => void;
};

/**
 * プリセットプロファイル選択コンポーネント
 */
export const ProfileSelector: React.FC<ProfileSelectorProps> = ({
  profiles,
  activeProfileId,
  onSelectProfile,
}): React.ReactElement => {
  const getIcon = (iconName: string): React.ReactElement => {
    switch (iconName) {
      case 'Gamepad':
        return <Gamepad className="w-5 h-5" />;
      case 'FileText':
        return <FileText className="w-5 h-5" />;
      case 'Shield':
      default:
        return <Shield className="w-5 h-5" />;
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100">プリセットプロファイル</h2>
          <p className="text-xs text-slate-400">目的別に最適化されたLockガード設定をワンクリック適用</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {profiles.map((profile) => {
          const isActive = profile.id === activeProfileId;

          return (
            <div
              key={profile.id}
              onClick={(): void => onSelectProfile(profile)}
              className={`p-4 rounded-xl cursor-pointer transition-all duration-200 border flex flex-col justify-between ${
                isActive
                  ? 'bg-gradient-to-br from-sky-500/15 to-indigo-500/15 border-sky-500/50 shadow-md shadow-sky-500/10'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/40'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div
                    className={`p-2 rounded-lg ${
                      isActive ? 'bg-sky-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {getIcon(profile.iconName)}
                  </div>
                  {isActive && (
                    <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      <Check className="w-3 h-3" />
                      適用中
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-200 mb-1">{profile.name}</h3>
                <p className="text-xs text-slate-400 leading-normal mb-3">{profile.description}</p>
              </div>

              <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">クリックで切替</span>
                <Link
                  href={`/profiles/${profile.id}`}
                  onClick={(e: React.MouseEvent): void => e.stopPropagation()}
                  className="text-xs text-sky-400 hover:text-sky-300 flex items-center gap-1 hover:underline"
                >
                  詳細設定
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
