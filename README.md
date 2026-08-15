# Nuxt createError Response Debug Lab

NuxtサーバーAPIで入力エラーのJSONを通常の戻り値として`return`し、HTTPステータスが`200`のままになる不具合を再現・修正するTypeScriptプロジェクトです。

## APIの契約

対象のAPIは`PATCH /api/tasks`です。`title`が空白だけの場合は`400`と機械可読なエラーコードを返し、有効な`title`の場合は`200`と更新結果を返します。

| 入力 | 期待するHTTP応答 |
| --- | --- |
| `?title=   ` | `400`、`data.code: INVALID_TITLE`を持つエラーJSON |
| `?title=  設計レビュー  ` | `200`、トリミング済みのタスクJSON |

## 必要環境

Node.js 22以降とnpmを使用します。プロジェクトはNuxt 3.15.4、TypeScript、H3で構成し、テストはNode.js標準テストランナーで実行します。

## 実行方法

```bash
npm install
npm run typecheck
npm test
npm run build
```

対象のRoute Handlerテストだけを実行する場合は、次のコマンドを使います。

```bash
npm run test:chapter-01
```

## バグを再現する

バグ状態は`bab79ef`です。不正な`title`に対してエラーJSONを通常の戻り値として返すため、本文に`INVALID_TITLE`があってもHTTPステータスは`200`になります。

```bash
git checkout bab79ef
npm install
npm run test:chapter-01
```

期待する失敗は`200 !== 400`です。有効な`title`に対する正常系テストは成功します。

## 修正後を確認する

修正は`b102eef`です。不正入力の分岐で`throw createError(...)`を使い、Nuxt/H3のエラーハンドリングを起動します。

```bash
git switch main
npm run typecheck
npm test
npm run build
```

## 学習資料

| 文書 | 内容 |
| --- | --- |
| [第01章のガイド](fundamentals/01-create-error-response.md) | RedからGreenまでの観測手順 |
| [デバッグ記録](docs/debugging-record.md) | 実行結果、原因、修正、制約 |
| [公式仕様メモ](docs/reference-notes.md) | Nuxt server/apiとcreateErrorの根拠 |
| [現在の差分](docs/current-diff.md) | 作業ツリーに出ているpackage-lock.jsonの変更内容 |
| [VS Codeデバッグ手順](docs/vscode-test-debugging.md) | テストをブレークポイントで停止する方法 |
| [設計メモ](DESIGN.md) | HTTP境界のテストとエラー本文の設計判断 |
| [対応表](coverage-matrix.md) | 実装済み・未着手テーマの一覧 |

## 参考資料

Nuxtの`server/api`が`/api`プレフィックスで登録されることは[Nuxt公式ドキュメント](https://nuxt.com/docs/4.x/directory-structure/server)、APIルートで`throw createError(...)`を使うことは[Nuxt 3公式ドキュメント](https://nuxt.com/docs/3.x/api/utils/create-error)を参照してください。
