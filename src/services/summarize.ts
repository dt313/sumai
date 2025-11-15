import { SSU_API_URL, SSU_MODEL_ENDPOINTS } from '~constants';
import type { ModelType } from '~types';
import {
    buildClaudeBody,
    buildClaudeHeaders,
    buildGeminiBody,
    buildGeminiHeaders,
    buildOpenAIBody,
    buildOpenAIHeaders,
} from '~utils/get-llm-request';

const MODEL_HEADERS: Record<ModelType, (key: string) => Record<string, string>> = {
    chatgpt: buildOpenAIHeaders,
    claude: buildClaudeHeaders,
    gemini: buildGeminiHeaders,
};

type BodyBuilderParams = {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    stream?: boolean;
    maxTokens?: number;
};

export const MODEL_BODY_BUILDERS: Record<ModelType, (params: BodyBuilderParams) => any> = {
    chatgpt: ({ systemPrompt, userPrompt, model, stream }) =>
        buildOpenAIBody({ systemPrompt: systemPrompt, userPrompt, stream }),

    claude: ({ systemPrompt, userPrompt, model, maxTokens }) =>
        buildClaudeBody({ systemPrompt, userPrompt, maxTokens }),

    gemini: ({ systemPrompt, userPrompt, model, stream }) => buildGeminiBody({ systemPrompt, userPrompt }),
};

const generateSummaryPrompt = (
    language: string,
    textCount: number,
    summaryText: string,
): { systemPrompt: string; userPrompt: string } => {
    const systemPrompt =
        `You are a helpful assistant. Only summarize the text. Do NOT add any explanations, opinions, or extra words. Focus solely on the key points.`.trim();

    const userPrompt =
        `Summarize the following text in ${language}, using no more than ${textCount} words. Do NOT add anything extra, only the key points:\n\n${summaryText}`.trim();

    return {
        systemPrompt,
        userPrompt,
    };
};

const handleStreamingResponse = async (
    response: Response,
    model: ModelType,
    onChunk?: (chunk: string) => void,
): Promise<string> => {
    if (!response.body) throw new Error('No response body for streaming');

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let done = false;
    let summary = '';

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (!value) continue;

        const chunkText = decoder.decode(value, { stream: true });

        chunkText.split('\n').forEach((line) => {
            line = line.trim();
            if (!line || !line.startsWith('data:')) return;
            const jsonStr = line.replace(/^data: /, '');
            if (jsonStr === '[DONE]') return;

            try {
                const parsed = JSON.parse(jsonStr);

                switch (model) {
                    case 'chatgpt': {
                        const content = parsed.choices?.[0]?.delta?.content;
                        if (content) {
                            summary += content;
                            if (onChunk) onChunk(content);
                        }
                        break;
                    }
                    case 'gemini': {
                        const parts = parsed.candidates?.[0]?.content?.parts;
                        if (parts && parts.length > 0) {
                            const text = parts.map((p: any) => p.text).join('');
                            summary += text;
                            if (onChunk) onChunk(text);
                        }
                        break;
                    }
                    case 'claude': {
                        const text = parsed.delta?.text;
                        if (text) {
                            summary += text;
                            if (onChunk) onChunk(text);
                        }
                        break;
                    }
                    default:
                        break;
                }
            } catch (err) {
                console.warn(`Error parsing ${model} chunk:`, err);
            }
        });
    }

    return summary;
};

export const summarize = async (
    key: string,
    model: ModelType,
    text: string,
    language: string = 'English',
    textCount: number = 50,
    onChunk?: (chunk: string) => void,
) => {
    const { systemPrompt, userPrompt } = generateSummaryPrompt(language, textCount, text);

    const url = SSU_MODEL_ENDPOINTS[model];

    const headers = MODEL_HEADERS[model](key);
    const body = MODEL_BODY_BUILDERS[model]({
        systemPrompt,
        userPrompt,
        maxTokens: textCount,
    });

    console.log({ headers, body });

    const response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
    });

    return handleStreamingResponse(response, model, onChunk);
};

// export const summarize = async (
//     key: string,
//     model: ModelType = 'chatgpt',
//     text: string,
//     language: string = 'English',
//     textCount: number = 50,
//     onChunk?: (chunk: string) => void,
// ): Promise<string> => {
//     try {
//         const response = await fetch(SSU_API_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 Authorization: `Bearer ${key}`,
//             },
//             body: JSON.stringify({
//                 model: 'gpt-5-chat-latest',
//                 messages: [
//                     { role: 'system', content: systemPrompt },
//                     { role: 'user', content: userPrompt },
//                 ],
//                 stream: true,
//             }),
//         });

//         if (!response.body) throw new Error('No response body for streaming');

//         const reader = response.body.getReader();
//         const decoder = new TextDecoder('utf-8');
//         let done = false;
//         let summary = '';

//         while (!done) {
//             const { value, done: readerDone } = await reader.read();
//             done = readerDone;
//             if (value) {
//                 const chunkText = decoder.decode(value, { stream: true });
//                 // Mỗi chunk có thể là nhiều dòng, parse từng line nếu cần
//                 chunkText.split('\n').forEach((line) => {
//                     line = line.trim();
//                     if (!line || !line.startsWith('data:')) return;
//                     const jsonStr = line.replace(/^data: /, '');
//                     if (jsonStr === '[DONE]') return;
//                     try {
//                         const parsed = JSON.parse(jsonStr);
//                         const content = parsed.choices?.[0]?.delta?.content;
//                         if (content) {
//                             summary += content;
//                             if (onChunk) onChunk(content); // gửi chunk ra callback
//                         }
//                     } catch (err) {
//                         console.warn('Error parsing chunk:', err);
//                     }
//                 });
//             }
//         }

//         return summary;
//     } catch (error) {
//         console.error('Error summarizing:', error);
//         throw error;
//     }
// };
