import type { ApiKeys } from '~types';

import { storage } from './storage';

export const hasAtLeastOneKey = async (): Promise<boolean> => {
    const { apiKeys }: { apiKeys?: ApiKeys } = await storage.get('apiKeys');
    if (!apiKeys) return false;

    return Object.values(apiKeys).some((key) => typeof key === 'string' && key.trim() !== '');
};
