import { Copy, PencilLine, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import images from '~/assets/images';
import Selection from '~components/content/selection.content';
import { languageSelection, modelSelection } from '~configs/ui';
import { TEXT_COUNT_MAX, TEXT_COUNT_MIN } from '~constants';
import type { ModelType } from '~types';
import { storage } from '~utils/storage';

import NumberInput from './number-input.content';

type ModalProps = {
    content: string;
    isStreaming: boolean;
    onClose: () => void;
    onRefresh: ({ model, language, textCount }: { model: ModelType; language: string; textCount: number }) => void;
};

const Modal: React.FC<ModalProps> = ({ content, isStreaming, onClose, onRefresh }) => {
    const [model, setModel] = useState<ModelType>('chatgpt');
    const [language, setLanguage] = useState('en');
    const [textCount, setTextCount] = useState(200);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const initState = async () => {
            const { defaultSetting } = await storage.get('defaultSetting');
            setTextCount(defaultSetting?.responseTextCount || 200);
            setLanguage(defaultSetting?.nativeLanguage || 'vietnamese');
            setModel(defaultSetting?.model || 'chatgpt');
        };

        initState();
    }, [storage]);

    const handleRefresh = async () => {
        onRefresh({ model, language, textCount });
    };

    const handleChangeLanguage = useCallback((value) => {
        setLanguage(value);
    }, []);

    const handleChangeModel = useCallback((value) => {
        setModel(value);
    }, []);

    const handleChangeTextCount = useCallback((value) => {
        const clamped = Math.max(TEXT_COUNT_MIN, Math.min(value, TEXT_COUNT_MAX));
        setTextCount(clamped);
    }, []);

    const handleCopy = () => {
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 2000);
    };

    return (
        <>
            <div className="plasmo-overlay"></div>

            <div className="plasmo-modal" onMouseUp={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="plasmo-modal-header">
                    {/* <img src={images.logo} alt="Logo" className="plasmo-modal-logo" /> */}
                    <div className="filter">
                        <div className="filter-item">
                            <Selection value={model} onChange={handleChangeModel} list={modelSelection} />
                        </div>

                        <div className="filter-item">
                            <Selection value={language} onChange={handleChangeLanguage} list={languageSelection} />
                        </div>

                        <div className="filter-item">
                            <NumberInput
                                id="text-count"
                                type="number"
                                value={textCount}
                                onChange={handleChangeTextCount}
                                min={10}
                                max={1000}
                                step={50}
                                className="plasmo-input"
                            />
                        </div>

                        <button className="re-summary-btn" onClick={handleRefresh}>
                            {/* <PencilLine className="pen-icon" size={18} /> */}
                            <img className="re-summary-img" src={images.logo} />
                        </button>
                    </div>

                    <div className="right-side">
                        <CopyToClipboard text={isStreaming || copied ? '' : content} onCopy={handleCopy}>
                            <span className={`icon-wrap ${isStreaming && 'disable'}`}>
                                {!copied ? <Copy className="icon" strokeWidth={2.5} size={18} /> : '✅'}
                            </span>
                        </CopyToClipboard>
                        <span className="icon-wrap" onClick={onClose}>
                            <X className="icon" strokeWidth={2.5} size={18} />
                        </span>
                    </div>
                </div>

                {/* Body content */}
                <div className="plasmo-modal-content">
                    <p>{content}</p>
                </div>
            </div>
        </>
    );
};

export default Modal;
