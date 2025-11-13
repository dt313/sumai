import { CHATGPT_API_URL, CLAUDE_API_URL, GEMINI_API_URL, SSU_API_URL } from '~constants';

export const validateOpenAIKey = async (key: string): Promise<boolean> => {
    try {
        const res = await fetch('https://api.openai.com/v1/models', {
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
        });
        if (res?.ok) {
            return true;
        } else {
            const data = await res.json();
            throw data;
        }
    } catch (err) {
        throw err?.error?.message || 'Open Api Key Invalid';
    }
};

export const validateClaudeKey = async (key: string): Promise<boolean> => {
    try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'x-api-key': key,
                'anthropic-version': '2023-06-01',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 1,
                messages: [{ role: 'user', content: 'Test' }],
            }),
        });

        if (res?.ok) {
            return true;
        } else {
            const data = await res.json();
            throw data;
        }
    } catch (error) {
        throw 'Claude API Key Invalid';
    }
};

export const validateGeminiKey = async (key: string): Promise<boolean> => {
    try {
        const res = await fetch(
            'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
            {
                method: 'POST',
                headers: {
                    'x-goog-api-key': key,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [{ text: 'Test' }],
                        },
                    ],
                }),
            },
        );

        if (res?.ok) {
            return true;
        } else {
            const data = await res.json();
            throw data;
        }
    } catch (error) {
        throw error.error.message || 'Gemini API Key Invalid';
    }
};

export const validateSSUKey = async (key: string): Promise<boolean> => {
    try {
        const res = await fetch(`https://factchat-cloud.mindlogic.ai/v1/api/anthropic/messages`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-5-20250929',
                max_tokens: 1024,
                messages: [{ role: 'user', content: 'Test' }],
            }),
        });

        if (res?.ok) {
            return true;
        } else {
            const data = await res.json();
            throw data;
        }
    } catch (error) {
        throw error?.error || error?.detail || 'SSU API Key Invalid ';
    }
};
