import React, { createContext, useContext, useEffect, useState } from 'react';

import { defaultSetting } from '~constants';
import { useStorageSetting } from '~hooks/use-storage-setting';
import type { SettingState } from '~types';

type TemporarySettingContextType = {
    tempSetting: SettingState;
    updateTempSetting: (changes: Partial<SettingState>) => void;
    resetTempSetting: () => void;
};

const TemporarySettingContext = createContext<TemporarySettingContextType | null>(null);

export const TemporarySettingProvider = ({ children }) => {
    const setting = useStorageSetting();
    const [tempSetting, setTempSetting] = useState<SettingState>(setting || defaultSetting);

    useEffect(() => {
        setTempSetting(setting || defaultSetting);
    }, [setting]);

    const updateTempSetting = (changes: Partial<SettingState>) => {
        setTempSetting((prev) => ({ ...prev, ...changes }));
    };

    const resetTempSetting = () => {
        setTempSetting(setting);
    };

    return (
        <TemporarySettingContext.Provider value={{ tempSetting, updateTempSetting, resetTempSetting }}>
            {children}
        </TemporarySettingContext.Provider>
    );
};

export const useTemporarySetting = () => {
    const ctx = useContext(TemporarySettingContext);
    if (!ctx) throw new Error('useTemporarySetting must be used inside TemporarySettingProvider');
    return ctx;
};
