import {
    FunctionDeclarationSchemaType,
    HarmBlockThreshold,
    HarmCategory,
    VertexAI
} from '@google-cloud/vertexai';

// プロジェクトIDを設定
const project = 'lyrical-art-273306';
// リージョンを指定
const location = 'us-central1';
// モデルの情報を指定する。
const textModel =  'gemini-1.0-pro';
const visionModel = 'gemini-1.0-pro-vision';

// VertexAIインスタンスを作成。
const vertexAI = new VertexAI({
    project: project, 
    location: location
});

// Instantiate Gemini models
export const generativeModel = vertexAI.getGenerativeModel({
    model: textModel,
    // The following parameters are optional
    // They can also be passed to individual content generation requests
    safetySettings: [{
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, 
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE
    }],
    generationConfig: {
        maxOutputTokens: 256
    },
    systemInstruction: {
        role: 'system',
        parts: [{
            "text": `For example, you are a helpful customer service agent.`
        }]
    },
});

export const generativeVisionModel = vertexAI.getGenerativeModel({
    model: visionModel,
});

export const generativeModelPreview = vertexAI.preview.getGenerativeModel({
    model: textModel,
});

/**
 * ストリーミングで出力させるサンプルメソッド
 */
export async function streamGenerateContent() {
    const request = {
        contents: [{
            role: 'user',
            parts: [{text: 'How are you doing today?'}]
        }],
    };
    // ストリーミングで出力
    const streamingResult = await generativeModel.generateContentStream(request);

    for await (const item of streamingResult.stream) {
      console.log('stream chunk: ', JSON.stringify(item));
    }
    const aggregatedResponse = await streamingResult.response;
    console.log('aggregated response: ', JSON.stringify(aggregatedResponse));
};

/**
 * ストリーミングなしで出力するメソッド
 */
export async function generateContent() {
    const request = {
        contents: [{
            role: 'user',
            parts: [{text: 'How are you doing today?'}]
        }],
    };
    // ストリーミングなしで出力
    const result = await generativeModel.generateContent(request);
    const response = result.response;
    console.log('Response: ', JSON.stringify(response));
};

/**
 * ストリーミングに対応したチャットメソッド
 */
export async function streamChat() {
    // チャット開始
    const chat = generativeModel.startChat();
    const chatInput = "How can I learn more about Node.js?";
    const result = await chat.sendMessageStream(chatInput);
    // 結果を取り出す。
    for await (const item of result.stream) {
        console.log("Stream chunk: ", item.candidates![0].content.parts[0].text);
    }
    const aggregatedResponse = await result.response;
    console.log('Aggregated response: ', JSON.stringify(aggregatedResponse));
}

/**
 * ストリーミングに対応していないチャットメソッド
 */
export async function sendChat() {
    // チャット開始
    const chat = generativeModel.startChat();
    const chatInput = "How can I learn more about Node.js?";
    const result = await chat.sendMessage(chatInput);
    // 結果を取り出す。
    const response = result.response;
    console.log('response: ', JSON.stringify(response));
}
  

  