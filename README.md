# Lock Guard (キーボードLock誤操作防止＆制御パネル)

PC上のあらゆるLockキー（NumLock, CapsLock, ScrollLock, Insertキー, WinLockなど）の意図しない押下トラブルを未然に防止し、状態の監視・強制固定・OSレベル連携スクリプト生成を提供する Next.js App Router アプリケーションです。

---

## 🌟 主な機能

1. **リアルタイム Lock コントロールパネル**:
   - NumLock / CapsLock / ScrollLock / Insert / WinLock / FnLock の動作モード制御
   - **4つの動作モード**: 通常 (Normal), 常時ON固定 (Force ON), 常時OFF固定 (Force OFF), 完全ブロック (Blocked)
2. **キー入力リアルタイムモニター & ガード**:
   - Webブラウザ上でキー押下イベントをキャプチャし、判定ログおよび音声アラート（Web Audio API）を即座にフィードバック
3. **OS統合スクリプト生成 (AutoHotkey v2 / PowerShell / Registry)**:
   - ブラウザ単体では難しいOSレベルの完全キー無効化・NumLock固定を実現するスクリプトをワンクリック生成＆ダウンロード
4. **プロファイル管理 (動的ルーティング `/profiles/[id]`)**:
   - ゲーミングモード、文書作成モード、標準ガードモードなどの設定プリセット切替・編集
5. **通知・サウンドカスタマイズ**:
   - 誤押し時の音響警告・トースト通知のON/OFF調整

---

## 🛠️ 技術スタック

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS (グラスモフィズム & Cyber Dark UI)
- **Icons**: Lucide React
- **Testing**: Jest + React Testing Library (カバレッジ80%以上)
- **CI/CD**: GitHub Actions

---

## 🚀 セットアップ ＆ 起動手順

### 1. 依存パッケージのインストール
```bash
npm install
```

### 2. 開発サーバーの起動
```bash
npm run dev
```
ブラウザで [http://localhost:3000](http://localhost:3000) にアクセスします。

### 3. テストの実行 (カバレッジ確認)
```bash
npm test
```

### 4. リンター ＆ 型チェック
```bash
npm run lint
npx tsc --noEmit
```

### 5. プロダクションビルド
```bash
npm run build
npm run start
```

---

## 💻 OS連携スクリプト (AutoHotkey v2) の利用方法

1. アプリ内の「OS統合スクリプト」画面にアクセスします。
2. AutoHotkey v2 (.ahk) タブを選択し、「ファイル保存」をクリックします。
3. [AutoHotkey 公式サイト](https://www.autohotkey.com/) から AutoHotkey v2 をインストールします。
4. ダウンロードした `.ahk` ファイルをダブルクリックすることで、PC全体でキーブロックが有効化されます。
5. Windows起動時に自動実行したい場合は、`Win + R` キーを押して `shell:startup` を開き、そこに `.ahk` ファイルを配置してください。

---

## 📁 ディレクトリ構造

```text
src/
├── app/
│   ├── globals.css            # グローバルスタイル・グラスモフィズム設計
│   ├── layout.tsx             # 全体共通レイアウト
│   ├── page.tsx               # メインダッシュボード
│   ├── os-integration/        # OSスクリプト生成画面
│   ├── profiles/[id]/         # 動的ルーティング: プロファイル編集
│   └── settings/              # システム・通知設定
├── components/
│   ├── KeyVisualizer.tsx      # キー入力監視＆効果音判定
│   ├── LockCard.tsx           # Lockキー制御カード
│   ├── Navbar.tsx             # 共通ナビゲーション
│   └── ProfileSelector.tsx    # プリセット選択
├── types/
│   └── index.ts               # 一元化された型定義 (type宣言)
└── utils/
    ├── lockManager.ts         # Lockキー制御ビジネスロジック
    ├── scriptGenerator.ts     # AHK/PowerShell生成ロジック
    ├── validator.ts           # 入力サニタイズ・バリデーション
    └── __tests__/             # ユニットテスト群
```
