import ollama from 'ollama';

export const chat = async (text: string, model: string) => {
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
    const streamResponse = await ollama.chat({
        model: model,
        messages: [{role: 'user', content: prompt}],
        stream: true
    });
        
    for await (const part of streamResponse) {
        responseText += part.message.content;
    }

    responseText = responseText.replace(/<think>[\s\S]*?<\/think>\n*/g, '');
    return responseText;
};

export const models = async () => {
    return ollama.list();
};

export const pullModel = async (model: string) => {
    return ollama.pull({model: model, stream: true});
};

export const deleteModel = async (model: string) => {
    return ollama.delete({model: model});
};