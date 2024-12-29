# LangGraphを検証するフォルダ

## セットアップ

1. travy.com でAPIキーを作成。

2. Open AIかOpenRouterのAPIキーを作成する。

2. 環境変数をセットアップする。

    ```txt
    OPENAI_API_KEY="sk-..."
    TAVILY_API_KEY="tvly-..."
    ```

## 動かし方

- インストール

    ```bash
    bun install
    ```

- サンプル用のスクリプト実行

    ```bash
    bun run agents
    ```

- サンプル用のスクリプト2実行

    ```bash
    bun run agents2
    ```

- Google Cloud AIを使ったサンプルスクリプト実行

    ```bash
    bun run googleAI
    ```

### 参考文献
1. [tavily 公式サイト](https://tavily.com/)
2. [Note - LangChain の Tavily Serch API を試す](https://note.com/npaka/n/n9fe8a607c56e)
3. [Zenn - LangGraphのexamplesからエージェントの作り方を学ぶ](https://zenn.dev/zenkigen_tech/articles/536801e61d0689)
4. [LangGraphとは？サンプルコードをもとにわかりやすく解説！](https://book.st-hakky.com/data-science/langgraph-intro/)