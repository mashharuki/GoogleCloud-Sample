import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatOpenAI } from "@langchain/openai";
import { MemorySaver } from "@langchain/langgraph";
import { HumanMessage } from "@langchain/core/messages";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import * as dotenv from "dotenv";

dotenv.config();

const {
    OPENAI_API_KEY,
    TAVILY_API_KEY
} = process.env;


/**
 * サンプルコード
 */
const main = async() => {
    // 使用する外部ツールとモデルを選択。
    const agentTools = [new TavilySearchResults({ maxResults: 3 })];
    const agentModel = new ChatOpenAI({ temperature: 0 });

    // Initialize memory to persist state between graph runs
    const agentCheckpointer = new MemorySaver();
    // AI Agent用のインスタンスをs
    const agent = createReactAgent({
        llm: agentModel,
        tools: agentTools,
        checkpointSaver: agentCheckpointer,
    });

    // AI Agentの呼び出し
    const agentFinalState = await agent.invoke(
        { messages: [new HumanMessage("what is the current weather in sf")] },
        { configurable: { thread_id: "42" } },
    );

    console.log(
        agentFinalState.messages[agentFinalState.messages.length - 1].content,
    );

    // Amazon Aurora DSQLについて聞いてみる。
    const agentNextState = await agent.invoke(
        { messages: [new HumanMessage("what about Amazon Aurora DSQL?")] },
        { configurable: { thread_id: "42" } },
    );

    console.log(
        agentNextState.messages[agentNextState.messages.length - 1].content,
    );
}

main();