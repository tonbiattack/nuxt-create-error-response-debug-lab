# 公式仕様の調査メモ

## Nuxtのserver/api

Nuxt公式ドキュメントは、`server/`ディレクトリをAPIおよびサーバーハンドラーの登録に使うと説明している。`server/api`配下のファイルは自動的に`/api`プレフィックスで公開され、各ファイルは`defineEventHandler()`または`eventHandler()`で定義したデフォルト関数をexportする。

- https://nuxt.com/docs/4.x/directory-structure/server

## Nuxt 3のcreateError

Nuxt 3公式ドキュメントは、サーバーAPIルートのエラー処理を起動するために`createError`を使い、`throw createError({ status: 404, statusText: 'Page Not Found' })`の形で送出する例を示している。

- https://nuxt.com/docs/3.x/api/utils/create-error
