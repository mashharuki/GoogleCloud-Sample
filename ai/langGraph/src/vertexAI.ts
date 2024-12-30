import {
    FunctionDeclarationSchemaType,
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} from '@google-cloud/vertexai';
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { HumanMessage } from "@langchain/core/messages";
import { StateGraph, MessagesAnnotation } from "@langchain/langgraph";
import * as dotenv from "dotenv";

dotenv.config();

const {
    GEMINI_API_KEY,
    TAVILY_API_KEY
} = process.env;

// プロジェクトIDを設定
const project = 'lyrical-art-273306';
// リージョンを指定
const location = 'us-central1';
// モデルの情報を指定する。
const textModel =  'gemini-pro';


/**
 * サンプルコード
 */
const main = async() => {
    // Define the tools for the agent to use
    const tools = [new TavilySearchResults({ apiKey: TAVILY_API_KEY ,maxResults: 3 })];
    const toolNode = new ToolNode(tools);

    // VertexAIインスタンスを作成。
    const vertexAI = new VertexAI({
        project: project, 
        location: location
    });

    // Instantiate Gemini models
    const model = vertexAI.getGenerativeModel({
        model: textModel,
        safetySettings: [{
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
        }],
        generationConfig: {
            maxOutputTokens: 2048
        },
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
        console.log("content:", state.messages[state.messages.length - 1].content.toString())

        // AIに推論させる
        const response = await model.generateContent({
            contents: [{
                role: 'model',
                parts: [
                    {
                        text: `${state.messages[state.messages.length - 1].content.toString()}`
                    }
                ]
            }]
        });

        // Extract the first candidate's content
        const content = response.response.candidates![0].content;
        // Create a HumanMessage object
        const message = new HumanMessage(content.parts[0].text as string);

        // console.log("message:", message)

        return  { messages: [message] };
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
        messages: [new HumanMessage("what is AWS?")],
    });
    console.log(finalState.messages[finalState.messages.length - 1].content);

    const nextState = await app.invoke({
        messages: [...finalState.messages, new HumanMessage("Please tell me about Amazon Aurora DSQL?")],
    });

    console.log(nextState.messages[nextState.messages.length - 1].content);
};

main();