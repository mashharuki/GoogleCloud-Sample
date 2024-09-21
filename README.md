# CloudRun-Sample
CloudRunを調査・学習するためのリポジトリです。

## Cloud Runとは何か?

Google Cloudが提供するサーバーレスサービス。

Cloud Run は自分で作ったコンテナを、Googleが用意したサーバー環境上で動かすことができます。

http(s) の口を持ったWebサイト/Web APIサーバーを手軽に作れて、スケーリングも勝手に面倒見てくれます。

一方、コンテナを使っているからと言っても何でもできるのでなく、Webサーバー以外のサービス（RDBや、ストレージサービスなど）を動かすのには適していません。

dockerfileを一回作ったらあとは色々動かせるってことですね！！

AWSのFargateやLambdaに似てる。

### 参考文献
1. [Google Cloud コンソール](https://console.cloud.google.com/)
2. [Qita - Google Cloud Run を使うまで](https://qiita.com/massie_g/items/5a9ce514eaa7c460b5e3)
3. [Cloud Run を最速で触ってみる](https://medium.com/google-cloud-jp/cloud-run-%E3%82%92%E6%9C%80%E9%80%9F%E3%81%A7%E8%A7%A6%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B-6e42021307d4)
4. [Cloud Runのドキュメント](https://cloud.google.com/run/docs?hl=ja)
5. [Cloud Run クイックスタート](https://cloud.google.com/run/docs/quickstarts/deploy-container?hl=ja)
6. [Cloud Run コンソール画面](https://console.cloud.google.com/run?hl=ja&project=lyrical-art-273306)
7. [Cloud Run Node.js クイックスタート](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service?hl=ja)
8. [Cloud CLIのインストール手順](https://cloud.google.com/sdk/docs/install?hl=JA)