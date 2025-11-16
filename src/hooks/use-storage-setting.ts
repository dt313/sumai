import { useEffect, useState } from 'react';

import { storage } from '~utils/storage';

export const useStorageSetting = () => {
    const [setting, setSetting] = useState<{ isShift?: boolean; [key: string]: any }>({});

    useEffect(() => {
        // 1. Hàm lắng nghe khi storage thay đổi
        const handleStorageChange = (changes: any, area: string) => {
            if (area === 'local' && changes.setting) {
                setSetting(changes.setting.newValue || {});
            }
        };

        chrome.storage.onChanged.addListener(handleStorageChange);

        // 2. Load giá trị hiện tại khi mount
        const loadInitialSetting = async () => {
            const { setting: storedSetting } = await storage.get('setting');
            setSetting(storedSetting || {});
        };
        loadInitialSetting();

        // 3. Cleanup khi unmount
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };
    }, []);

    return setting;
};
