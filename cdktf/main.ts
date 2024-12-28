import { App } from "cdktf";
import { MyStack } from "./lib/stack";
import * as dotenv from "dotenv";

dotenv.config();

const {
  PROJECT_ID
} = process.env;

const app = new App();

new MyStack(app, "cdktf", {
  projectId: PROJECT_ID!,
  region: "us-central1",
  name: "hono-vertexai-sample"
});

app.synth();
