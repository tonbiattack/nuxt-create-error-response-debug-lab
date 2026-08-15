# 学習目次

このプロジェクトは、一つのNuxtサーバーAPI不具合を、バグ状態の観測、最小修正、回帰確認の順に追う教材です。

| 章 | 題材 | ガイド | 実装 | テスト |
| --- | --- | --- | --- | --- |
| 第01章 | エラーJSONを`return`してHTTP 200になる問題 | [ガイド](fundamentals/01-create-error-response.md) | [`server/api/tasks.patch.ts`](server/api/tasks.patch.ts) | [`test/tasks-api.test.ts`](test/tasks-api.test.ts) |

バグ状態は`bab79ef`、修正状態は`b102eef`です。バグ状態では不正入力テストが`200 !== 400`で失敗し、`main`では同じテストが`400`と機械可読なエラーコードを確認して成功します。
