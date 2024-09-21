# CloudRun-Sample
CloudRunを調査・学習するためのリポジトリです。

## Cloud Runとは何か?

Google Cloudが提供するサーバーレスサービス。

Cloud Run は自分で作ったコンテナを、Googleが用意したサーバー環境上で動かすことができます。

http(s) の口を持ったWebサイト/Web APIサーバーを手軽に作れて、スケーリングも勝手に面倒見てくれます。

一方、コンテナを使っているからと言っても何でもできるのでなく、Webサーバー以外のサービス（RDBや、ストレージサービスなど）を動かすのには適していません。

dockerfileを一回作ったらあとは色々動かせるってことですね！！

AWSのFargateやLambdaに似てる。

## gcloud CLIのインストール

```bash
curl -O https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/google-cloud-cli-477.0.0-linux-x86_64.tar.gz
tar -xf google-cloud-cli-477.0.0-linux-x86_64.tar.gz
```

```bash
./google-cloud-sdk/install.sh
./google-cloud-sdk/bin/gcloud init
```

## クイックスタートの手順

```bash
gcloud services enable run.googleapis.com
```

サービスアカウントを作成する。

```bash
gcloud projects add-iam-policy-binding lyrical-art-273306 \
    --member=serviceAccount:429380797965-compute@developer.gserviceaccount.com \
    --role=roles/cloudbuild.builds.builder
```

コンテナサービスをデプロイする。

```bash
cd helloworld && gcloud run deploy
```

最後まで完了するとAPIがデプロイされる！！

```bash
Service [helloworld] revision [helloworld-00001-n5w] has been deployed and is serving 100 percent of traffic.
Service URL: https://helloworld-tbj5qgjmvq-bq.a.run.app
```

Hello World! と表示されたらOK!!!

後片付けとしてコンソールからコンテナを削除する。

[マネジメントコンソール](https://console.cloud.google.com/iam-admin/projects?hl=ja&_ga=2.105537217.353946198.1726927210-1926100725.1726927210)

もちろんコンテナイメージを作ってビルド・デプロイも可能。

- サービスはリクエストをリッスンする必要があります。  
  リクエストの送信に使われるポートを構成できます。   
  Cloud Run インスタンス内では、リクエスト送信先ポートが PORT 環境変数の値に常に反映されます。  
  この PORT 環境変数が存在するかどうかをコードで検査してください。存在する場合は、移植性が最大になるようそのポートでリッスンするのが適切です。
- サービスはステートレスである必要があります。永続的なローカル状態に依存することはできません。
- サービスがリクエスト処理の範囲外のバックグラウンド アクティビティを実行する場合は、[CPU を常に割り当てる] 設定を使用する必要があります。
- サービスがネットワーク ファイル システムを使用する場合は、第 2 世代の実行環境を使用する必要があります。

第２世代の実行環境については以下のサイトを参照のこと

https://cloud.google.com/run/docs/about-execution-environments?hl=ja

### 参考文献
1. [Google Cloud コンソール](https://console.cloud.google.com/)
2. [Qita - Google Cloud Run を使うまで](https://qiita.com/massie_g/items/5a9ce514eaa7c460b5e3)
3. [Cloud Run を最速で触ってみる](https://medium.com/google-cloud-jp/cloud-run-%E3%82%92%E6%9C%80%E9%80%9F%E3%81%A7%E8%A7%A6%E3%81%A3%E3%81%A6%E3%81%BF%E3%82%8B-6e42021307d4)
4. [Cloud Runのドキュメント](https://cloud.google.com/run/docs?hl=ja)
5. [Cloud Run クイックスタート](https://cloud.google.com/run/docs/quickstarts/deploy-container?hl=ja)
6. [Cloud Run コンソール画面](https://console.cloud.google.com/run?hl=ja&project=lyrical-art-273306)
7. [Cloud Run Node.js クイックスタート](https://cloud.google.com/run/docs/quickstarts/build-and-deploy/deploy-nodejs-service?hl=ja)
8. [Cloud CLIのインストール手順](https://cloud.google.com/sdk/docs/install?hl=JA)
9. [Cloud Run - 実行環境](https://cloud.google.com/run/docs/about-execution-environments?hl=ja)
10. [カスタムイメージを作ってCloud Runで動かす方法のチュートリアル](https://cloud.google.com/run/docs/tutorials/system-packages?hl=ja)