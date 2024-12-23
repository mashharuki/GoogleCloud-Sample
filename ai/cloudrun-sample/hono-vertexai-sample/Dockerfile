# ベースイメージ
FROM oven/bun:latest

# プロジェクトルートを変更する（任意）
WORKDIR /usr/src/app

# フォルダの中身を全てコピーする。
COPY ./ ./

# 依存関係をインストール
RUN bun install --production

# run the app
USER bun
EXPOSE 3000/tcp

# サーバーを起動する
CMD ["bun", "run", "dev"]