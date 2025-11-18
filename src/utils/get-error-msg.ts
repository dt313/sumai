import { defaultMaxListeners } from 'events';

const getErrorMessage = (err: any, fallback?: string): string => {
    if (!err) return 'Unknown error';

    // 1) Nếu là string → trả luôn
    if (typeof err === 'string') return err;

    // 2) Nếu là Error object
    if (err instanceof Error) return err.message;

    // 3) OpenAI: { error: { message: "" } }
    if (err?.error?.message) return err.error.message;

    // 4) Claude: { error: { type, message } }
    if (err?.error) return err.error?.message;

    // 5) Gemini: { error: { message } }
    if (err?.message) return err.message;

    // 6) SSU: { detail: "" }
    if (err?.detail) return err.detail.message;

    // 7) Khác → stringify
    try {
        return JSON.stringify(err);
    } catch {
        return fallback || 'Unknown error';
    }
};

export default getErrorMessage;
