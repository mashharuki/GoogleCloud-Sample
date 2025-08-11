# Spanner インスタンスとデータベースの作成（CLI と Terraform）

## ハンズオンの記録

### gcloud CLI を使用してインスタンスとデータベースを作成する

```bash
gcloud config set project placeholder_project_id
```

Cloude Spannerインスタンスを立ち上げる

```bash
gcloud spanner instances create test-spanner-instance --config=regional-place_holder_text --description="test-spanner-instance" --processing-units=100
```

起動後のインスタンスの確認する方法

```bash
gcloud spanner instances list
```

以下のように出力されるはず

```bash
NAME: test-spanner-instance
DISPLAY_NAME: test-spanner-instance
CONFIG: regional-us-west1
NODE_COUNT: 
PROCESSING_UNITS: 100
STATE: READY
INSTANCE_TYPE: PROVISIONED
```

以下のファイルを作成する

```bash
nano pets-db-schema.sql
```

内容は以下

```sql
CREATE TABLE Owners (
     OwnerID STRING(36) NOT NULL, 
     OwnerName STRING(MAX) NOT NULL
) PRIMARY KEY (OwnerID);

CREATE TABLE Pets (
     PetID STRING(36) NOT NULL, 
     OwnerID STRING(36) NOT NULL, 
     PetType STRING(MAX) NOT NULL,
     PetName STRING(MAX) NOT NULL,
     Breed STRING(MAX) NOT NULL,
) PRIMARY KEY (PetID);
```

以下のコマンドで実施

```bash
gcloud spanner databases create pets-db --instance=test-spanner-instance --database-dialect=GOOGLE_STANDARD_SQL --ddl-file=./pets-db-schema.sql
```

飼い主と犬の名前を挿入する

```bash
owner_uuid=$(cat /proc/sys/kernel/random/uuid)
echo $owner_uuid
```

```bash
gcloud spanner rows insert --table=Owners --database=pets-db --instance=test-spanner-instance --data=OwnerID=$owner_uuid,OwnerName=Doug
```

次のコマンドで犬の名前を全て挿入する

```bash
gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Rusty',PetType='Dog',Breed='Poodle'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Duchess',PetType='Dog',Breed='Terrier'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Gretyl',PetType='Dog',Breed='Shepherd'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Gigi',PetType='Dog',Breed='Retriever'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Noir',PetType='Dog',Breed='Schnoodle'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=test-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Bree',PetType='Dog',Breed='Mutt'
```

挿入が完了したら以下のクエリでテストを行う

```bash
gcloud spanner databases execute-sql pets-db --instance=test-spanner-instance --sql='SELECT o.OwnerName, p.PetName, p.PetType, p.Breed FROM Owners as o JOIN Pets AS p ON o.OwnerID = p.OwnerID' 
```

以下のようになればOK!

```bash
OwnerName: Doug
PetName: Duchess
PetType: Dog
Breed: Terrier

OwnerName: Doug
PetName: Bree
PetType: Dog
Breed: Mutt

OwnerName: Doug
PetName: Noir
PetType: Dog
Breed: Schnoodle

OwnerName: Doug
PetName: Gretyl
PetType: Dog
Breed: Shepherd

OwnerName: Doug
PetName: Rusty
PetType: Dog
Breed: Poodle

OwnerName: Doug
PetName: Gigi
PetType: Dog
Breed: Retriever
```

データベースとSpannerのインスタンスを削除する

```bash
gcloud spanner databases delete pets-db --instance=test-spanner-instance 
```

```bash
gcloud spanner instances delete test-spanner-instance --quiet
```

Terraform用のフォルダを作成する

```bash
mkdir terraform-spanner
cd terraform-spanner
```

セットアップ

```bash
touch main.tf provider.tf terraform.tfvars variables.tf
```

`provider.tf`は以下の実装とする

```hcl
terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "~> 4.0"
    }
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}
```

`main.tf`

```hcl
resource "google_spanner_instance" "db-instance" {
  name             = "terraform-spanner-instance"
  config           = "regional-${var.region}"
  display_name     = "TF Spanner Instance"
  processing_units = var.processing_units
  force_destroy = var.force_destroy
}

resource "google_spanner_database" "test-database" {
  instance            = google_spanner_instance.db-instance.name
  name                = "pets-db"
  # Can't run destroy unless set to false
  deletion_protection = var.deletion_protection 

  ddl = [
    "CREATE TABLE Owners (OwnerID STRING(36) NOT NULL, OwnerName STRING(MAX) NOT NULL) PRIMARY KEY (OwnerID)",
    "CREATE TABLE Pets (PetID STRING(36) NOT NULL, OwnerID STRING(36) NOT NULL, PetType STRING(MAX) NOT NULL, PetName STRING(MAX) NOT NULL, Breed STRING(MAX) NOT NULL) PRIMARY KEY (PetID)",
  ]
}
```

`variables.tf` には変数群を格納する

```hcl
variable "deletion_protection" {
  description = "true に設定すると、データベースが作成されている場合、terraform destroy を実行できなくなります。"
  type        = bool
  default     = false
}

variable "force_destroy" {
    description = "true に設定した場合、terraform destroy を実行するとすべてのバックアップが削除されます。"
  type    = bool
  default = true
}

variable "processing_units" {
  type    = number
  default = 100
}

variable "project_id" {
  description = "GCP プロジェクト ID。"
  type        = string
}

variable "region" {
  type = string
}
```

デフォルト値を `terraform.tfvars` に記載する

```hcl
project_id = "qwiklabs-gcp-03-82de86abde2f"
region = "us-west1"
```

以下でTerraformプロジェクトを初期化

```bash
terraform init
```

以下のコマンドを順番に実行してリソースをGoogle Cloudに展開する

```bash
terraform plan
terraform apply
```

コンソールを確認し、さっきと同じデータベースがあることを確認する。

以下のコマンドを実行してデータが挿入できるかチェックする。

```bash
gcloud spanner rows insert --table=Owners --database=pets-db --instance=terraform-spanner-instance --data=OwnerID=$owner_uuid,OwnerName=Doug
```

```bash
gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Rusty',PetType='Dog',Breed='Poodle'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Duchess',PetType='Dog',Breed='Terrier'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Gretyl',PetType='Dog',Breed='Shepherd'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Gigi',PetType='Dog',Breed='Retriever'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Noir',PetType='Dog',Breed='Schnoodle'

gcloud spanner rows insert --table=Pets --database=pets-db --instance=terraform-spanner-instance --data=PetID=$(cat /proc/sys/kernel/random/uuid),OwnerID=$owner_uuid,PetName='Bree',PetType='Dog',Breed='Mutt'
```

挿入が完了したら以下のクエリでテストを行う

```bash
gcloud spanner databases execute-sql pets-db --instance=terraform-spanner-instance --sql='SELECT o.OwnerName, p.PetName, p.PetType, p.Breed FROM Owners as o JOIN Pets AS p ON o.OwnerID = p.OwnerID' 
```

以下のコマンドでリソースを一括削除する

```bash
terraform destroy -auto-approve
```

## 参考文献
- [高いけどスゴイ！『Cloud Spanner』を徹底解説](https://cloud-ace.jp/column/detail387/)
- [Cloud Spanner - 実質的に無制限のスケーリングを備えた、常時稼働のデータベース](https://cloud.google.com/spanner?hl=ja)
