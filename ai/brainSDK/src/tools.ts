import { BrianToolkit } from "@brian-ai/langchain";
import { BrianCDPToolkit } from "@brian-ai/langchain";
import * as dotenv from "dotenv";

dotenv.config();

const {
    BRIAN_API_KEY,
    AGENT_PRIVATE_KEY,
    GELATO_API_KEY,
    COINBASE_API_KEY_NAME,
    COINBASE_API_SECRET_KEY
} = process.env;

// ToolKit用のオプション
type BrianToolkitOptions = {
    gelatoApiKey?: string;
};

// Tool用のインスタンス生成用のオプション変数
const options: BrianToolkitOptions = {
    gelatoApiKey: GELATO_API_KEY
}

export const brianToolkit = new BrianToolkit({
  apiKey: BRIAN_API_KEY!,
  privateKeyOrAccount: AGENT_PRIVATE_KEY as `0x${string}`,
  options: options
});

export const brianCDPToolkit = new BrianCDPToolkit({
    apiKey: BRIAN_API_KEY!,
    coinbaseApiKeyName: COINBASE_API_KEY_NAME!,
    coinbaseApiKeySecret: COINBASE_API_SECRET_KEY!,
});

