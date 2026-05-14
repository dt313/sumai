import type { ApiKeys, ModelType, SettingState } from '~types';

export const MODEL_ENDPOINTS: Record<ModelType, string> = {
    chatgpt: 'https://api.openai.com/v1/chat/completions',
    claude: 'https://api.anthropic.com/v1/messages',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:streamGenerateContent?alt=sse',
    olama: 'https://ollama.com/api/generate',
};

export const CHATGPT_LABEL = 'chatgpt';
export const GEMINI_LABEL = 'gemini';
export const CLAUDE_LABEL = 'claude';
export const OLAMA_LABEL = 'olama';
export const TEXT_COUNT_MIN = 50;
export const TEXT_COUNT_MAX = 1000;

export const defaultSetting: SettingState = {
    model: 'chatgpt',
    language: 'english',
    isLogoVisible: true,
    isDoubleClick: false,
    isShift: true,
    textCount: 200,
    isDarkTheme: false,
    mode: 'summary',
};

export const defaultApiKeys: ApiKeys = { chatgpt: '', claude: '', gemini: '', olama: '' };
