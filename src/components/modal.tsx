import React, { useState } from 'react';

import images from '~/assets/images';

type ModalProps = {
    content: string;
    onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ content, onClose }) => {
    const [model, setModel] = useState('openai');
    const [language, setLanguage] = useState('en');
    const [textCount, setTextCount] = useState(100);

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
                                onChange={(e) => setModel(e.target.value)}
                                className="plasmo-select"
                            >
                                <option value="openai">OpenAI</option>
                                <option value="gemini">Gemini</option>
                                <option value="anthropic">Anthropic</option>
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
                                <option value="en">English</option>
                                <option value="vi">Vietnamese</option>
                                <option value="ko">Korean</option>
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

                        <button className="refresh-btn">Refresh</button>
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
