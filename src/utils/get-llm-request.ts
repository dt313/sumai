const DEFAULT_OPENAI_MODEL = 'gpt-5-chat-latest';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const DEFAULT_CLAUDE_MODEL = 'claude-sonnet-4-5-20250929';

// header

export const buildOpenAIHeaders = (key: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
});

export const buildClaudeHeaders = (apiKey: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
    'anthropic-version': '2023-06-01',
});
export const buildGeminiHeaders = (key: string) => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${key}`,
});

type OpenAIBodyParams = {
    model?: string;
    systemPrompt: string;
    userPrompt: string;
    stream?: boolean;
};

export const buildOpenAIBody = ({
    model = DEFAULT_OPENAI_MODEL,
    systemPrompt,
    userPrompt,
    stream = true,
}: OpenAIBodyParams) => ({
    model,
    messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
    ],
    stream,
});

type ClaudeBodyParams = {
    userPrompt: string;
    systemPrompt?: string;
    model?: string;
    maxTokens?: number;
    stream?: boolean;
};

export const buildClaudeBody = ({
    userPrompt,
    systemPrompt,
    model = DEFAULT_CLAUDE_MODEL,
    maxTokens = 1024,
    stream = true,
}: ClaudeBodyParams) => {
    const messages: { role: string; content: string }[] = [];

    messages.push({ role: 'user', content: userPrompt });

    return {
        model,
        system: systemPrompt,
        max_tokens: maxTokens,
        messages,
        stream,
    };
};

type GeminiBodyParams = {
    model?: string;
    systemPrompt?: string;
    userPrompt?: string;
};

export const buildGeminiBody = ({ model = DEFAULT_GEMINI_MODEL, systemPrompt, userPrompt }: GeminiBodyParams) => {
    const contents: { role: string; parts: { text: string }[] }[] = [];

    // if (systemPrompt) {
    //     contents.push({
    //         role: 'system',
    //         parts: [{ text: systemPrompt }],
    //     });
    // }

    if (userPrompt) {
        contents.push({
            role: 'user',
            parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }],
        });
    }

    return {
        model,
        contents,
    };
};
