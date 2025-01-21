import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import {
  ChatPromptTemplate,
  MessagesPlaceholder,
} from "@langchain/core/prompts";
import { Runnable } from "@langchain/core/runnables";
import { StructuredTool, tool } from "@langchain/core/tools";
import { convertToOpenAITool } from "@langchain/core/utils/function_calling";
import { Annotation } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { ChatOpenAI } from "@langchain/openai";
import { createCanvas } from "canvas";
import * as d3 from "d3";
import * as dotenv from "dotenv";
import * as tslab from "tslab";
import { z } from "zod";

dotenv.config();

const {
  OPENAI_API_KEY,
  TAVILY_API_KEY,
  LANGCHAIN_API_KEY,
  LANGCHAIN_TRACING_V2,
  LANGCHAIN_PROJECT,
} = process.env;

/**
 * AI Agentインスタンスを生成するメソッド
 */
export async function createAgent({
  llm,
  tools,
  systemMessage,
}: {
  llm: ChatOpenAI;
  tools: StructuredTool[];
  systemMessage: string;
}): Promise<Runnable> {
  // ツール
  const toolNames = tools.map((tool) => tool.name).join(", ");
  const formattedTools = tools.map((t) => convertToOpenAITool(t));
  // プロンプト
  let prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are a helpful AI assistant, collaborating with other assistants." +
      " Use the provided tools to progress towards answering the question." +
      " If you are unable to fully answer, that's OK, another assistant with different tools " +
      " will help where you left off. Execute what you can to make progress." +
      " If you or any of the other assistants have the final answer or deliverable," +
      " prefix your response with FINAL ANSWER so the team knows to stop." +
      " You have access to the following tools: {tool_names}.\n{system_message}",
    ],
    new MessagesPlaceholder("messages"),
  ]);
  // ユーザーからの入力とツールの割り当てを行う。
  prompt = await prompt.partial({
    system_message: systemMessage,
    tool_names: toolNames,
  });

  return prompt.pipe(llm.bind({ tools: formattedTools }));
}

/**
 * ステートを定義するメソッド
 */
async function createState() {
  // This defines the object that is passed between each node
  // in the graph. We will create different nodes for each agent and tool
  const AgentState = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
      reducer: (x, y) => x.concat(y),
    }),
    sender: Annotation<string>({
      reducer: (x, y) => y ?? x ?? "user",
      default: () => "user",
    }),
  });

  return AgentState;
}

/**
 * ツールを定義するメソッド
 */
export async function createTool() {
  // chart ツールの定義
  const chartTool = tool(
    ({ data }) => {
      const width = 500;
      const height = 500;
      const margin = { top: 20, right: 30, bottom: 30, left: 40 };
  
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");
  
      const x = d3
        .scaleBand()
        .domain(data.map((d) => d.label))
        .range([margin.left, width - margin.right])
        .padding(0.1);
  
      const y = d3
        .scaleLinear()
        .domain([0, d3.max(data, (d) => d.value) ?? 0])
        .nice()
        .range([height - margin.bottom, margin.top]);
  
      const colorPalette = [
        "#e6194B",
        "#3cb44b",
        "#ffe119",
        "#4363d8",
        "#f58231",
        "#911eb4",
        "#42d4f4",
        "#f032e6",
        "#bfef45",
        "#fabebe",
      ];
  
      data.forEach((d, idx) => {
        ctx.fillStyle = colorPalette[idx % colorPalette.length];
        ctx.fillRect(
          x(d.label) ?? 0,
          y(d.value),
          x.bandwidth(),
          height - margin.bottom - y(d.value),
        );
      });
  
      ctx.beginPath();
      ctx.strokeStyle = "black";
      ctx.moveTo(margin.left, height - margin.bottom);
      ctx.lineTo(width - margin.right, height - margin.bottom);
      ctx.stroke();
  
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      x.domain().forEach((d) => {
        const xCoord = (x(d) ?? 0) + x.bandwidth() / 2;
        ctx.fillText(d, xCoord, height - margin.bottom + 6);
      });
  
      ctx.beginPath();
      ctx.moveTo(margin.left, height - margin.top);
      ctx.lineTo(margin.left, height - margin.bottom);
      ctx.stroke();
  
      ctx.textAlign = "right";
      ctx.textBaseline = "middle";
      const ticks = y.ticks();
      ticks.forEach((d) => {
        const yCoord = y(d); // height - margin.bottom - y(d);
        ctx.moveTo(margin.left, yCoord);
        ctx.lineTo(margin.left - 6, yCoord);
        ctx.stroke();
        ctx.fillText(d.toString(), margin.left - 8, yCoord);
      });
      tslab.display.png(canvas.toBuffer());
      return "Chart has been generated and displayed to the user!";
    },
    {
      name: "generate_bar_chart",
      description:
        "Generates a bar chart from an array of data points using D3.js and displays it for the user.",
      schema: z.object({
        data: z
          .object({
            label: z.string(),
            value: z.number(),
          })
          .array(),
      }),
    }
  )
  // 検索用のツール定義
  const tavilyTool = new TavilySearchResults({
    apiKey: TAVILY_API_KEY
  });

  return {chartTool, tavilyTool};
}

/**
 * AI Agentを実行させるメソッド
 */
async function runAgentNode(props: {
  state: any,
  agent: Runnable;
  name: string;
  config?: {
    messages: BaseMessage[],
    sender: string
  }
}) {

  const { state, agent, name, config } = props;

  state.messages = config?.messages ?? [];
  state.sender = config?.sender ?? "user";

  //console.log("Running agent node with state:", state);

  try {
    // AI Agentを実行する。
    let result = await agent.invoke(state);

    // We convert the agent output into a format that is suitable
    // to append to the global state
    if (!result?.tool_calls || result.tool_calls.length === 0) {
      // If the agent is NOT calling a tool, we want it to
      // look like a human message.
      result = new HumanMessage({ ...result, name: name });
    }
    return {
      messages: [result],
      // Since we have a strict workflow, we can
      // track the sender so we know who to pass to next.
      sender: name,
    };
  } catch (error) {
    console.error("Failed to connect to OpenAI API:", error);
  }
}

/**
 * 検索用のタスクをAIエージェントに実行させるメソッド
 * @param config 
 * @returns 
 */
export async function researchNode(props:{
    messages: BaseMessage[],
    sender: string
  }) {
  // ステートを定義する。
  const agentState = await createState();
  // LLMの定義
  const llm = new ChatOpenAI({ 
    apiKey: OPENAI_API_KEY,
    modelName: "gpt-4o-mini" 
  });
  // ツールを定義する。
  const { tavilyTool } = await createTool();

  // Research agent and node
  const researchAgent = await createAgent({
    llm,
    tools: [tavilyTool],
    systemMessage:
      "You should provide accurate data for the chart generator to use.",
  });

  return runAgentNode({
    state: agentState,
    agent: researchAgent,
    name: "Researcher",
    config: props
  });
}

/**
 * チャート表示用のタスクをAIエージェントに実行させるメソッド
 * @param config 
 * @returns 
 */
export async function chartNode() {
  // ステートを定義する。
  const agentState = await createState();
  // LLMの定義
  const llm = new ChatOpenAI({ 
    apiKey: OPENAI_API_KEY,
    modelName: "gpt-4o-mini" 
  });
  // ツールを定義する。
  const { chartTool } = await createTool();

  // Chart Generator
  const chartAgent = await createAgent({
    llm,
    tools: [chartTool],
    systemMessage: "Any charts you display will be visible by the user.",
  });

  return runAgentNode({
    state: agentState,
    agent: chartAgent,
    name: "ChartGenerator",
  });
}

/**
 * toolをinvokeするメソッド
 */
export async function defineToolNode(researchResults: any) {
  const { chartTool, tavilyTool } = await createTool();

  // This runs tools in the graph
  const toolNode = new ToolNode([chartTool, tavilyTool]);

  // Example invocation
  await toolNode.invoke(researchResults);
}