import * as vscode from 'vscode';
import { generateHtml } from '../provider/template';
import { chat, deleteModel, models, pullModel } from './ollama.service';


export const addModelFunction = async () => {
    const inputBox  = await vscode.window.showInputBox({
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
            return pullModel(inputBox)
            .then(() => {
                vscode.window.showInformationMessage(`Model ${inputBox} loaded successfully`);
            })
            .catch((err) => {
                vscode.window.showErrorMessage(`Error Loading Model ${inputBox}: ${String(err)}`);
            });
        });
    }
};

export const removeOllamaModel = async () => {
    const items = await (await models()).models.map((model) => {
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
            return deleteModel(result)
            .then((status) => {
                vscode.window.showInformationMessage(`Model ${result}, Status: ${status.status}`);
            })
            .catch((err) => {
                vscode.window.showErrorMessage(`Error Removing Model ${result}: ${String(err)}`);
            });
        });
    }
};

export const openModelPanel = () => {
    const panel  = vscode.window.createWebviewPanel(
        'ollama-chat',
        'Ollama Chat',
        vscode.ViewColumn.One,
        { enableScripts: true}
    );
    
    panel.webview.html = generateHtml();
    panel.webview.onDidReceiveMessage(async (message) => {
        switch (message.command) {
            case 'chat':
                try {
                    let responseUser = `***Thinking.... Await a moment...***`;
                    panel.webview.postMessage({ command: 'chatResponse', text: responseUser, completed: false });
                    const responseText = await chat(message.text, message.model);
                    panel.webview.postMessage({ command: 'chatResponse', text: responseText, completed: true });
                } catch (err) {
                    panel.webview.postMessage({ command: 'chatResponse', text: `Error: ${String(err)}`, completed: true });
                }
                
                break;
            case 'load':
                const response = await models();
                for (const model of response.models) {
                    panel.webview.postMessage({ command: 'modelResponse', text: model.name });
                }
        }
    });
};