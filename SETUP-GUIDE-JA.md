# セットアップガイド — GitHub SDLC Automation with IBM Bob Level 3

> **対象者:** IBM社員（IBMer）およびビジネスパートナー  
> **所要時間:** 約30〜60分（IBM社員の場合、アカウント承認待ちを除く）  
> **目的:** デモ実施・Stand & Deliver 録画に向けた環境準備

---

## 前提条件の確認

セットアップを始める前に以下をインストールしてください。

| ツール | 必要バージョン | ダウンロード先 |
|---|---|---|
| Node.js | 20 LTS 以上 | https://nodejs.org/ |
| Git | 2.30 以上 | https://git-scm.com/ |
| npm | Node.js に同梱 | — |

> **注:** Part 2（Evolve）を実施するには **GitHub.com アカウント**も必要です。

---

## Step 1: IBM Bob アカウントの取得

### すでに Bob にアクセスできる場合

アカウントをお持ちの場合はこの手順をスキップし、**Step 2: IBM Bob のインストール**へ進んでください。

---

### IBM社員（IBMer）の場合 — Internal 登録

> **所要時間:** 申請自体は数分、**承認まで24時間以上**かかります。  
> 時間に余裕がない場合はトライアル登録をご検討ください。

1. [Bob Enterprise Sales Assets](https://ibm.seismic.com/) を開き、左サイドバーの **Technical Resources** をクリックします
2. **"Internal Bob Sign Up"** タイルの **See it** をクリックします
3. サインアップフォームに必要事項を入力し、**Submit** を押します
4. 確認ポップアップで再度 **Submit** を押し、「Thank you」ポップアップは閉じます
5. 確認メールが届いたら待機します（承認には通常24時間以上かかります）
6. 承認メールが届いたら、メール内の **Download Bob** リンクをクリックします

---

### ビジネスパートナーの場合 — Trial 登録

> **所要時間:** 10分以内。Bobcoin 残高 40 枚・有効期間1ヶ月。  
> IBM社員でも、時間的制約がある場合や Bobcoin を使い切った場合に利用可能です。

1. 以下のトライアル登録ページにアクセスします
   ```
   https://bob.ibm.com/trial
   ```
2. メールアドレスを入力して登録します（**IBMメールアドレス以外**を使用してください）
3. 登録したメールの受信箱を確認し、**7桁の確認コード**をコピーします
4. 確認コードを入力して **Submit** を押します
5. 「Your trial is ready!」が表示されたら **Access your trial now** をクリックします
6. 「Download Bob」ページに遷移します（次の Step 2 に進んでください）

---

## Step 2: IBM Bob のインストールと認証

### インストール

1. OS に合ったインストーラーをダウンロードします（Windows / macOS / Linux）
2. ダウンロードしたファイルをクリックしてインストーラーを起動します
3. ライセンス同意画面で **I accept the agreement** をオンにして **Next** を押します
4. 画面の指示に従って進みます（インストール時間: 約5〜10分）
5. 完了ポップアップで **Launch IBM Bob** にチェックが入っていることを確認し、**Finish** を押します

### 認証

1. IBM Bob が起動したら **Log in to Bob** をクリックします
2. ポップアップで **Allow** をクリックするとブラウザが開きます
3. 続くポップアップで **Open** をクリックします
4. IBM Verify のサインインページで **Choose an option** ドロップダウンを開き、**IBMid** を選択します
5. IBMid とパスワードでログインします
   - 「このウェブサイトが IBM Bob を開こうとしています」と聞かれたら **Yes** をクリックします
6. ブラウザに **「Authentication Successful!」** と表示されたらブラウザを閉じます
7. Bob IDE に戻り、Agentic Sidebar（プロンプト入力欄）が表示されていれば認証完了です

---

## Step 3: ラボアセットのダウンロード

### リポジトリのクローン

1. Bob IDE のメニューバーから **Terminal > New Terminal** を開きます
   （ショートカット: `Ctrl+Shift+`` ）
2. 以下のコマンドを実行してリポジトリをクローンします

   ```bash
   git clone -b github-sdlc-automation https://github.ibm.com/kkamil-ibm/bobl3.git
   ```

   > **クローンできない場合（GitHub アクセス不可）:**  
   > Seismic から同一アセットをダウンロードできます  
   > URL: `https://ibm.seismic.com/Link/Content/DCgb3D6pGjqW984MF2PJPTWFdVgP`

3. クローンしたディレクトリに移動します

   **Mac / Linux:**
   ```bash
   cd ~/"Github SDLC Automation"
   ```

   **Windows:**
   ```cmd
   cd "$HOME\Github SDLC Automation"
   ```

### Bob IDE でフォルダを開く

1. Bob IDE 左端の **Explorer タブ** をクリックします（ショートカット: `Ctrl+Shift+E`）
2. **Open Folder** をクリックし、クローンした `Github SDLC Automation` フォルダを選択します
3. フォルダをダブルクリックするか **Open** を押します
4. 「このフォルダの作成者を信頼しますか？」と表示されたら **Yes, I trust the authors** をクリックします

---

## セットアップ完了チェックリスト

以下をすべて確認してから Part 1 に進んでください。

- [ ] Node.js 20 LTS 以上がインストールされている（`node -v` で確認）
- [ ] Git 2.30 以上がインストールされている（`git --version` で確認）
- [ ] IBM Bob アカウントが承認済みである
- [ ] IBM Bob が起動し、Agentic Sidebar が表示されている（認証済み）
- [ ] `Github SDLC Automation` フォルダが Bob IDE で開かれている
- [ ] GitHub.com アカウントを持っている（Part 2 で必要）

---

## トラブルシューティング

| 症状 | 対処 |
|---|---|
| Internal 登録の承認が来ない（24時間以上経過） | トライアル登録に切り替えることを検討してください |
| Bobcoin が不足している | トライアルアカウントを新規作成すると 40 Bobcoin が付与されます |
| `git push` で認証エラーが出る | パスワードの代わりに GitHub の **Personal Access Token (PAT)** を使用してください。または SSH キーを設定してください |
| `git push` が rejected になる | リポジトリへの書き込み権限、ブランチ保護ルール、リモートURL（`git remote -v`）を確認してください |
| ブランチ名変更でエラーが出る | `git branch -M main` はコミット後に実行してください。初回コミット前だと `refname not found` エラーが出ます |
| `git clone` が失敗する | IBM 社内 GitHub への接続に問題がある場合は Seismic からアセットをダウンロードしてください |
| CI の Actions に実行履歴が表示されない | これは正常です。`feature/**` ブランチへの push が CI の初回トリガーになります |

---

## 次のステップ

セットアップ完了後は以下の順で進めます。

```
Part 1: Build
  ├── Planning and Scaffolding（計画とスキャフォールディング）
  └── Building and Validating the Dashboards（ダッシュボードの完成）

Part 2: Evolve
  ├── Publishing to GitHub（GitHubへの公開）
  ├── Implementing a Feature Request（機能要求の実装）
  └── Preparing a Pull Request（PRの準備とマージ）
```

> **参考資料:**  
> - デモガイド原本（PDF）: `GitHub SDLC Automation with IBM Bob Level 3 [Bob SDLC L3].PDF`  
> - 評価チェックリスト: `Evaluation Checklist - GitHub SDLC Automation with IBM Bob Level 3 [Bob SDLC L3].DOCX`
