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
};

export type SummaryRequestData = {
    text: string;
    model: ModelType;
    responseTextCount: number;
    nativeLanguage: string;
};

export type KeyValidateRequestData = {
    provider: Provider;
    key: string;
};
