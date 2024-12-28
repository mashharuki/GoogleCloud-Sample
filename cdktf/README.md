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

- 削除

    ```bash
    bun run destroy '*'
    ```


### 参考文献
1. [GitHub CloudRun サンプル実装例](https://github.com/hashicorp/terraform-cdk/blob/main/examples/typescript/google-cloudrun/main.ts)