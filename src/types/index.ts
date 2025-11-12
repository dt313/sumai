export type BackgroundResponse = {
    ok: boolean;
    data: {
        content?: string;
    };
};

export type ModelType = 'chatgpt' | 'claude' | 'gemini';

export type RequestData = {
    text: string;
    model: ModelType;
    responseTextCount: number;
    nativeLanguage: string;
};
