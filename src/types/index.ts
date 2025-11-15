export type BackgroundResponse = {
    ok: boolean;
    data?: any;
    error?: {
        message?: string;
    };
};

export type ModelType = 'chatgpt' | 'claude' | 'gemini';
export type Provider = ModelType | 'ssu';

export type KeyInput = {
    label: string;
    provider: Provider;
    logo: string;
    placeholder?: string;
    link: string;
};

export type SummaryRequestData = {
    text: string;
    model: ModelType;
    textCount: number;
    language: string;
};

export type KeyValidateRequestData = {
    provider: Provider;
    key: string;
};

export type SettingState = {
    model: string;
    language: string;
    isLogoVisible: boolean;
    isDoubleClick: boolean;
    isShift: boolean;
    textCount: number;
};
