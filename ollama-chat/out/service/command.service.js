"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.openModelPanel = exports.removeOllamaModel = exports.addModelFunction = void 0;
const vscode = __importStar(require("vscode"));
const template_1 = require("../provider/template");
const ollama_service_1 = require("./ollama.service");
const addModelFunction = async () => {
    const inputBox = await vscode.window.showInputBox({
        placeHolder: "Add Ollama Model",
        prompt: "Enter some ollama model name",
        value: ''
    });
    if (inputBox) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Pulling Ollama Model",
            cancellable: false,
        }, (progress, token) => {
            return (0, ollama_service_1.pullModel)(inputBox)
                .then(() => {
                vscode.window.showInformationMessage(`Model ${inputBox} loaded successfully`);
            })
                .catch((err) => {
                vscode.window.showErrorMessage(`Error Loading Model ${inputBox}: ${String(err)}`);
            });
        });
    }
};
exports.addModelFunction = addModelFunction;
const removeOllamaModel = async () => {
    const items = await (await (0, ollama_service_1.models)()).models.map((model) => {
        return model.name;
    });
    const result = await vscode.window.showQuickPick(items, {
        placeHolder: 'Select a Model',
        canPickMany: false,
    });
    if (result) {
        vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "Pulling Ollama Model",
            cancellable: false,
        }, (progress, token) => {
            return (0, ollama_service_1.deleteModel)(result)
                .then((status) => {
                vscode.window.showInformationMessage(`Model ${result}, Status: ${status.status}`);
            })
                .catch((err) => {
                vscode.window.showErrorMessage(`Error Removing Model ${result}: ${String(err)}`);
            });
        });
    }
};
exports.removeOllamaModel = removeOllamaModel;
const openModelPanel = () => {
    const panel = vscode.window.createWebviewPanel('ollama-chat', 'Ollama Chat', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = (0, template_1.generateHtml)();
    panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.command) {
            case 'chat':
                try {
                    let responseUser = `***Thinking.... Await a moment...***`;
                    panel.webview.postMessage({ command: 'chatResponse', text: responseUser, completed: false });
                    const responseText = await (0, ollama_service_1.chat)(message.text, message.model);
                    panel.webview.postMessage({ command: 'chatResponse', text: responseText, completed: true });
                }
                catch (err) {
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}`, completed: true });
                }
                break;
            case 'load':
                const response = await (0, ollama_service_1.models)();
                for (const model of response.models) {
                    panel.webview.postMessage({ command: 'modelResponse', text: model.name });
                }
        }
    });
};
exports.openModelPanel = openModelPanel;
//# sourceMappingURL=command.service.js.map