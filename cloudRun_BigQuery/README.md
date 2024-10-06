# Cloud Run + BigQuery を試すためのサンプルコード

```bash
export PROJECT_ID=test-project
```

課金が有効化されているかチェックする。

true という答えが返ってくればOK!

```bash
gcloud beta billing projects describe $PROJECT_ID | grep billingEnabled
```

デフォルトのプロジェクトIDとリージョンを設定。

```bash
gcloud config set project $PROJECT_ID
gcloud config set run/region asia-northeast1
gcloud config set run/platform managed
```

今回のハンズオンで使うサービスのAPIを有効化する。

```bash
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  firestore.googleapis.com \
  pubsub.googleapis.com
```
BigQuery (Log Analytics) の設定 を行う。  

ログバケットを作成する。

```bash
gcloud logging buckets create run-analytics-bucket \
  --location asia-northeast1 \
  --enable-analytics
```

ログシンクを作成する。

```bash
gcloud logging sinks create run-analytics-sink \
  logging.googleapis.com/projects/$PROJECT_ID/locations/asia-northeast1/buckets/run-analytics-bucket \
  --log-filter 'logName:"run.googleapis.com"'
```

Firebase CLIのインストール

```bash
curl -sL https://firebase.tools | bash
```

Firebaseへのログイン

```bash
firebase login
```

Firebase アプリケーションの作成

```bash
firebase apps:create -P $PROJECT_ID streamchat
```

Firebase設定のアプリケーションへの埋め込み

```bash

```