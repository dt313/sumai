import { Copy, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

import images from '~/assets/images';
import Selection from '~components/content/selection.content';
import SpinLoading from '~components/spin-loading';
import { languageSelection, modelSelection } from '~configs/ui';
import { TEXT_COUNT_MAX, TEXT_COUNT_MIN } from '~constants';
import type { ModelType } from '~types';
import { storage } from '~utils/storage';

import NumberInput from './number-input.content';
import Tooltip from './tool-tip';

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

    const handleCopy = (text, result) => {
        if (isStreaming || copied) return;
        if (result) {
            setCopied(true);
            setTimeout(() => {
                setCopied(false);
            }, 2000);
        }
    };

    console.log(content);

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
                        <Tooltip content="Summary">
                            <button
                                className="re-summary-btn"
                                onClick={handleRefresh}
                                data-tooltip-id="summary-tooltip"
                                data-tooltip-content="Summary"
                            >
                                {/* <PencilLine className="pen-icon" size={18} /> */}
                                <img className="re-summary-img" src={images.logo} />
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
                            >
                                <X className="icon" strokeWidth={2.5} size={18} />
                            </span>
                        </Tooltip>
                    </div>
                </div>

                {/* Body content */}
                <div className="plasmo-modal-content">
                    {!content ? (
                        <div className="modal-loading">
                            <img className="modal-loading-img" src={images.loading} />
                        </div>
                    ) : (
                        <div className="markdown-body">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Modal;
