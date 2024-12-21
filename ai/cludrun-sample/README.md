# Cloud RunとVertexAIのサンプル

## 動かし方

- ログイン

    ```bash
    gcloud auth application-default login
    ```

- プロジェクトの情報を設定

    ```bash
    gcloud config set project <projectID>
    ```

    ちゃんと設定されているかチェックする。

    ```bash
    gcloud config list project
    ```

- APIを有効する。

    ```bash
    gcloud services enable run.googleapis.com \
    cloudbuild.googleapis.com \
    aiplatform.googleapis.com \
    secretmanager.googleapis.com
    ```

- 環境変数を設定

    ```bash
    export PROJECT_ID=<YOUR_PROJECT_ID>
    export REGION="asia-northeast1"
    export SERVICE=chat-with-gemini
    export SERVICE_ACCOUNT="vertex-ai-caller"
    export SERVICE_ACCOUNT_ADDRESS=$SERVICE_ACCOUNT@$PROJECT_ID.iam.gserviceaccount.com
    export SECRET_ID="SESSION_SECRET"
    ```

- データベースを作成する。

    [firebase データベース](https://console.firebase.google.com/project/lyrical-art-273306/firestore?hl=ja)

    [Cloud Console データベース](https://console.cloud.google.com/datastore/)

    データベースIDは、`cloudrun-vertex-sample-db`です。

- サービスアカウントを作成する。

    ```bash
    gcloud iam service-accounts create $SERVICE_ACCOUNT --display-name="Cloud Run to access Vertex AI APIs"
    ```

    ```bash
    gcloud projects add-iam-policy-binding $PROJECT_ID \
        --member serviceAccount:$SERVICE_ACCOUNT_ADDRESS \
        --role=roles/aiplatform.user
    ```

- 次に、Secret Manager でシークレットを作成します。

    ```bash
    gcloud secrets create $SECRET_ID --replication-policy="automatic"
    printf "keyboard-cat" | gcloud secrets versions add $SECRET_ID --data-file=-
    ```

    ```bash
    gcloud secrets add-iam-policy-binding $SECRET_ID \
    --member serviceAccount:$SERVICE_ACCOUNT_ADDRESS \
    --role='roles/secretmanager.secretAccessor'
    ```

    最後に、Firestore に対する読み取り / 書き込みアクセス権をサービス アカウントに付与します。

    ```bash
    gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member serviceAccount:$SERVICE_ACCOUNT_ADDRESS \
    --role=roles/datastore.user
  ```

- Cloud Run用のプロジェクトを作成する。

    ```bash
    mkdir chat-with-gemini && cd chat-with-gemini
    ```

    ```bash
    bun init -y
    ```

    `package.json`の中身を以下のようにする。

    ```json
    {
        "name": "chat-with-gemini",
        "version": "1.0.0",
        "description": "",
        "main": "app.js",
        "scripts": {
            "start": "node app.js",
            "nodemon": "nodemon app.js",
            "cssdev": "npx tailwindcss -i ./input.css -o ./public/output.css --watch",
            "tailwind": "npx tailwindcss -i ./input.css -o ./public/output.css",
            "dev": "npm run tailwind && npm run nodemon"
        },
        "keywords": [],
        "author": "",
        "license": "ISC",
        "dependencies": {
            "@google-cloud/connect-firestore": "^3.0.0",
            "@google-cloud/firestore": "^7.5.0",
            "@google-cloud/vertexai": "^0.4.0",
            "axios": "^1.6.8",
            "express": "^4.18.2",
            "express-session": "^1.18.0",
            "express-ws": "^5.0.2",
            "htmx.org": "^1.9.10"
        },
        "devDependencies": {
            "nodemon": "^3.1.0",
            "tailwindcss": "^3.4.1"
        }
    }
    ```

    インストールする。

    ```bash
    bun install
    ```

    `tailwind.config.js`の中身は以下のように設定する。

    ```js
    /** @type {import('tailwindcss').Config} */
    module.exports = {
        content: ["./**/*.{html,js}"],
        theme: {
            extend: {}
        },
        plugins: []
    };
    ```

    `spinnerSvg.js`を作成

    ```js
    module.exports.spinnerSvg = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-500"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                >
                    <circle
                        class="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        stroke-width="4"
                    ></circle>
                    <path
                        class="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path></svg>`;
    ```

- サービスをデプロイする。

    ```bash
    gcloud run deploy $SERVICE \
        --service-account $SERVICE_ACCOUNT_ADDRESS \
        --source . \
        --region $REGION \
        --allow-unauthenticated \
        --set-secrets="SESSION_SECRET=$(echo $SECRET_ID):1"
    ```

## 後片付け

以下のリソースを削除すること

- データベース
- Cloud Run
- コンテナ用のリポジトリ