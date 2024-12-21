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

- 画像を渡して出力させるサンプルコード

    ```bash
    bun run multiPartContent
    ```

- functionCalling

    ```bash
    bun run functionCallingChat
    ```

- functionCalling(ストリーミングあり)

    ```bash
    bun run functionCallingGenerateContentStream
    ```

- トークン数を数える

    ```bash
    bun run countTokens
    ```

- Grounding using Google Search (Preview)を試すコード

    ```bash
    bun run generateContentWithGoogleSearchGrounding
    ```

- Vertex AI検索でグラウンディングを行うサンプルコード

    ```bash
    bun run generateContentWithVertexAISearchGrounding
    ```