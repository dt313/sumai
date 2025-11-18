import React, { useCallback, useEffect, useRef } from 'react';

import images from '~assets/images';
import type { SendParams } from '~contents/main';
import { useTemporarySetting } from '~context/setting-context';
import type { ModelType, ModeType } from '~types';
import { hasAtLeastOneKey } from '~utils/check-key';

import Tooltip from './tool-tip';

type ButtonProps = {
    text: string;
    x: number;
    y: number;
    onSend: ({ text, mode, model, textCount, language }: SendParams) => void;
    onOutsideClick: () => void; // callback khi click ngoài
};

const SelectionButton: React.FC<ButtonProps> = ({ text, x, y, onSend, onOutsideClick }) => {
    const wrapRef = useRef<HTMLDivElement>(null);
    const { tempSetting, updateTempSetting } = useTemporarySetting();
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const path = e.composedPath();

            if (!path.includes(wrapRef.current)) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onOutsideClick]);

    const handleSend = useCallback(
        async (e, mode: ModeType) => {
            const hasKey = await hasAtLeastOneKey();
            if (!hasKey) {
                chrome.runtime.sendMessage({ type: 'OPEN_OPTIONS_PAGE' });
                return;
            }

            e.stopPropagation();
            updateTempSetting({ mode });

            onSend({
                text,
                mode,
                model: tempSetting.model as ModelType,
                textCount: tempSetting.textCount,
                language: tempSetting.language,
            });
        },
        [onSend, tempSetting.model, tempSetting.textCount, tempSetting.language, updateTempSetting],
    );

    return (
        <div
            className="selection-btn-wrap"
            ref={wrapRef}
            style={{
                position: 'absolute',
                top: y + 8,
                left: x - 40,
                zIndex: 999999,
                display: 'flex',
            }}
        >
            <Tooltip content="Translate">
                <button className="selection-btn" onClick={(e) => handleSend(e, 'translate')}>
                    <img src={images.earth} className="btn-logo" />
                </button>
            </Tooltip>
            <Tooltip content="Summary">
                <button className="selection-btn" onClick={(e) => handleSend(e, 'summary')}>
                    <img src={images.summary} className="btn-logo" />
                </button>
            </Tooltip>
            <Tooltip content="Explain">
                <button className="selection-btn" onClick={(e) => handleSend(e, 'explain')}>
                    <img src={images.bulb} className="btn-logo" />
                </button>
            </Tooltip>
        </div>
    );
};

export default SelectionButton;
