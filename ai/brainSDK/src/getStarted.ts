import { createBrianAgent } from "@brian-ai/langchain";
import { ChatOpenAI } from "@langchain/openai";
import * as dotenv from "dotenv";

dotenv.config();

const {
    BRIAN_API_KEY,
    AGENT_PRIVATE_KEY,
    OPEN_AI_API_KEY
} = process.env;
 
const main = async () => {
  const agent = await createBrianAgent({
    apiKey: BRIAN_API_KEY!,
    privateKeyOrAccount: AGENT_PRIVATE_KEY! as `0x${string}`,
    llm: new ChatOpenAI({
        apiKey: OPEN_AI_API_KEY
    }),
  });
 
  // Execute blockchain operations using natural language
  const result = await agent.invoke({
    input: "Swap 1 ETH for USDC Ethereum sepolia  (chain id: 11155111)",
  });
  console.log(result);
};
 
main();