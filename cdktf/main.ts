import { App } from "cdktf";
import * as dotenv from "dotenv";
import { MyStack } from "./lib/stack";

dotenv.config();

const {
  PROJECT_ID,
  REGION
} = process.env;

const app = new App();

new MyStack(app, "cdktf", {
  projectId: PROJECT_ID!,
  region: REGION!,
  name: "hono-vertexai-sample"
});

app.synth();
