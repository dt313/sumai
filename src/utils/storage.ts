import browser from 'webextension-polyfill';

type StorageType = {
    get: (key: string) => Promise<Record<string, any>>;
    set: (data: Record<string, any>) => Promise<void>;
    remove: (key: string) => Promise<void>;
};

export const storage: StorageType = (() => {
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        // Chrome / Edge
        return {
            get: (key) => new Promise((resolve) => chrome.storage.local.get(key, resolve)),
            set: (data) => new Promise((resolve) => chrome.storage.local.set(data, resolve)),
            remove: (key) => new Promise((resolve) => chrome.storage.local.remove(key, resolve)),
        };
    } else if (typeof browser !== 'undefined' && browser.storage?.local) {
        // Firefox / Safari
        return {
            get: (key) => browser.storage.local.get(key),
            set: (data) => browser.storage.local.set(data),
            remove: (key) => browser.storage.local.remove(key),
        };
    } else {
        // Fallback dev mode (không phải trình duyệt extension)
        const memory: Record<string, any> = {};
        return {
            get: async (key) => ({ [key]: memory[key] }),
            set: async (data) => Object.assign(memory, data),
            remove: async (key) => delete memory[key],
        };
    }
})();
