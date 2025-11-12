import React, { useEffect, useState } from 'react';

import images from '~/assets/images';
import type { ModelType, RequestData } from '~types';
import { storage } from '~utils/storage';

type ModalProps = {
    content: string;
    onClose: () => void;
    onRefresh: ({ model, language, textCount }: { model: ModelType; language: string; textCount: number }) => void;
};

const Modal: React.FC<ModalProps> = ({ content, onClose, onRefresh }) => {
    const [model, setModel] = useState<ModelType>('chatgpt');
    const [language, setLanguage] = useState('en');
    const [textCount, setTextCount] = useState(200);

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

    return (
        <>
            <div className="plasmo-overlay" onClick={onClose}></div>

            <div className="plasmo-modal">
                {/* Header */}
                <div className="plasmo-modal-header">
                    <img src={images.openai} alt="Logo" className="plasmo-modal-logo" />

                    <div className="filter">
                        <div className="filter-item">
                            <label htmlFor="model-select">Model:</label>
                            <select
                                id="model-select"
                                value={model}
                                onChange={(e) => setModel(e.target.value as ModelType)}
                                className="plasmo-select"
                            >
                                <option value="chatgpt">OpenAI</option>
                                <option value="gemini">Gemini</option>
                                <option value="claude">Anthropic</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label htmlFor="lang-select">Language:</label>
                            <select
                                id="lang-select"
                                value={language}
                                onChange={(e) => setLanguage(e.target.value)}
                                className="plasmo-select"
                            >
                                <option value="english">English</option>
                                <option value="vietnamese">Vietnamese</option>
                                <option value="korea">Korean</option>
                            </select>
                        </div>

                        <div className="filter-item">
                            <label htmlFor="text-count">Text Count:</label>
                            <input
                                id="text-count"
                                type="number"
                                value={textCount}
                                onChange={(e) => setTextCount(parseInt(e.target.value))}
                                min={10}
                                max={1000}
                                step={50}
                                className="plasmo-input"
                            />
                        </div>

                        <button className="refresh-btn" onClick={handleRefresh}>
                            Refresh
                        </button>
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
