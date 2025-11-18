import { useEffect, useState } from 'react';

import { storage } from '~utils/storage';

export type ApiKeys = {
    ssu: string;
    chatgpt: string;
    claude: string;
    gemini: string;
};

const defaultApiKeys: ApiKeys = {
    ssu: '',
    chatgpt: '',
    claude: '',
    gemini: '',
};

export const useStorageApiKeys = () => {
    const [apiKeys, setApiKeys] = useState<ApiKeys>(defaultApiKeys);

    useEffect(() => {
        // Lắng nghe chrome.storage thay đổi
        const handleStorageChange = (changes: any, area: string) => {
            if (area !== 'local' || !changes.apiKeys) return;

            setApiKeys(changes.apiKeys.newValue || defaultApiKeys);
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        // Load giá trị ban đầu
        const loadInitial = async () => {
            const { apiKeys: storedKeys } = await storage.get('apiKeys');
            setApiKeys(storedKeys || defaultApiKeys);
        };
        loadInitial();

        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    // Cập nhật 1 hoặc nhiều keys
    const updateKeys = async (newKeys: Partial<ApiKeys>) => {
        const updated = { ...apiKeys, ...newKeys };
        await storage.set({ apiKeys: updated });
        setApiKeys(updated);
    };

    return { apiKeys, updateKeys };
};
