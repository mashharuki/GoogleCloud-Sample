import { createBrianAgent } from "@brian-ai/langchain";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import * as dotenv from "dotenv";
import { ChatOpenAI } from "@langchain/openai";
import { brianToolkit } from "./tools";

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
        }),
        tools: brianToolkit.tools
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
        token: "ETH",
        amount: 1,
        receiver: "0x1295BDc0C102EB105dC0198fdC193588fe66A1e4",
        input: "Send 1 ETH to 0x1295BDc0C102EB105dC0198fdC193588fe66A1e4 on Ethereum Holesky  (chain id: 17000)",
    });
    console.log(result);

    // get balance of wallet
    const result2 = await agent.invoke({
        token: "ETH",
        chain: "Ethereum Holesky",
        address: "0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072",
        input: "Please tell me abount balance of 0x51908F598A5e0d8F1A3bAbFa6DF76F9704daD072 on the Ethereum Holesky  (chain id: 17000) & show me it."
    });

    console.log(result2);

    const result3 = await agent.invoke({
        input: "What is the USDC balance of mashharuki.eth on Base?",
    });

    console.log(result3);
};
 
main();