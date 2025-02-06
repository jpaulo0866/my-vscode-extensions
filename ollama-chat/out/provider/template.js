"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateHtml = generateHtml;
exports.generateHtmlLegacy = generateHtmlLegacy;
function generateHtml() {
    return /*html*/ `
    <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Ollama Chat</title>
            <script type="module" src="https://md-block.verou.me/md-block.js"></script>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    display: flex;
                    height: 100vh;
                    width: 100%;
                    overflow: hidden;
                    padding: 0 !important;
                }

                /* Sidebar (Painel Lateral) */
                #sidebar {
                    width: 300px;
                    background: #333;
                    color: white;
                    display: flex;
                    flex-direction: column;
                    padding: 20px;
                    overflow-y: auto;
                }

                /* Header com botão de Nova Conversa */
                #sidebar-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 15px;
                }

                #sidebar-header h2 {
                    font-size: 18px;
                }

                #new-conversation {
                    background-color: #007BFF;
                    color: white;
                    font-size: 14px;
                    padding: 8px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                #new-conversation:hover {
                    background-color: #0056b3;
                }

                /* Seletor de modelo */
                #model-container {
                    margin-bottom: 15px;
                }

                label {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 5px;
                }

                select {
                    width: 100%;
                    font-size: 14px;
                    padding: 8px;
                    border-radius: 5px;
                    border: none;
                    background-color: #555;
                    color: white;
                    cursor: pointer;
                }

                select:hover {
                    background-color: #666;
                }

                /* Estilo das conversas anteriores */
                .conversation {
                    padding: 10px;
                    margin-bottom: 10px;
                    background: #444;
                    border-radius: 5px;
                    cursor: pointer;
                }

                .conversation:hover {
                    background: #555;
                }

                /* Painel Central */
                #main {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    background: white;
                    padding: 20px;
                }

                /* Header do Painel Central */
                #main-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                    border-bottom: 1px solid #ccc;
                }

                #main-header h1 {
                    font-size: 20px;
                    color: #333;
                }

                #install-ollama {
                    font-size: 14px;
                    color: #007BFF;
                    cursor: pointer;
                    text-decoration: none;
                    font-weight: bold;
                }

                #install-ollama:hover {
                    color: #0056b3;
                    text-decoration: underline;
                }

                #chat-container {
                    flex: 1;
                    overflow-y: auto;
                    border-bottom: 1px solid #ccc;
                    padding-bottom: 10px;
                    margin-bottom: 10px;
                }

                .message {
                    background:rgb(255, 255, 255);
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    max-width: 80%;
                }

                .message.user {
                    background: #007BFF;
                    color: white;
                    align-self: flex-end;
                }

                .message.bot {
                    background: #444;
                    color: white;
                    align-self: flex-start;
                }

                /* Input para novas mensagens */
                #message-box {
                    display: flex;
                    gap: 10px;
                }

                #input-message {
                    flex: 1;
                    padding: 10px;
                    font-size: 16px;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                }

                button {
                    background-color: #007BFF;
                    color: white;
                    font-size: 16px;
                    padding: 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #0056b3;
                }
            </style>
        </head>
        <body>
            <!-- Painel Lateral -->
            <div id="sidebar">
                <div id="sidebar-header">
                    <h2>Conversas</h2>
                    <button id="new-conversation">Nova</button>
                </div>

                <!-- Seletor de modelo -->
                <div id="model-container">
                    <label for="model">Selecione o modelo:</label>
                    <select id="model">
                        <option value="">Selecione um modelo...</option>
                    </select>
                </div>

                <div id="conversations"></div>
            </div>

            <!-- Painel Central -->
            <div id="main">
                <header id="main-header">
                    <h1>Ollama Chat</h1>
                    <a id="install-ollama" href="https://ollama.com/" target="_blank">Install Ollama</a>
                </header>

                <!-- Histórico da Conversa -->
                <div id="chat-container"></div>

                <!-- Input para nova mensagem -->
                <div id="message-box">
                    <input type="text" id="input-message" placeholder="Digite sua mensagem..." />
                    <button id="sendBtn">Enviar</button>
                </div>
            </div>

            <script>
                const vscode = acquireVsCodeApi();
				vscode.postMessage({ command: 'load' });
                
                // Função para adicionar uma mensagem ao chat
                function addMessage(text, sender, completed) {
                    const messageContainer = document.getElementById('chat-container');
                    const lastElement = messageContainer.lastElementChild;

                    if (lastElement) {
                        if (lastElement.getAttribute('data-completed') === 'false') {
                            console.log("Removing Element");
                            messageContainer.removeChild(lastElement);
                        }
                    }

                    const messageDiv = document.createElement('div');
                    messageDiv.classList.add('message', sender);
                    messageDiv.innerHTML = '<md-block id="response">'+ text + '</md-block>';
                    messageDiv.setAttribute('data-completed', completed);
                    messageContainer.appendChild(messageDiv);
                    messageContainer.scrollTop = messageContainer.scrollHeight;
                }
		
                // Enviar mensagem ao VSCode
                document.getElementById('sendBtn').addEventListener('click', () => {
                    const input = document.getElementById('input-message');
                    const text = input.value.trim();
                    const model = document.getElementById('model').value;

                    if (text === "" || model === "") {
                        alert("Por favor, selecione um modelo e digite uma mensagem.");
                        return;
                    }

                    addMessage(text, 'user', true);
                    vscode.postMessage({ command: 'chat', text, model });
                    input.value = "";
                });

                // Botão para criar uma nova conversa
                document.getElementById('new-conversation').addEventListener('click', () => {
                    document.getElementById('chat-container').innerHTML = "";
                    vscode.postMessage({ command: 'newConversation' });
                });

                // Receber mensagens do VSCode
                window.addEventListener('message', (event) => {
                    const { command, text, conversations, modelList, completed } = event.data;
                    
                    if (command === 'chatResponse') {
                        addMessage(text, 'bot', completed);
                    }

                    if (command === 'updateConversations' && Array.isArray(conversations)) {
                        const convContainer = document.getElementById('conversations');
                        convContainer.innerHTML = "";
                        conversations.forEach(conv => {
                            const div = document.createElement('div');
                            div.classList.add('conversation');
                            div.innerText = conv;
                            div.onclick = () => vscode.postMessage({ command: 'loadConversation', id: conv });
                            convContainer.appendChild(div);
                        });
                    }

                    if (command === 'updateModels' && Array.isArray(modelList)) {
                        const modelSelect = document.getElementById('model');
                        modelSelect.innerHTML = '<option value="">Selecione um modelo...</option>';
                        modelList.forEach(model => {
                            const option = document.createElement('option');
                            option.value = model;
                            option.text = model;
                            modelSelect.appendChild(option);
                        });
                    }

                    if (command === 'modelResponse') {
						const option = document.createElement('option');
						option.text = text;
						option.value = text;
						document.getElementById('model').add(option);
					}
                });

                // Carregar modelos e conversas ao abrir a interface
                vscode.postMessage({ command: 'loadConversations' });
                vscode.postMessage({ command: 'loadModels' });
            </script>
        </body>
        </html>
    `;
}
function generateHtmlLegacy() {
    return /*html*/ `
		<!DOCTYPE html>
		<html lang="en">
		<head>
			<meta charset="UTF-8">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Ollama Chat</title>
			<script type="module" src="https://md-block.verou.me/md-block.js"></script>
			<style>
				body {
					font-family: Arial, sans-serif;
					background-color: #f4f4f4;
					display: flex;
					flex-direction: column;
					align-items: center;
					justify-content: center;
					height: 100vh;
					width: 100%;
					margin: 0;
					overflow: auto;
				}
		
				#app {
					display: flex;
					flex-direction: column;
					background: white;
					padding: 20px;
					box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
					border-radius: 8px;
				}
		
				label {
					font-weight: bold;
					display: block;
					margin-bottom: 5px;
				}
		
				select {
					width: 60rem;
					font-size: 16px;
					border: 1px solid #ccc;
					border-radius: 5px;
					background-color: white;
					padding: 10px;
					cursor: pointer;
					appearance: none;
					-webkit-appearance: none;
					-moz-appearance: none;
					background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18"><path fill="gray" d="M7 10l5 5 5-5z"/></svg>');
					background-repeat: no-repeat;
					background-position: right 10px center;
					background-size: 16px;
				}
		
				select:hover {
					border-color: #007BFF;
				}
		
				select:focus {
					outline: none;
					border-color: #0056b3;
					box-shadow: 0 0 5px rgba(0, 91, 187, 0.5);
				}
		
				option {
					font-size: 16px;
					background: white;
				}
		
				textarea {
					width: 60rem;
					height: 100px;
					padding: 0px !important;
					resize: vertical;
					border: 1px solid #ccc;
					border-radius: 5px;
					font-size: 16px;
					margin-bottom: 10px;
					overflow: auto;
				}
		
				button {
					width: 60rem;
					background-color: #007BFF;
					color: white;
					font-size: 16px;
					padding: 10px;
					border: none;
					border-radius: 5px;
					cursor: pointer;
					margin-bottom: 20px;
				}
		
				button:hover {
					background-color: #0056b3;
				}
		
				#response {
					width: 100%;
					height: 100%;
				}

				.input-container {
					margin-bottom: 20px;
				}

				.answer {
					max-width: 60rem;
					overflow: auto;
					max-height: 500px;
					border: 1px solid #ccc;
					border-radius: 5px;
					font-size: 16px;
					padding: 20px;
				}

				.input-text {
					padding: 10px;
				}
			</style>
		</head>
		<body>
			<div id="app">
				<div class="input-container">
					<label for="model">Selecione o modelo:</label>
					<select id="model">
						<option value="">Selecione um modelo...</option>
					</select>
				</div>
				
				<div class="input-container">
					<label for="prompt">Digite sua pergunta:</label>
					<textarea id="prompt" class="input-text" placeholder="Escreva aqui sua pergunta..."></textarea>
				</div>

				<button id="askBtn">Enviar</button>
				
				<div class="input-container answer">
					<md-block id="response"></md-block>
				</div>
			</div>
		
			<script>
				const vscode = acquireVsCodeApi();
				vscode.postMessage({ command: 'load' });
		
				document.getElementById('askBtn').addEventListener('click', () => {
					const text = document.getElementById('prompt').value;
					if (text.trim() === "") {
						alert("Por favor, digite uma pergunta antes de enviar.");
						return;
					}
		
					const model = document.getElementById('model').value;
					if (model.trim() === "") {
						alert("Por favor, selecione um modelo antes de enviar.");
						return;
					}
		
					vscode.postMessage({ command: 'chat', text, model });
					document.getElementById('askBtn').disabled = true;
					document.getElementById('askBtn').innerText = 'Aguarde...';
				});
		
				window.addEventListener('message', (event) => {
					const { command, text } = event.data;
					if (command === 'chatResponse') {
						document.getElementById('response').mdContent = text;
						document.getElementById('askBtn').disabled = false;
						document.getElementById('askBtn').innerText = 'Enviar';
					}
		
					if (command === 'modelResponse') {
						const option = document.createElement('option');
						option.text = text;
						option.value = text;
						document.getElementById('model').add(option);
					}

					if (command === 'removeModelResponse') {
						if (text) {
							const doc = document.getElementById(text);
							
							if (doc) {
								doc.remove();
							}
						}
					}
				});
			</script>
		</body>
		</html>
	`;
}
//# sourceMappingURL=template.js.map