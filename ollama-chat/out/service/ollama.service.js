"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteModel = exports.pullModel = exports.models = exports.chat = void 0;
const ollama_1 = __importDefault(require("ollama"));
const chat = async (text, model) => {
    let responseText = '';
    const prompt = `
        take the prompt below and answer the message precisely:
        ================================================================
        ${text}
        ================================================================
        ATTENTION:
            - Do not change the prompt.
            - Do not add any extra information.
            - Do not remove any information.
            - Answer only the question
            - Return the response in Markdown format
    `;
    const streamResponse = await ollama_1.default.chat({
        model: model,
        messages: [{ role: 'user', content: prompt }],
        stream: true
    });
    for await (const part of streamResponse) {
        responseText += part.message.content;
    }
    responseText = responseText.replace(/<think>[\s\S]*?<\/think>\n*/g, '');
    return responseText;
};
exports.chat = chat;
const models = async () => {
    return ollama_1.default.list();
};
exports.models = models;
const pullModel = async (model) => {
    return ollama_1.default.pull({ model: model, stream: true });
};
exports.pullModel = pullModel;
const deleteModel = async (model) => {
    return ollama_1.default.delete({ model: model });
};
exports.deleteModel = deleteModel;
//# sourceMappingURL=ollama.service.js.map