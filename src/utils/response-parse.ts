interface StreamParser {
    parseChunk: (raw: string) => string | null;
}

// ---- OpenAI / ChatGPT ----
const openAIParser: StreamParser = {
    parseChunk(raw) {
        try {
            const json = JSON.parse(raw);
            return json.choices?.[0]?.delta?.content || null;
        } catch {
            return null;
        }
    },
};

// ---- Claude ----
const claudeParser: StreamParser = {
    parseChunk(raw) {
        try {
            const json = JSON.parse(raw);
            return json.delta?.text || null;
        } catch {
            return null;
        }
    },
};

// ---- Gemini ----
const geminiParser: StreamParser = {
    parseChunk(raw) {
        try {
            const json = JSON.parse(raw);
            return json.candidates?.[0]?.content?.parts?.[0]?.text || null;
        } catch {
            return null;
        }
    },
};
