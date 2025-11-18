import { Copy, X } from 'lucide-react';
import React, { useCallback, useRef, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import images from '~/assets/images';
import Selection from '~components/content/selection.content';
import { languageSelection, modelSelection, modeSelection } from '~configs/ui';
import { TEXT_COUNT_MAX, TEXT_COUNT_MIN } from '~constants';
import { useTemporarySetting } from '~context/setting-context';
import { useDraggable } from '~hooks/use-draggable';
import type { ModelType, ModeType } from '~types';

import NumberInput from './number-input.content';
import ResizableDiv from './resizeable-div';
import SafeMarkdown from './safe-markdown';
import Tooltip from './tool-tip';

type ModalProps = {
    content: string;
    isStreaming: boolean;
    onClose: () => void;
    onRefresh: ({
        model,
        language,
        textCount,
        mode,
    }: {
        model: ModelType;
        language: string;
        textCount: number;
        mode: ModeType;
    }) => void;
};

const Modal: React.FC<ModalProps> = ({ content, isStreaming, onClose, onRefresh }) => {
    const { tempSetting, updateTempSetting } = useTemporarySetting();
    const [copied, setCopied] = useState(false);
    const copyTimeout = useRef<NodeJS.Timeout | null>(null);
    const { isDragging, dragRef, handleMouseDown } = useDraggable();

    const handleRefresh = useCallback(() => {
        onRefresh({
            model: tempSetting.model as ModelType,
            language: tempSetting.language,
            textCount: tempSetting.textCount,
            mode: tempSetting.mode as ModeType,
        });
    }, [onRefresh, tempSetting]);

    const updateSetting = (key: keyof typeof tempSetting, value: any) => {
        updateTempSetting({ [key]: value });
    };

    const clampTextCount = (value) => {
        updateTempSetting({
            textCount: Math.max(TEXT_COUNT_MIN, Math.min(value, TEXT_COUNT_MAX)),
        });
    };

    const handleCopy = useCallback(
        (_: string, result: boolean) => {
            if (isStreaming || copied || !result) return;
            setCopied(true);
            if (copyTimeout.current) clearTimeout(copyTimeout.current);
            copyTimeout.current = setTimeout(() => setCopied(false), 2000);
        },
        [isStreaming, copied],
    );

    const preventMouseEvent = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <>
            <div className="plasmo-overlay"></div>

            <ResizableDiv className="plasmo-modal" divRef={dragRef}>
                <div
                    className={`modal-body ${isDragging ? 'dragging' : ''}`}

                    // onMouseUp={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="plasmo-modal-header" onMouseDown={handleMouseDown}>
                        {/* <img src={images.logo} alt="Logo" className="plasmo-modal-logo" /> */}
                        <div className="filter">
                            <div className="filter-item" onMouseDown={preventMouseEvent}>
                                <Selection
                                    value={tempSetting.model}
                                    onChange={(v) => updateSetting('model', v)}
                                    list={modelSelection}
                                />
                            </div>

                            <div className="filter-item" onMouseDown={preventMouseEvent}>
                                <Selection
                                    value={tempSetting.language}
                                    onChange={(v) => updateSetting('language', v)}
                                    list={languageSelection}
                                />
                            </div>

                            <div className="filter-item" onMouseDown={preventMouseEvent}>
                                <NumberInput
                                    id="text-count"
                                    value={tempSetting.textCount}
                                    onChange={(v) => clampTextCount(v)}
                                    min={TEXT_COUNT_MIN}
                                    max={TEXT_COUNT_MAX}
                                    step={50}
                                    className="plasmo-input"
                                />
                            </div>

                            <div className="filter-item" onMouseDown={preventMouseEvent}>
                                <Selection
                                    value={tempSetting.mode}
                                    onChange={(v) => updateSetting('mode', v)}
                                    list={modeSelection}
                                />
                            </div>
                            <Tooltip content="Ask">
                                <button
                                    className="re-summary-btn"
                                    onClick={handleRefresh}
                                    data-tooltip-id="summary-tooltip"
                                    data-tooltip-content="Summary"
                                    onMouseDown={preventMouseEvent}
                                    disabled={isStreaming}
                                >
                                    {/* <PencilLine className="pen-icon" size={18} /> */}
                                    <img className="re-summary-img" src={images.bard} />
                                </button>
                            </Tooltip>
                        </div>

                        <div className="right-side">
                            <Tooltip content={copied ? 'Copied' : 'Copy'}>
                                <CopyToClipboard text={isStreaming || copied ? '' : content} onCopy={handleCopy}>
                                    <span
                                        data-tooltip-id="copy-tooltip"
                                        data-tooltip-content="Copy"
                                        className={`icon-wrap ${isStreaming && 'disable'}`}
                                        onMouseDown={preventMouseEvent}
                                    >
                                        {!copied ? <Copy className="icon" strokeWidth={2.5} size={18} /> : '✅'}
                                    </span>
                                </CopyToClipboard>
                            </Tooltip>

                            <Tooltip content="Close">
                                <span
                                    data-tooltip-id="close-tooltip"
                                    data-tooltip-content="Close"
                                    className="icon-wrap"
                                    onClick={onClose}
                                    onMouseDown={preventMouseEvent}
                                >
                                    <X className="icon" strokeWidth={2.5} size={18} />
                                </span>
                            </Tooltip>
                        </div>
                    </div>

                    {/* Body content */}
                    <div className="plasmo-modal-content">
                        <div className="modal-content-wrap">
                            {!content ? (
                                <div className="modal-loading">
                                    <img className="modal-loading-img" src={images.loading} />
                                </div>
                            ) : (
                                <SafeMarkdown content={content} />
                            )}
                        </div>
                    </div>
                </div>
            </ResizableDiv>
        </>
    );
};

export default Modal;
