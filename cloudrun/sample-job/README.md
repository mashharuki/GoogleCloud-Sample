# Cloud Runで動かすサンプルジョブ

## Cloud Runでジョブを動かす場合

Cloud Run ジョブを使用すると、実行するタスクの数を指定できます。次のサンプルコードは、組み込みの CLOUD_RUN_TASK_INDEX 環境変数を使用する方法を示しています。各タスクが、コンテナの 1 つの実行中のコピーを表します。タスクは通常、並行して実行されます。各タスクが独立してデータのサブセットを処理できる場合は、複数のタスクを使用すると便利です。

各タスクはインデックスを認識し、CLOUD_RUN_TASK_INDEX 環境変数に格納されます。組み込みの CLOUD_RUN_TASK_COUNT 環境変数には、ジョブの実行時に --tasks パラメータを介して指定されたタスクの数が含まれています。

このコードは、組み込みの CLOUD_RUN_TASK_ATTEMPT 環境変数を使用してタスクを再試行する方法を示しています。この変数はタスクの再試行回数を表します。最初の再試行が行われると、この変数に 0 が設定され、--max-retries になるまで再試行のたびに値が 1 ずつ増加します。

## Procfileとは

ProcfileはHerokuへのRailsアプリケーションのデプロイでおなじみの方もおられるかと思いますが、Foremanやhonchoでも使用される設定ファイルの形式です。Dockerfileのように拡張子はなくProcfileというファイルを作成します。

##  Artifact Registryにコンテナイメージを送信

環境変数と一緒にデプロイ

```bash
gcloud run jobs deploy job-quickstart \
    --source . \
    --tasks 50 \
    --set-env-vars SLEEP_MS=10000 \
    --set-env-vars FAIL_RATE=0.1 \
    --max-retries 5 \
    --region us-east1 \
    --project=lyrical-art-273306
```

## ジョブの実行

```bash
gcloud run jobs execute job-quickstart --region us-east1
```

```bash
✓ Creating execution... Done.    

                                                                                                                                                       Done.                            
Execution [job-quickstart-g8ng5] has successfully started running.

View details about this execution by running:
gcloud run jobs executions describe job-quickstart-g8ng5

Or visit https://console.cloud.google.com/run/jobs/executions/details/us-east1/job-quickstart-g8ng5/tasks
```