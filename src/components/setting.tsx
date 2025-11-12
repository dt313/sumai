import { useEffect, useState } from 'react';

type SettingState = {
    model: string;
    language: string;
    logoVisible: boolean;
    doubleClick: boolean;
    shiftSummarize: boolean;
    summarizeCount: number;
};

const defaultSetting: SettingState = {
    model: 'openai',
    language: 'vi',
    logoVisible: true,
    doubleClick: false,
    shiftSummarize: false,
    summarizeCount: 100,
};

function Setting() {
    const [setting, setSetting] = useState<SettingState>(defaultSetting);

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

    return (
        <div className="p-4 w-full font-sans space-y-4">
            {/* Model select */}
            <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Select Model</label>
                <select
                    value={setting.model}
                    onChange={(e) => handleChange('model', e.target.value)}
                    className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                    <option value="openai">OpenAI</option>
                    <option value="gemini">Gemini</option>
                    <option value="anthropic">Anthropic</option>
                </select>
            </div>

            {/* Language select */}
            <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Native Language (Summarization Text Language) </label>
                <select
                    value={setting.language}
                    onChange={(e) => handleChange('language', e.target.value)}
                    className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                >
                    <option value="en">English</option>
                    <option value="vi">Vietnamese</option>
                    <option value="ko">Korean</option>
                    <option value="ja">Japanese</option>
                </select>
            </div>

            {/* Switches */}
            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={setting.logoVisible}
                    onChange={(e) => handleChange('logoVisible', e.target.checked)}
                    id="logoVisible"
                    className="w-4 h-4"
                />
                <label htmlFor="logoVisible" className="text-sm">
                    Logo Visible
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={setting.doubleClick}
                    onChange={(e) => handleChange('doubleClick', e.target.checked)}
                    id="doubleClick"
                    className="w-4 h-4"
                />
                <label htmlFor="doubleClick" className="text-sm">
                    Double Click to Summarize
                </label>
            </div>

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    checked={setting.shiftSummarize}
                    onChange={(e) => handleChange('shiftSummarize', e.target.checked)}
                    id="shiftSummarize"
                    className="w-4 h-4"
                />
                <label htmlFor="shiftSummarize" className="text-sm">
                    Shift to Summarize
                </label>
            </div>

            {/* Summarize count */}
            <div className="flex flex-col gap-1">
                <label className="font-semibold text-sm">Summarize Text Count</label>
                <input
                    type="number"
                    min={10}
                    max={1000}
                    step={50}
                    value={setting.summarizeCount}
                    onChange={(e) => handleChange('summarizeCount', parseInt(e.target.value))}
                    className="rounded-md border px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
            </div>
        </div>
    );
}

export default Setting;
