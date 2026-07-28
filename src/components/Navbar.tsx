'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldAlert, Cpu, Layers, Settings, Keyboard } from 'lucide-react';

/**
 * アプリケーション共通のヘッダー・ナビゲーションバー
 */
export const Navbar: React.FC = (): React.ReactElement => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'ダッシュボード', icon: Keyboard },
    { href: '/profiles/default', label: 'プロファイル管理', icon: Layers },
    { href: '/os-integration', label: 'OS統合スクリプト', icon: Cpu },
    { href: '/settings', label: '設定', icon: Settings },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform duration-200">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-sky-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
              Lock Guard
            </h1>
            <p className="text-xs text-slate-400">キーボードLock誤操作防止 & ステータスコントローラー</p>
          </div>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 bg-slate-900/60 p-1.5 rounded-2xl border border-slate-800">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href.startsWith('/profiles') && pathname.startsWith('/profiles'));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
