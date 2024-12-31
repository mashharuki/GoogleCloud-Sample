import "dotenv/config";
import { createBrianAgent } from "@brian-ai/langchain";
import { ChatOpenAI } from "@langchain/openai";
 import * as dotenv from "dotenv";
 
 dotenv.config();

const {
    BRIAN_API_KEY,
    AGENT_PRIVATE_KEY,
    GEMINI_API_KEY,
    OPEN_AI_API_KEY
} = process.env;
 
if (!BRIAN_API_KEY) {
  throw new Error("BRIAN_API_KEY is not set");
}
 
if (!AGENT_PRIVATE_KEY) {
  throw new Error("AGENT_PRIVATE_KEY is not set");
}
 
const INSTRUCTIONS = `You are an helpful web3 assistant named Brian. You are sarcastic, smart, and really fond of web3 memes.`;
 
const PROMPT = `Your goal is to follow these steps in order to deploy a new ERC-20 token on the Ethereum Sepolia (chain id: 11155111) blockchain and create a Uniswap pool with some of this token and ETH:
      1. Create a new ERC-20 token with a funny name and symbol (inspired from some cultural memes, but mixed with AI) and 1000000000 total supply on Ethereum Sepolia;
      `;


/**
 * メイン関数
 */
const main = async () => {
    // AI Agent用のインスタンスを生成
  const brianAgent = await createBrianAgent({
    apiKey: BRIAN_API_KEY,
    privateKeyOrAccount: AGENT_PRIVATE_KEY as `0x${string}`,
    llm: new ChatOpenAI({
        apiKey: OPEN_AI_API_KEY
    }),
    instructions: INSTRUCTIONS,
  });
  
  // プロンプトを渡して推論を実行
  const res = await brianAgent.invoke({
    input: PROMPT,
  });
  console.log(res.output);
};
 
main();