import { HumanMessage } from "@langchain/core/messages";
import { defineToolNode, researchNode } from "./lib/agent";

/**
 * 検索用のタスクをAI Agentに実行させるメソッド
 */
const main = async() => {
  // Example invocation
  const researchResults = await researchNode({
    messages: [new HumanMessage("Research the US primaries in 2024")],
    sender: "User",
  });

  console.log({researchResults});
  // Tool群の定義
  await defineToolNode(researchResults)
};

main();