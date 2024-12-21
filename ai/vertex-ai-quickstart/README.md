# vertex-ai-quickstart

## 動かし方

- ログイン

    ```bash
    gcloud auth application-default login
    ```

- Vertex用のSDKをインストールする。

    ```bash
    bun add @google-cloud/vertexai
    ```

- サンプルコード実行

    ```bash
    bun run start
    ```

- ストリーミングありの出力

    ```bash
    bun run streamGenerateContent
    ```

- ストリーミングなしの出力

    ```bash
    bun run generateContent
    ```

- ストリーミングありのチャット

    ```bash
    bun run streamChat
    ```

- ストリーミングなしのチャット

    ```bash
    bun run chat
    ```