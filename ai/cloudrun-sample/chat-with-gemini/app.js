const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const path = require("path");

const fs = require("fs");
const util = require("util");
const { spinnerSvg } = require("./spinnerSvg.js");

// cloud run retrieves secret at instance startup time
const secret = process.env.SESSION_SECRET;

const { Firestore } = require("@google-cloud/firestore");
const { FirestoreStore } = require("@google-cloud/connect-firestore");
var session = require("express-session");

app.set("trust proxy", 1); // trust first proxy
app.use(
    session({
        store: new FirestoreStore({
            dataset: new Firestore(),
            kind: "express-sessions"
        }),
        secret: secret,
        /* set secure to false for local dev session history testing */
        /* see more at https://expressjs.com/en/resources/middleware/session.html */
        cookie: { secure: true },
        resave: false,
        saveUninitialized: true
    })
);

const expressWs = require("express-ws")(app);

app.use(express.static("public"));

// Vertex AI Section
const { VertexAI } = require("@google-cloud/vertexai");

// instance of Vertex model
let generativeModel;

// on startup
const port = parseInt(process.env.PORT) || 8080;

// APIを起動
app.listen(port, async () => {
    console.log(`demo1: listening on port ${port}`);

    // get project and location from metadata service
    const metadataService = require("./metadataService.js");

    const project = await metadataService.getProjectId(); // ローカルで起動する時は設定
    const location = await metadataService.getRegion();

    // Vertex client library instance
    const vertex_ai = new VertexAI({
        project: project,
        location: location
    });

    // Instantiate models
    generativeModel = vertex_ai.getGenerativeModel({
        model: "gemini-1.0-pro-001"
    });
});

/**
 * sendMessage メソッド
 */
app.ws("/sendMessage", async function (ws, req) {
    if (!req.session.chathistory || req.session.chathistory.length == 0) {
        req.session.chathistory = [];
    }

    let chatWithModel = generativeModel.startChat({
        history: req.session.chathistory
    });

    ws.on("message", async function (message) {

        console.log("req.sessionID: ", req.sessionID);
        // get session id

        let questionToAsk = JSON.parse(message).message;
        console.log("WebSocket message: " + questionToAsk);

        ws.send(`<div hx-swap-oob="beforeend:#toupdate"><div
                        id="questionToAsk"
                        class="text-black m-2 text-right border p-2 rounded-lg ml-24">
                        ${questionToAsk}
                    </div></div>`);

        // to simulate a natural pause in conversation
        await sleep(500);

        // get timestamp for div to replace
        const now = "fromGemini" + Date.now();

        ws.send(`<div hx-swap-oob="beforeend:#toupdate"><div
                        id=${now}
                        class=" text-blue-400 m-2 text-left border p-2 rounded-lg mr-24">
                        ${spinnerSvg} 
                    </div></div>`);

        const results = await chatWithModel.sendMessage(questionToAsk);
        const answer =
            results.response.candidates[0].content.parts[0].text;

        ws.send(`<div
                        id=${now}
                        hx-swap-oob="true"
                        hx-swap="outerHTML"
                        class="text-blue-400 m-2 text-left border p-2 rounded-lg mr-24">
                        ${answer}
                    </div>`);

                    // save to current chat history
        let userHistory = {
            role: "user",
            parts: [{ text: questionToAsk }]
        };
        let modelHistory = {
            role: "model",
            parts: [{ text: answer }]
        };

        req.session.chathistory.push(userHistory);
        req.session.chathistory.push(modelHistory);

        // console.log(
        //     "newly saved chat history: ",
        //     util.inspect(req.session.chathistory, {
        //         showHidden: false,
        //         depth: null,
        //         colors: true
        //     })
        // );
        req.session.save();
    });

    ws.on("close", () => {
        console.log("WebSocket was closed");
    });
});

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

// gracefully close the web sockets
process.on("SIGTERM", () => {
    server.close();
});