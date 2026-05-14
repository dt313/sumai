import getErrorMessage from '~utils/get-error-msg';

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
        throw getErrorMessage(err);
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
        throw getErrorMessage(error || 'Validate claude key error');
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
        throw getErrorMessage(error?.error || 'Validate gemini key error');
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
        throw getErrorMessage(error?.error || error?.detail, 'Validation ssu key error');
    }
};

export const validateOLAMAKey = async (key: string): Promise<boolean> => {
    try {
        const res = await fetch('https://ollama.com/api/generate', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${key}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gpt-oss:120b',
                prompt: 'Test',
                stream: false,
            }),
        });

        if (res?.ok) {
            return true;
        } else {
            const data = await res.json();
            throw data;
        }
    } catch (error) {
        throw getErrorMessage(error.message || error?.error || error?.detail, 'Validation olama key error');
    }
};
