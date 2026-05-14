import { MODEL_ENDPOINTS } from '~constants';
import type { ModelType, ModeType } from '~types';
import getErrorMessage from '~utils/get-error-msg';
import {
    buildClaudeBody,
    buildClaudeHeaders,
    buildGeminiBody,
    buildGeminiHeaders,
    buildOLAMABody,
    buildOLAMAHeaders,
    buildOpenAIBody,
    buildOpenAIHeaders,
} from '~utils/get-llm-request';

const MODEL_HEADERS: Record<ModelType, (key: string) => Record<string, string>> = {
    chatgpt: buildOpenAIHeaders,
    claude: buildClaudeHeaders,
    gemini: buildGeminiHeaders,
    olama: buildOLAMAHeaders,
};

type BodyBuilderParams = {
    systemPrompt: string;
    userPrompt: string;
    model?: string;
    stream?: boolean;
    maxTokens?: number;
};

export const MODEL_BODY_BUILDERS: Record<ModelType, (params: BodyBuilderParams) => any> = {
    chatgpt: ({ systemPrompt, userPrompt, stream }) => buildOpenAIBody({ systemPrompt, userPrompt, stream }),
    claude: ({ systemPrompt, userPrompt, maxTokens }) => buildClaudeBody({ systemPrompt, userPrompt, maxTokens }),
    gemini: ({ systemPrompt, userPrompt }) => buildGeminiBody({ systemPrompt, userPrompt }),
    olama: ({ systemPrompt, userPrompt, stream }) => buildOLAMABody({ systemPrompt, userPrompt, stream }),
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
            systemPrompt = `You are a professional summarizer. 
                            Create a concise, thorough, and comprehensive summary of the provided text.
                            Focus strictly on the main ideas and essential information.
                            Do NOT include opinions, explanations, or any extra content.
                            Format the summary in clear paragraph form.
                            Do NOT exceed ${textCount} words.
                            Response markdown format.`;

            userPrompt = `Summarize the following text in ${language} using **no more than ${textCount} words**.  
                            Include all key points and critical information, eliminating any unnecessary details.  
                            Rely solely on the provided text and do not introduce external knowledge.  
                            Ensure the summary is coherent, well-structured, and easy to read. 
                            Response markdown format.
                             Do NOT exceed ${textCount} words.
                            Text to summarize:\n\n${text}`;
            break;

        case 'translate':
            systemPrompt = `You are a professional translator. Accurately translate the text into the target language specified by the user without adding, omitting, or altering the meaning. Do NOT include explanations or extra content.`;

            userPrompt = `Translate the following text into (${language}) language according to these rules:

            1. If the text is a single word or short phrase (vocabulary), respond in **Markdown bullet format** like this:

            - ### Word:  <span style="font-weight:300;"><original word/phrase></span>
            - ### Meanings:  <span style="font-weight:300;"><original word/phrase></span>
            - **Part of Speech:** <noun, verb, adjective, etc.>
            - **Example:** <short usage example in original language>

            2. If the text is a complete sentence or paragraph, respond with the fully translated text only in paragraph form, in ${language}, preserving clarity, grammar, and natural flow.

            Text to translate:\n\n${text}`;
            break;

        case 'explain':
            systemPrompt = `You are a professional teaching assistant and language explainer.  
                     Your task is to explain the provided text in a clear, simple, and beginner-friendly way.  
                     Focus strictly on the content given. Do NOT add unrelated information, opinions, or external knowledge.  
                     Use examples or analogies if they help clarify the concepts.  
                     Format the explanation in **Markdown**, using paragraphs, bullets, or numbered lists when appropriate.
                    Do NOT exceed ${textCount} words.
                     `;

            userPrompt = `Explain the following text in ${language}, using no more than ${textCount} words:

            - Provide a simple and clear explanation suitable for beginners.  
            - Break down complex concepts into easy-to-understand points.  
            - Use bullets or numbered lists if needed to organize ideas.  
            - Include short examples or analogies if helpful.  
            - Conclude clearly so the reader understands the main ideas.
            -  Do NOT exceed ${textCount} words.

            Text to explain:\n\n${text}`;
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
    let buffer = '';

    while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (!value) continue;

        const chunkText = decoder.decode(value, { stream: true });

        if (model === 'olama') {
            buffer += chunkText;
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
                if (!line.trim()) continue;
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.response) {
                        summary += parsed.response;
                        if (onChunk) onChunk(parsed.response);
                    }
                    if (parsed.done) done = true;
                } catch (err) {
                    console.error('Ollama parse error:', err);
                }
            }
        } else {
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
                    console.error('SSE parse error:', err);
                }
            });
        }
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

    const url = MODEL_ENDPOINTS[model];
    const headers = MODEL_HEADERS[model](key);
    const body = MODEL_BODY_BUILDERS[model]({
        systemPrompt,
        userPrompt,
        maxTokens: textCount,
        stream: true,
    });

    try {
        const response = await fetch(url, { method: 'POST', headers, body: JSON.stringify(body) });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(`${getErrorMessage(err, 'Request Error')}`);
        }
        return await handleStreamingResponse(response, model, onChunk);
    } catch (error) {
        throw new Error(`${getErrorMessage(error, 'Ask LLM error')}`);
    }
};
