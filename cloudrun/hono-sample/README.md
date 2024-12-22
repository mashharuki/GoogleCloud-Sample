# hono-sample

## 動かし方(ローカル編)

- インストール

    ```bash
    bun install
    ```

- ローカルで起動

    ```bash
    bun run dev
    ```

    以下でAPIを呼び出す。

    ```bash
    curl -XGET "http://localhost:3000"
    ```

- Dockerコンテナをビルド

    `hono-sample`という名前で`latest`をタグ付け

    ```bash 
    docker build . -t hono-sample:latest
    ```

- Dockerコンテナを起動

    ```bash
    docker run -p 3000:3000 <imageid>
    ```

- Dockerコンテナを停止

    ```bash
    docker stop <imageid>
    ```

## 動かし方(Cloud Run編)

まず、ローカルでDockerのビルド＆起動ができることを確認すること！

- コンテナイメージ用のリポジトリを作成する。

    ```bash
    gcloud artifacts repositories create hono-sample --repository-format docker --location us-central1
    ```

- コンテナイメージをプッシュする。

    ```bash
    gcloud builds submit --tag us-central1-docker.pkg.dev/lyrical-art-273306/hono-sample/sample
    ```

- サービスアカウントを作成する。

    ```bash
    gcloud iam service-accounts create honoSampleAccount
    ```

- CloudRunにAPIをデプロイする。

    ```bash 
    gcloud run deploy hono-sample --service-account honoSampleAccount@lyrical-art-273306.iam.gserviceaccount.com  --image us-central1-docker.pkg.dev/lyrical-art-273306/hono-sample/sample
    ```

    上手く行けばAPIがデプロイされるので、以下のようにAPIを呼び出してみる。

    ```bash
    curl -XGET "https://hono-sample-429380797965.us-central1.run.app"
    ```

    `Hello Hono!`と返ってくればOK!!

- Cloud RunでデプロイしたAPIを停止する。

    ```bash
    gcloud run services delete hono-sample
    ```

### 参考文献
1. [Zenn - DockerでBunを使ってサーバーを立ててみた](https://zenn.dev/nanasi_1/articles/6375c0fbaa3b8d)
2. [Zenn - BunとHono](https://zenn.dev/yusukebe/articles/efa173ab4b9360)
3. [Containerize a Bun application with Docker](https://bun.sh/guides/ecosystem/docker)