# CDK for Terraform用のコード

## 事前準備

- Terraform CLIのインストール

- CDK for Terraform CLIのインストール

- コンテナイメージはすでにGoogle Cloudにプッシュ済みとします。

## プロバイダーのインストール

Google Cloudの場合

```bash
cdktf provider add hashicorp/google
```

## 動かし方

- インストール

    ```bash
    bun install
    ``` 

- diff

    ```bash
    bun run diff
    ```

- デプロイ

    ```bash
    bun run deploy '*'
    ```

    以下のように出力されればOK!

    ```bash
    cdktf
    region = us-central1
    service_name = hono-vertexai-sample
    service_url = https://<固有値>.a.run.app
    ```

- 削除

    ```bash
    bun run destroy '*'
    ```

## APIの叩き方

`ai/cloudrun-sample/hono-vertexai-sample`の`sample.http`を参照のこと！！



### 参考文献
1. [GitHub CloudRun サンプル実装例](https://github.com/hashicorp/terraform-cdk/blob/main/examples/typescript/google-cloudrun/main.ts)