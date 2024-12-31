# Brain SDKを検証するためのプロジェクト

## 動かし方

- セットアップ

    環境変数として以下を設定

    ```txt
    BRIAN_API_KEY=""
    AGENT_PRIVATE_KEY=""
    GEMINI_API_KEY=""
    ```     

- インストール

    ```bash
    bun install
    ```

- サンプル用のfirst Agentを動かすサンプルスクリプト

    ```bash
    bun run firstAgent
    ```

    ```bash
    using networks
    {
        input: "Send 1 ETH to 0x1295BDc0C102EB105dC0198fdC193588fe66A1e4 on Ethereum Holesky",
        output: "The transfer of 1 ETH to the address 0x1295BDc0C102EB105dC0198fdC193588fe66A1e4 on Ethereum Holesky has been successfully completed.",
        __run: {
            runId: "95ac2ba1-3c69-4260-98cf-795ab3cc9c71",
        },
    }
    ```

- GetStartedのコードを動かすスクリプト

    ```bash
    bun run getStarted
    ```

    ```json
    {
        input: "Swap 1 USDC for ETH on Ethereum Holesky",
        output: "It seems that there was an internal server error while trying to execute the swap on Ethereum Holesky. Can I help you with anything else?",
        __run: {
            runId: "6a602968-7490-4b88-8501-c49b40fbf481",
        },
    }
    ``` 

- ERC20トークンをデプロイするスクリプト

    ```bash
    bun run erc20Deployer
    ```

    ```bash

    ```

### 参考文献
1. [Brain SDK ダッシュボード画面](https://www.brianknows.org/app/settings)
2. [Getting Started](https://langchain.brianknows.org/getting-started)
3. [Brain LangChain向けSDK](https://langchain.brianknows.org/)
4. [GitHub - brian-knows/langchain-toolkit](https://github.com/brian-knows/langchain-toolkit)