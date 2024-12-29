import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
import { HumanMessage } from "@langchain/core/messages";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import * as dotenv from "dotenv";

dotenv.config();

const {
    GEMINI_API_KEY,
    TAVILY_API_KEY
} = process.env;


/**
 * サンプルコード
 */
const main = async() => {
    // Define the tools for the agent to use
    const tools = [new TavilySearchResults({ maxResults: 3 })];
    const toolNode = new ToolNode(tools);

    // Create a model and give it access to the tools
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

    /**
     * Define the function that determines whether to continue or not
     * @param param0 
     * @returns 
     */
    function shouldContinue({ messages }: typeof MessagesAnnotation.State) {
        const lastMessage = messages[messages.length - 1];

        // If the LLM makes a tool call, then we route to the "tools" node
        if (lastMessage.additional_kwargs.tool_calls) {
            return "tools";
        }
        // Otherwise, we stop (reply to the user) using the special "__end__" node
        return "__end__";
    }

    /**
     * Define the function that calls the model
     * @param state 
     * @returns 
     */
    async function callModel(state: typeof MessagesAnnotation.State) {
        // AIに推論させる
        const response = await model.invoke(state.messages);

        // We return a list, because this will get added to the existing list
        return { messages: [response] };
    }

    // ワークフローを構築する。
    const workflow = new StateGraph(MessagesAnnotation)
        .addNode("agent", callModel)
        .addEdge("__start__", "agent") // __start__ is a special name for the entrypoint
        .addNode("tools", toolNode)
        .addEdge("tools", "agent")
        .addConditionalEdges("agent", shouldContinue);

    // Finally, we compile it into a LangChain Runnable.
    const app = workflow.compile();

    // Use the agent
    const finalState = await app.invoke({
        messages: [new HumanMessage("what is the weather in sf")],
    });
    console.log(finalState.messages[finalState.messages.length - 1].content);

    const nextState = await app.invoke({
        // Including the messages from the previous run gives the LLM context.
        // This way it knows we're asking about the weather in NY
        messages: [...finalState.messages, new HumanMessage("what about Amazon Aurora DSQL?")],
    });

    console.log(nextState.messages[nextState.messages.length - 1].content);
}

main();