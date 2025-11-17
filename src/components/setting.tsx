import { useCallback, useEffect, useState } from 'react';

import { languageSelection, modelSelection, modeSelection } from '~configs/ui';
import { defaultSetting, TEXT_COUNT_MAX, TEXT_COUNT_MIN } from '~constants';
import type { SettingState } from '~types';
import { storage } from '~utils/storage';

import NumberInput from './number-input';
import Selection from './selection';
import SwitchButton from './switch-button';

function Setting() {
    const [setting, setSetting] = useState<SettingState>(defaultSetting);

    useEffect(() => {
        const loadSetting = async () => {
            const { setting: defaultSetting } = await storage.get('setting');

            if (defaultSetting) {
                setSetting((prev) => ({ ...prev, ...defaultSetting }));
            }
        };
        loadSetting();
    }, []);

    const update = useCallback(
        async (key: string, value: any) => {
            const newSetting = { ...setting, [key]: value };
            setSetting(newSetting);
            await storage.set({ setting: newSetting });
        },
        [setting],
    );

    const clampTextCount = useCallback(
        (value) => {
            update('textCount', Math.max(TEXT_COUNT_MIN, Math.min(value, TEXT_COUNT_MAX)));
        },
        [update],
    );

    return (
        <div className="w-full font-sans space-y-3">
            {/* Model select */}

            <Selection
                label="Summary Language"
                list={languageSelection}
                value={setting.language}
                onChange={(v) => update('language', v)}
            />
            <Selection label="Mode" list={modeSelection} value={setting.mode} onChange={(v) => update('mode', v)} />
            <Selection label="Model" list={modelSelection} value={setting.model} onChange={(v) => update('model', v)} />

            {/* Summarize count */}
            <div className="flex gap-1 justify-center items-center">
                <NumberInput
                    value={setting.textCount}
                    onChange={clampTextCount}
                    min={TEXT_COUNT_MIN}
                    max={TEXT_COUNT_MAX}
                />
            </div>

            {[
                { id: 'logoVisible', label: 'Logo Visible', key: 'isLogoVisible' },
                { id: 'doubleClick', label: 'Double Click to Summarize', key: 'isDoubleClick' },
                { id: 'shiftSummarize', label: 'Shift to Summarize', key: 'isShift' },
                { id: 'darkTheme', label: 'Dark Theme', key: 'isDarkTheme' },
            ].map(({ id, label, key }) => (
                <div key={id} className="flex items-center gap-2">
                    <label htmlFor={id} className="text-sm font-medium flex-1">
                        {label}
                    </label>
                    <SwitchButton id={id} label={label} checked={setting[key]} onChange={(v) => update(key, v)} />
                </div>
            ))}
        </div>
    );
}

export default Setting;
