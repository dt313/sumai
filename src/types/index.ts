export type BackgroundResponse = { ok: boolean; data?: any; error?: { message?: string } };

export type ModelType = 'chatgpt' | 'claude' | 'gemini' | 'olama';
export type ModeType = 'translate' | 'summary' | 'explain';
export type Provider = ModelType | 'olama';

export type KeyInput = { label: string; provider: Provider; logo: string; placeholder?: string; link: string };

export type SummaryRequestData = {
    text: string;
    model: ModelType;
    textCount: number;
    language: string;
    mode: ModeType;
};

export type KeyValidateRequestData = { provider: Provider; key: string };

export type SettingState = {
    model: string;
    language: string;
    isLogoVisible: boolean;
    isDoubleClick: boolean;
    isShift: boolean;
    textCount: number;
    mode: ModeType;
    isDarkTheme: boolean;
};

export type ApiKeys = { chatgpt: string; claude: string; gemini: string; olama: string };
