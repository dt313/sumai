import { ChevronDown, ChevronUp } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { languageSelection, modelSelection } from '~configs/ui';
import { TEXT_COUNT_MAX, TEXT_COUNT_MIN } from '~constants';

import NumberInput from './number-input';
import Selection from './selection';
import SwitchButton from './switch-button';

type SettingState = {
    model: string;
    language: string;
    logoVisible: boolean;
    doubleClick: boolean;
    shiftSummarize: boolean;
    summarizeCount: number;
};

const defaultSetting: SettingState = {
    model: 'chatgpt',
    language: 'vietnamese',
    logoVisible: true,
    doubleClick: false,
    shiftSummarize: false,
    summarizeCount: 100,
};

function Setting() {
    const [setting, setSetting] = useState<SettingState>(defaultSetting);
    const [model, setModel] = useState(defaultSetting?.model || 'chatgpt');
    const [language, setLanguage] = useState(defaultSetting?.language || 'vietnamese');
    const [textCount, setTextCount] = useState(defaultSetting?.summarizeCount || 200);
    const [isDoubleClick, setIsDoubleClick] = useState(false);
    const [isLogoVisible, setIsLogoVisible] = useState(false);
    const [isShift, setIsShift] = useState(false);

    // Load from chrome.storage on mount
    useEffect(() => {
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            chrome.storage.local.get(['userSetting'], (result) => {
                if (result.userSetting) setSetting(result.userSetting);
            });
        }
    }, []);

    // Save setting to chrome.storage
    const saveSetting = (newSetting: SettingState) => {
        setSetting(newSetting);
        if (typeof chrome !== 'undefined' && chrome.storage?.local) {
            chrome.storage.local.set({ userSetting: newSetting });
        }
    };

    const handleChange = (key: keyof SettingState, value: any) => {
        saveSetting({ ...setting, [key]: value });
    };

    const handleChangeModel = useCallback((value) => {
        setModel(value);
    }, []);

    const handleChangeLanguage = useCallback((value) => {
        setLanguage(value);
    }, []);

    const toggleDouble = useCallback(() => {
        setIsDoubleClick(!isDoubleClick);
    }, []);

    const toggleLogoVisible = useCallback(() => {
        setIsLogoVisible(!isLogoVisible);
    }, []);

    const toggleShift = useCallback(() => {
        setIsShift(!isShift);
    }, []);

    const handleChangeTextCount = useCallback((value) => {
        const clamped = Math.max(TEXT_COUNT_MIN, Math.min(value, TEXT_COUNT_MAX));
        setTextCount(clamped);
    }, []);

    return (
        <div className="w-full font-sans space-y-3">
            {/* Model select */}

            <Selection
                label={'Summary Language'}
                list={languageSelection}
                value={language}
                onChange={handleChangeLanguage}
            />
            <Selection label={'Model'} list={modelSelection} value={model} onChange={handleChangeModel} />

            {/* Summarize count */}
            <div className="flex gap-1 justify-center items-center">
                <NumberInput
                    value={textCount}
                    onChange={handleChangeTextCount}
                    min={TEXT_COUNT_MIN}
                    max={TEXT_COUNT_MAX}
                />
            </div>

            {/* Switches */}
            <div className="flex items-center gap-2">
                <label htmlFor="logoVisible" className="text-sm font-medium flex-1">
                    Logo Visible
                </label>
                <SwitchButton
                    checked={isLogoVisible}
                    onChange={toggleLogoVisible}
                    label="Logo Visibility"
                    id="logoVisible"
                />
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="doubleClick" className="text-sm font-medium flex-1">
                    Double Click to Summarize
                </label>
                <SwitchButton
                    checked={isDoubleClick}
                    onChange={toggleDouble}
                    label="Double Click to Summarize"
                    id="doubleClick"
                />
            </div>

            <div className="flex items-center gap-2">
                <label htmlFor="shiftSummarize" className="text-sm font-medium flex-1">
                    Shift to Summarize
                </label>

                <SwitchButton checked={isShift} onChange={toggleShift} label="Shift to Summarize" id="shiftSummarize" />
            </div>
        </div>
    );
}

export default Setting;
