# Google Clou で作る MPC 署名プログラム

## 動かし方

- リストで確認

  ```bash
  gcloud auth list
  ```

- プロジェクトを確認

  ```bash
  gcloud config list project
  ```

- プロジェクト ID を環境変数としてエクスポート

  ```bash
  export MPC_PROJECT_ID=$(gcloud config get-value core/project)
  echo $MPC_PROJECT_ID
  ```

- 使用するサービスの API をオンにする。

  ```bash
  gcloud services enable cloudkms.googleapis.com compute.googleapis.com confidentialcomputing.googleapis.com iamcredentials.googleapis.com artifactregistry.googleapis.com
  ```

- 秘密鍵と MPC の鍵を作成する。

  ```bash
  gcloud kms keyrings create mpc-keys --location=global
  gcloud kms keys create mpc-key --location=global --keyring=mpc-keys --purpose=encryption --protection-level=hsm
  ```

- 暗号鍵へのアクセス権を付与する。

  ```bash
  gcloud kms keys add-iam-policy-binding \
  projects/$MPC_PROJECT_ID/locations/global/keyRings/mpc-keys/cryptoKeys/mpc-key \
  --member="user:$(gcloud config get-value account)" \
  --role='roles/cloudkms.cryptoKeyEncrypter'
  ```

- 検証用のアリスとボブの秘密鍵を生成する。

  ```bash
  echo -n "00000000000000000000000000000000" >> alice-key-share
  echo -n "00000000000000000000000000000001" >> bob-key-share
  ```

- アリスとボブの秘密鍵を KMS を使って暗号化する。

  ```bash
  gcloud kms encrypt \
    --key mpc-key \
    --keyring mpc-keys \
    --location global  \
    --plaintext-file alice-key-share \
    --ciphertext-file alice-encrypted-key-share
  ```

  ```bash
  gcloud kms encrypt \
    --key mpc-key \
    --keyring mpc-keys \
    --location global  \
    --plaintext-file bob-key-share \
    --ciphertext-file bob-encrypted-key-share
  ```

- 鍵をアップロードするためのバケットを作成し、そこにアップロードする。

  ```bash
  gcloud storage buckets create gs://$MPC_PROJECT_ID-mpc-encrypted-keys --location=asia-northeast1
  ```

  ```bash
  gcloud storage cp alice-encrypted-key-share gs://$MPC_PROJECT_ID-mpc-encrypted-keys/
  gcloud storage cp bob-encrypted-key-share gs://$MPC_PROJECT_ID-mpc-encrypted-keys/
  ```

- MPC サービスアカウントを作成&必要な権限を付与する。

  ```bash
  gcloud iam service-accounts create trusted-mpc-account
  ```

  ```bash
  gcloud kms keys add-iam-policy-binding mpc-key \
  --keyring='mpc-keys' --location='global' \
  --member="serviceAccount:trusted-mpc-account@$MPC_PROJECT_ID.iam.gserviceaccount.com" \
  --role='roles/cloudkms.cryptoKeyDecrypter'
  ```

- ワークロード用の ID プールを作成

  ```bash
  gcloud iam workload-identity-pools create trusted-workload-pool --location="global"
  ```

- Create the new OIDC workload identity pool provider.

  ```bash
  gcloud iam workload-identity-pools providers create-oidc attestation-verifier \
  --location="global" \
  --workload-identity-pool="trusted-workload-pool" \
  --issuer-uri="https://confidentialcomputing.googleapis.com/" \
  --allowed-audiences="https://sts.googleapis.com" \
  --attribute-mapping="google.subject='assertion.sub'" \
  --attribute-condition="assertion.swname == 'CONFIDENTIAL_SPACE' &&
    'STABLE' in assertion.submods.confidential_space.support_attributes &&
    assertion.submods.container.image_reference ==
    'REGION-docker.pkg.dev/$MPC_PROJECT_ID/mpc-workloads/initial-workload-container:latest'
    && 'run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com' in
    assertion.google_service_accounts"
  ```

- 必要な権限を付与する。

  ```bash
  gcloud iam service-accounts add-iam-policy-binding \
  trusted-mpc-account@$MPC_PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/iam.workloadIdentityUser \
  --member="principalSet://iam.googleapis.com/projects/$(gcloud projects describe $MPC_PROJECT_ID --format="value(projectNumber)")/locations/global/workloadIdentityPools/trusted-workload-pool/*"
  ```

- Create run-confidential-vm service account ＆ 必要な権限を付与する。

  ```bash
  gcloud iam service-accounts create run-confidential-vm
  ```

  ```bash
  gcloud iam service-accounts add-iam-policy-binding \
  run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com \
  --member="user:$(gcloud config get-value account)" \
  --role='roles/iam.serviceAccountUser'
  ```

- 開発環境のためのローカルブロックチェーンネットワーク環境を`Ganache`で作成する。

  ```bash
  gcloud compute instances create-with-container mpc-lab-ethereum-node  \
  --zone=asia-northeast1-b \
  --tags=http-server \
  --shielded-secure-boot \
  --shielded-vtpm \
  --shielded-integrity-monitoring \
  --container-image=docker.io/trufflesuite/ganache:v7.7.3 \
  --container-arg=--wallet.accounts=\"0x0000000000000000000000000000000000000000000000000000000000000001,0x21E19E0C9BAB2400000\" \
  --container-arg=--port=80
  ```

  以下のようになれば OK!

  ```bash
  NAME                   ZONE               MACHINE_TYPE   PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP  STATUS
  mpc-lab-ethereum-node  asia-northeast1-b  n1-standard-1               10.146.0.2   34.85.55.69  RUNNING
  ```

  結果を補完するストレージを作成する。

  ```bash
  gcloud storage buckets create gs://$MPC_PROJECT_ID-mpc-results-storage --location=asia-northeast1
  ```

  ```bash
  gsutil iam ch \
  serviceAccount:run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com:objectCreator \
  gs://$MPC_PROJECT_ID-mpc-results-storage
  ```

  ```bash
  gsutil iam ch \
  serviceAccount:trusted-mpc-account@$MPC_PROJECT_ID.iam.gserviceaccount.com:objectViewer \
  gs://$MPC_PROJECT_ID-mpc-encrypted-keys
  ```

- MPC 署名用のサンプルコードを作成する。

  ```bash
  mkdir mpc-ethereum-demo
  cd mpc-ethereum-demo
  ```

  ```bash
  bun init -y
  ```

  `package.json`の中身を以下のように設定する。

  ```json
  {
    "name": "gcp-mpc-ethereum-demo",
    "version": "1.0.0",
    "description": "Demo for GCP multi-party-compute on Confidential Space",
    "main": "index.js",
    "scripts": {
      "start": "node index.js"
    },
    "type": "module",
    "dependencies": {
      "@google-cloud/kms": "^3.2.0",
      "@google-cloud/storage": "^6.9.2",
      "ethers": "^5.7.2",
      "fast-crc32c": "^2.0.0"
    },
    "author": "",
    "license": "ISC"
  }
  ```

  Docker ファイルを作成

  ```yaml
  # pull official base image
  FROM node:16.18.0

  # Install Bun
  RUN curl -fsSL https://bun.sh/install | bash

  # Add Bun to PATH

  ENV PATH="/root/.bun/bin:$PATH"

  ENV NODE_ENV=production

  WORKDIR /app

  COPY ["package.json", "package-lock.json*", "./", "./src"]

  RUN npm install --production

  COPY . .

  LABEL "tee.launch_policy.allow_cmd_override"="true"
  LABEL "tee.launch_policy.allow_env_override"="NODE_URL,RESULTS_BUCKET,KEY_BUCKET,MPC_PROJECT_NUMBER,MPC_PROJECT_ID"

  CMD [ "bun", "run", "start" ]
  ```

- リポジトリを作成する。

  ```bash
  gcloud artifacts repositories create mpc-workloads \
  --repository-format=docker --location=asia-northeast1
  ```

- Docker イメージをビルドしてリポジトリにプッシュする。

  ```bash
  gcloud auth configure-docker asia-northeast1-docker.pkg.dev
  docker build -t asia-northeast1-docker.pkg.dev/$MPC_PROJECT_ID/mpc-workloads/initial-workload-container:latest .
  docker push asia-northeast1-docker.pkg.dev/$MPC_PROJECT_ID/mpc-workloads/initial-workload-container:latest
  ```

- サービスアカウントに権限を付与する。

  ```bash
  gcloud artifacts repositories add-iam-policy-binding mpc-workloads \
    --location=asia-northeast1 \
    --member=serviceAccount:run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com \
    --role=roles/artifactregistry.reader
  ```

  ```bash
  gcloud projects add-iam-policy-binding $MPC_PROJECT_ID \
  --member=serviceAccount:run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com \
  --role=roles/confidentialcomputing.workloadUser
  ```

- MPC 署名用のワークロード用インスタンスを作成する。

  ```bash
  gcloud compute instances create mpc-cvm --confidential-compute \
  --shielded-secure-boot \
  --maintenance-policy=TERMINATE --scopes=cloud-platform  --zone=asia-northeast1-b \
  --image-project=confidential-space-images \
  --image-family=confidential-space \
  --service-account=run-confidential-vm@$MPC_PROJECT_ID.iam.gserviceaccount.com \
  --metadata ^~^tee-image-reference=REGION-docker.pkg.dev/$MPC_PROJECT_ID/mpc-workloads/initial-workload-container:latest~tee-restart-policy=Never~tee-env-NODE_URL=$(gcloud compute instances describe mpc-lab-ethereum-node --format='get(networkInterfaces[0].networkIP)' --zone=asia-northeast1-b)~tee-env-RESULTS_BUCKET=$MPC_PROJECT_ID-mpc-results-storage~tee-env-KEY_BUCKET=$MPC_PROJECT_ID-mpc-encrypted-keys~tee-env-MPC_PROJECT_ID=$MPC_PROJECT_ID~tee-env-MPC_PROJECT_NUMBER=$(gcloud projects describe $MPC_PROJECT_ID --format="value(projectNumber)")
  ```

  ```bash
  reated [https://www.googleapis.com/compute/v1/projects/lyrical-art-273306/zones/asia-northeast1-b/instances/mpc-cvm].
  NAME     ZONE               MACHINE_TYPE    PREEMPTIBLE  INTERNAL_IP  EXTERNAL_IP   STATUS
  mpc-cvm  asia-northeast1-b  n2d-standard-2               10.146.0.4   35.243.78.56  RUNNING
  ```

### 参考文献

1. [Transacting Digital Assets with Multi-Party Computation and Confidential Space](https://www.cloudskillsboost.google/focuses/61481?parent=catalog)
2. [Cloud KMS](https://cloud.google.com/kms)
3. [Google Cloud Confidential Space](https://cloud.google.com/docs/security/confidential-space)

```

```

```

```
