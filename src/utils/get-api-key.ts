import type { ModelType } from '~types';

import { storage } from './storage';

export const getApiKey = async (modal: ModelType) => {
    const { apiKeys } = await storage.get('apiKeys');
    const originalKey = apiKeys[modal];

    const olamaKey = apiKeys['olama'];

    return originalKey || olamaKey;
};
