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

以下のファイルを作成する

```bash
nano pets-db-schema.sql
```

## 参考文献
- [高いけどスゴイ！『Cloud Spanner』を徹底解説](https://cloud-ace.jp/column/detail387/)
- [Cloud Spanner - 実質的に無制限のスケーリングを備えた、常時稼働のデータベース](https://cloud.google.com/spanner?hl=ja)
