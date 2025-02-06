import * as vscode from 'vscode';
import { addModelFunction, openModelPanel, removeOllamaModel } from './service/command.service';

export function activate(context: vscode.ExtensionContext) {
	const chat = vscode.commands.registerCommand('ollama-chat.chat', openModelPanel);
	const addModel = vscode.commands.registerCommand('ollama-chat.add-model', addModelFunction);
	const removeModel = vscode.commands.registerCommand('ollama-chat.remove-model', removeOllamaModel);

	context.subscriptions.push(chat);
	context.subscriptions.push(addModel);
	context.subscriptions.push(removeModel);
}

export function deactivate() {}

