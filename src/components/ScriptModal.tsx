'use client';

import React, { useState } from 'react';
import { LockStateMap, ScriptFormat } from '@/types';
import { exportScriptByFormat } from '@/utils/scriptGenerator';
import { X, Copy, Check, Download, Terminal, ExternalLink, HelpCircle, Power } from 'lucide-react';

type ScriptModalProps = {
  isOpen: boolean;
  onClose: () => void;
  lockStateMap: LockStateMap;
};

/**
 * AHK / PowerShell スクリプト表示・エクスポート・使い方ガイドモーダル
 */
export const ScriptModal: React.FC<ScriptModalProps> = ({
  isOpen,
  onClose,
  lockStateMap,
}): React.ReactElement | null => {
  const [format, setFormat] = useState<ScriptFormat>('autohotkey');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'script' | 'guide'>('script');

  if (!isOpen) return null;

  const scriptText = exportScriptByFormat(format, lockStateMap);

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(scriptText);
      setCopied(true);
      setTimeout((): void => {
        setCopied(false);
      }, 2000);
    } catch (e) {
      // エラーハンドリング
    }
  };

  const handleDownload = (): void => {
    try {
      const ext = format === 'autohotkey' ? 'ahk' : format === 'powershell' ? 'ps1' : 'reg';
      const blob = new Blob([scriptText], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `LockGuard_${format}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      // エラーハンドリング
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-2xl macbook-card rounded-2xl p-6 border border-white/10 space-y-4 shadow-2xl">
        {/* モーダルヘッダー */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-zinc-100 font-bold text-base">
            <Terminal className="w-5 h-5 text-zinc-300" />
            <span>PC適用スクリプト ＆ 使い方ガイド</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* モーダル切替タブ */}
        <div className="mac-segmented-track flex gap-1">
          <button
            onClick={(): void => setActiveTab('script')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'script' ? 'mac-segmented-item-active font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📄 スクリプト出力
          </button>
          <button
            onClick={(): void => setActiveTab('guide')}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'guide' ? 'mac-segmented-item-active font-bold' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            📖 使い方 ＆ スタートアップ登録ガイド
          </button>
        </div>

        {activeTab === 'script' ? (
          <>
            {/* フォーマット切り替え */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400">フォーマット:</span>
              <button
                onClick={(): void => setFormat('autohotkey')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  format === 'autohotkey'
                    ? 'bg-zinc-800 text-zinc-100 border-white/20'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-850'
                }`}
              >
                AutoHotkey v2 (.ahk)
              </button>
              <button
                onClick={(): void => setFormat('powershell')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                  format === 'powershell'
                    ? 'bg-zinc-800 text-zinc-100 border-white/20'
                    : 'bg-zinc-950 text-zinc-500 border-zinc-850'
                }`}
              >
                PowerShell (.ps1)
              </button>
            </div>

            {/* スクリプトプレビュー */}
            <pre className="p-4 bg-[#0a0a0d] rounded-xl border border-white/10 text-xs font-mono text-emerald-400 overflow-y-auto max-h-48 leading-relaxed">
              <code>{scriptText}</code>
            </pre>

            {/* 公式サイトリンク */}
            <div className="p-3 rounded-xl bg-zinc-900/80 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-zinc-400">
              <div>
                <span>AutoHotkeyが未インストールの場合は公式サイトからダウンロードできます。</span>
              </div>
              <a
                href="https://www.autohotkey.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-semibold underline shrink-0"
              >
                AutoHotkey 公式サイト (autohotkey.com)
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* 下部ボタン */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                onClick={handleCopy}
                className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/10"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                {copied ? 'コピー完了' : 'コードコピー'}
              </button>
              <button
                onClick={handleDownload}
                className="px-4.5 py-2 rounded-xl bg-gradient-to-b from-[#2a2a32] via-[#202026] to-[#16161c] hover:from-[#32323c] text-zinc-100 border border-white/15 text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-md"
              >
                <Download className="w-4 h-4 text-zinc-300" />
                保存 (.{format === 'autohotkey' ? 'ahk' : format === 'powershell' ? 'ps1' : 'reg'})
              </button>
            </div>
          </>
        ) : (
          /* 使い方 ＆ スタートアップ登録ガイド */
          <div className="space-y-3 py-1 text-xs text-zinc-300 max-h-80 overflow-y-auto pr-1">
            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm">
                <HelpCircle className="w-4 h-4 text-sky-400" />
                <span>基本の使い方（3ステップ）</span>
              </div>
              <ol className="list-decimal list-inside space-y-1 text-zinc-300 leading-relaxed">
                <li>本画面の「保存 (.ahk)」を押してファイル（例: `LockGuard_autohotkey.ahk`）をダウンロード。</li>
                <li>AutoHotkey本体が未インストールの場合は <a href="https://www.autohotkey.com/" target="_blank" rel="noopener noreferrer" className="text-sky-400 underline font-semibold">autohotkey.com</a> からインストール。</li>
                <li>ダウンロードした `.ahk` ファイルをダブルクリックするだけで即座にPC全体で無効化・固定が効き始めます！</li>
              </ol>
            </div>

            <div className="p-3.5 rounded-xl bg-zinc-900/90 border border-white/10 space-y-2">
              <div className="flex items-center gap-2 font-bold text-zinc-100 text-sm">
                <Power className="w-4 h-4 text-emerald-400" />
                <span>PC起動時に自動で動かす（スタートアップ登録）</span>
              </div>
              <p className="text-zinc-400 leading-relaxed">
                パソコンを再起動するたびに毎回ファイルをダブルクリックしなくても、自動で常時保護されるように設定できます。
              </p>
              <ol className="list-decimal list-inside space-y-1.5 text-zinc-300 leading-relaxed">
                <li>キーボードの <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-sky-300 font-mono">Win + R</code> キーを同時に押します。</li>
                <li>出てきた入力欄に <code className="px-1.5 py-0.5 rounded bg-zinc-800 text-emerald-300 font-mono">shell:startup</code> と入力して <strong>Enter</strong> を押します。</li>
                <li>開いたフォルダ内にダウンロードした `.ahk` ファイル（またはそのショートカット）をドラッグ＆ドロップで配置します。</li>
              </ol>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
