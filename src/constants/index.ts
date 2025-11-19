import type { ApiKeys, ModelType, SettingState } from '~types';

export const SSU_MODEL_ENDPOINTS: Record<ModelType, string> = {
    chatgpt: 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions',
    claude: 'https://factchat-cloud.mindlogic.ai/v1/api/anthropic/messages',
    gemini: 'https://factchat-cloud.mindlogic.ai/v1/api/google/models/generate-content-stream',
};

export const SSU_API_URL = 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions';

export const CHATGPT_API_URL = 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions';
export const GEMINI_API_URL = 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions';
export const CLAUDE_API_URL = 'https://factchat-cloud.mindlogic.ai/v1/api/openai/chat/completions';

export const SSU_LABEL = 'ssu';
export const CHATGPT_LABEL = 'chatgpt';
export const GEMINI_LABEL = 'gemini';
export const CLAUDE_LABEL = 'claude';

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

export const defaultApiKeys: ApiKeys = {
    ssu: '',
    chatgpt: '',
    claude: '',
    gemini: '',
};
