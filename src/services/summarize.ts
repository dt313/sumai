import type { ModelType } from '~types';

const OPENAI_API_URL = 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions';

export const summarize = async (
    key: string,
    model: ModelType = 'chatgpt',
    text: string,
    language: string = 'English',
    textCount: number = 50,
    onChunk?: (chunk: string) => void, // callback nhận từng chunk text
): Promise<string> => {
    const systemPrompt = `You are a helpful assistant. 
Only summarize the text. Do NOT add any explanations, opinions, or extra words. 
Focus solely on the key points.`;

    const userPrompt = `Summarize the following text in ${language}, using no more than ${textCount} words. 
Do NOT add anything extra, only the key points:\n\n${text}`;

    try {
        const response = await fetch(OPENAI_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${key}`,
            },
            body: JSON.stringify({
                model: 'gpt-5-chat-latest',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                stream: true,
            }),
        });

        if (!response.body) throw new Error('No response body for streaming');

        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
        let done = false;
        let summary = '';

        while (!done) {
            const { value, done: readerDone } = await reader.read();
            done = readerDone;
            if (value) {
                const chunkText = decoder.decode(value, { stream: true });
                // Mỗi chunk có thể là nhiều dòng, parse từng line nếu cần
                chunkText.split('\n').forEach((line) => {
                    line = line.trim();
                    if (!line || !line.startsWith('data:')) return;
                    const jsonStr = line.replace(/^data: /, '');
                    if (jsonStr === '[DONE]') return;
                    try {
                        const parsed = JSON.parse(jsonStr);
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            summary += content;
                            if (onChunk) onChunk(content); // gửi chunk ra callback
                        }
                    } catch (err) {
                        console.warn('Error parsing chunk:', err);
                    }
                });
            }
        }

        return summary;
    } catch (error) {
        console.error('Error summarizing:', error);
        throw error;
    }
};
