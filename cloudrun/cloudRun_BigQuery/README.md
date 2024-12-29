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

## 別のBigQueryのサンプル例

以下のコースにチャレンジ

[Public Blockchain Datasets Available in BigQuery](https://cloud.google.com/application/web3/discover/products/public-blockchain-datasets-available-in-bigquery)

public datasetであるイーサリアムのブロック情報を取得するクエリ

```sql
WITH
     withdrawals AS (
     SELECT
       w.amount_lossless AS amount,
       DATE(b.block_timestamp) AS block_date
     FROM
       bigquery-public-data.goog_blockchain_ethereum_mainnet_us.blocks b
     CROSS JOIN
       UNNEST(withdrawals) AS w
     WHERE
       DATE(b.block_timestamp) BETWEEN CURRENT_DATE() - 14
       AND CURRENT_DATE())
   SELECT
     block_date,
     bqutil.fn.bignumber_div(bqutil.fn.bignumber_sum(ARRAY_AGG(amount)),
      "1000000000") AS eth_withdrawn
   FROM
     withdrawals
   GROUP BY
     1
   ORDER BY
     1 DESC;
```