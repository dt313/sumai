import { SSU_API_URL, SSU_MODEL_ENDPOINTS } from '~constants';
import type { ModelType, ModeType } from '~types';
import getErrorMessage from '~utils/get-error-msg';
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

const generatePrompt = (
    language: string,
    textCount: number,
    text: string,
    mode: ModeType,
): { systemPrompt: string; userPrompt: string } => {
    let systemPrompt = '';
    let userPrompt = '';

    switch (mode) {
        case 'summary':
            systemPrompt = `You are a helpful assistant. Only summarize the text. Do NOT add explanations, opinions, or extra content. Focus strictly on key points.`;
            userPrompt = `Summarize the following text in ${language} using no more than ${textCount} words. Only include key points:\n\n${text}`;
            break;

        case 'translate':
            systemPrompt = `You are a helpful assistant. Your task is to translate the text accurately without adding or removing meaning. No explanations.`;
            userPrompt = `Translate the following text into ${language}:\n\n${text}`;
            break;

        case 'explain':
            systemPrompt = `You are a helpful assistant. Explain the text in a simple and clear way suitable for beginners. Do NOT add unrelated information.`;
            userPrompt = `Explain the following text in ${language}, using no more than ${textCount} words:\n\n${text}`;
            break;
    }

    return { systemPrompt, userPrompt };
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
                throw getErrorMessage(err);
            }
        });
    }

    return summary;
};

export const ask = async (
    key: string,
    model: ModelType,
    text: string,
    language: string = 'English',
    textCount: number = 50,
    mode: ModeType = 'summary',
    onChunk?: (chunk: string) => void,
) => {
    const { systemPrompt, userPrompt } = generatePrompt(language, textCount, text, mode);

    const url = SSU_MODEL_ENDPOINTS[model];

    const headers = MODEL_HEADERS[model](key);
    const body = MODEL_BODY_BUILDERS[model]({
        systemPrompt,
        userPrompt,
        maxTokens: textCount,
    });

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`${getErrorMessage(err, 'Request Error')}`);
        }
        await handleStreamingResponse(response, model, onChunk);
    } catch (error) {
        throw new Error(`${getErrorMessage(error, 'Ask LLM error')}`);
    }
};
