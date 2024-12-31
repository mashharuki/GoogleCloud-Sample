import { createBrianAgent } from "@brian-ai/langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();

const {
    BRIAN_API_KEY,
    AGENT_PRIVATE_KEY,
    GEMINI_API_KEY,
    OPEN_AI_API_KEY
} = process.env;

/**
 * AI Agent用のインスタンスを作成するメソッド
 */
export const createBrianGoogleAIAgent = async() => {
    const agent = await createBrianAgent({
        apiKey: BRIAN_API_KEY!,
        privateKeyOrAccount: AGENT_PRIVATE_KEY! as `0x${string}`,
        llm: new ChatGoogleGenerativeAI({
            apiKey: GEMINI_API_KEY,
            /*
            modelName: "gemini-pro",
            maxOutputTokens: 2048,
            safetySettings: [
              {
                category: HarmCategory.HARM_CATEGORY_HARASSMENT,
                threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
              },
            ],
            */
        })
    });

    return agent;
} 

/**
 * OpenAIのAI Agent用のインスタンスを作成するメソッド
 */
export const createBrianOpenAIAgent = async() => {
    const agent = await createBrianAgent({
        apiKey: BRIAN_API_KEY!,
        privateKeyOrAccount: AGENT_PRIVATE_KEY! as `0x${string}`,
        llm: new ChatOpenAI({
            apiKey: OPEN_AI_API_KEY
        })
    });

    return agent;
} 
  
/**
 * 検証用のスクリプト
 */
const main = async () => {
    // AIAgent用のインスタンスを生成
    const agent = await createBrianOpenAIAgent();
 
    // Execute blockchain operations using natural language
    const result = await agent.invoke({
        input: "Send 1 ETH to 0x1295BDc0C102EB105dC0198fdC193588fe66A1e4 on Ethereum sepolia  (chain id: 11155111)",
    });
    console.log(result);
};
 
main();