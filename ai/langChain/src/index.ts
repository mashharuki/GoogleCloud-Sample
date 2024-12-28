import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const {
    GEMINI_API_KEY
} = process.env;

/**
 * サンプルメソッド
 */
const main = async() => {
    // Google GeminiのAPIを使うための設定
    const model = new ChatGoogleGenerativeAI({
        apiKey: GEMINI_API_KEY,
        modelName: "gemini-pro",
        maxOutputTokens: 2048,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
          },
        ],
    });
      
    const res = await model.invoke([
        [
          "human",
          "What would be a good company name for a company that makes colorful socks?",
        ],
    ]);
      
    console.log(res);
};

main();