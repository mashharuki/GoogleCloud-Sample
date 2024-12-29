# Cloud Runについての調査メモ

## Cloud Runとは何か?

Google Cloudが提供するサーバーレスサービス。

Cloud Run は自分で作ったコンテナを、Googleが用意したサーバー環境上で動かすことができます。

http(s) の口を持ったWebサイト/Web APIサーバーを手軽に作れて、スケーリングも勝手に面倒見てくれます。

一方、コンテナを使っているからと言っても何でもできるのでなく、Webサーバー以外のサービス（RDBや、ストレージサービスなど）を動かすのには適していません。

dockerfileを一回作ったらあとは色々動かせるってことですね！！

AWSのFargateやLambdaに似てる。

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

## カスタムイメージを作ってCloud Runで動かす方法

以下で最新化

```bash
gcloud components update
```

テンプレコードをcloneする。

```bash
git clone https://github.com/GoogleCloudPlatform/nodejs-docs-samples.git
```

サンプルコードの格納先に移動する。

```bash
cd nodejs-docs-samples/run/system-package/
```

以下のコマンドを`Dockerfile`に追加する。

```bash
RUN apt-get update -y && apt-get install -y graphviz && apt-get clean
```

中身の構造は以下の通り。

```bash
.
├── Dockerfile
├── README.md
├── app.js
├── index.js
├── package.json
└── test
    ├── app.test.js
    ├── e2e_test_cleanup.yaml
    ├── e2e_test_setup.yaml
    ├── retry.sh
    └── system.test.js
```

`Dockerfile`の中身は以下の通り

```yaml
FROM node:20-alpine

WORKDIR /usr/src/app

RUN apt-get update -y && apt-get install -y graphviz && apt-get clean
# RUN apk --no-cache add graphviz ttf-ubuntu-font-family

COPY package*.json ./

RUN npm install --only=production

COPY . .

CMD [ "npm", "start" ]
```

package.json の中身は以下の通り

```json
{
  "name": "graphviz-web",
  "version": "1.0.0",
  "description": "Demonstrates a Cloud Run service which provides a CLI tool over HTTP.",
  "main": "index.js",
  "private": true,
  "scripts": {
    "start": "node index.js",
    "test": "c8 mocha -p -j 2 test/app.test.js --check-leaks",
    "system-test": "echo 'SKIPPING E2E TEST: SEE b/358734748'",
    "FIXME-system-test": "c8 mocha -p -j 2 test/system.test.js --timeout=360000 --exit"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.17.1"
  },
  "devDependencies": {
    "c8": "^10.0.0",
    "google-auth-library": "^9.0.0",
    "got": "^11.5.0",
    "mocha": "^10.0.0",
    "supertest": "^7.0.0"
  }
}
```

ローカルでコンテナをビルドする。

```bash
docker build .
```

ロジックを実装している `app.js`の中身

```ts
// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const {execSync} = require('child_process');
const fs = require('fs');

const express = require('express');
const app = express();

// Verify the the dot utility is available at startup
// instead of waiting for a first request.
fs.accessSync('/usr/bin/dot', fs.constants.X_OK);

// [START cloudrun_system_package_handler]
app.get('/diagram.png', (req, res) => {
  try {
    const image = createDiagram(req.query.dot);
    res.setHeader('Content-Type', 'image/png');
    res.setHeader('Content-Length', image.length);
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(image);
  } catch (err) {
    console.error(`error: ${err.message}`);
    const errDetails = (err.stderr || err.message).toString();
    if (errDetails.includes('syntax')) {
      res.status(400).send(`Bad Request: ${err.message}`);
    } else {
      res.status(500).send('Internal Server Error');
    }
  }
});
// [END cloudrun_system_package_handler]

// [START cloudrun_system_package_exec]
// Generate a diagram based on a graphviz DOT diagram description.
const createDiagram = dot => {
  if (!dot) {
    throw new Error('syntax: no graphviz definition provided');
  }

  // Adds a watermark to the dot graphic.
  const dotFlags = [
    '-Glabel="Made on Cloud Run"',
    '-Gfontsize=10',
    '-Glabeljust=right',
    '-Glabelloc=bottom',
    '-Gfontcolor=gray',
  ].join(' ');

  const image = execSync(`/usr/bin/dot ${dotFlags} -Tpng`, {
    input: dot,
  });
  return image;
};
// [END cloudrun_system_package_exec]

module.exports = app;

```

Artifact Registry を作成する。

```bash
gcloud artifacts repositories create cloud-run-source-deploy --repository-format docker --location us-central1
```

以下のコマンドでコンテナイメージをビルドし、 Artifact Registryに登録する。

```bash
gcloud builds submit --tag us-central1-docker.pkg.dev/lyrical-art-273306/cloud-run-source-deploy/graphviz
```

以下のように表示されればOK!

```bash
SUCCESS
```

サービスアカウントを作成する。

```bash
gcloud iam service-accounts create sampleGcloudAccount
```

サービスをデプロイする。

```bash
gcloud run deploy graphviz-web --service-account sampleGcloudAccount@lyrical-art-273306.iam.gserviceaccount.com  --image us-central1-docker.pkg.dev/lyrical-art-273306/cloud-run-source-deploy/graphviz
```

以下のように表示されればOK!!

```bash
Done.                                                                                                                                                                                         
Service [graphviz-web] revision [graphviz-web-00002-nl5] has been deployed and is serving 100 percent of traffic.
Service URL: https://graphviz-web-429380797965.us-east1.run.app
```

以下でデプロイした機能を試せます。

ダイアグラムが出力されます！！

```bash
https://graphviz-web-429380797965.us-east1.run.app/diagram.png?dot=digraph Run { rankdir=LR Code -> Build -> Deploy -> Run }
```