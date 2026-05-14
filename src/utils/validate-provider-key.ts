import { CHATGPT_LABEL, CLAUDE_LABEL, GEMINI_LABEL, OLAMA_LABEL } from '~constants';
import { validationService } from '~services';
import type { Provider } from '~types';

export const validateProviderKey = async (provider: Provider, key: string): Promise<boolean> => {
    switch (provider) {
        case CHATGPT_LABEL:
            return validationService.validateOpenAIKey(key);
        case CLAUDE_LABEL:
            return validationService.validateClaudeKey(key);
        case GEMINI_LABEL:
            return validationService.validateGeminiKey(key);
        case OLAMA_LABEL:
            return validationService.validateOLAMAKey(key);

        default:
            return false;
    }
};
