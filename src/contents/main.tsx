import styles from 'data-text:./content.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';

import Modal from '../components/content/modal.content';
import SelectionButton from '../components/content/selection-button.content';

import './content.css';

import type { ModelType, SummaryRequestData } from '~types';
import { storage } from '~utils/storage';

export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    run_at: 'document_idle',
};

export const getStyle = () => {
    const style = document.createElement('style');
    style.textContent = styles;
    return style;
};

const ContentUI: React.FC = () => {
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [streaming, setStreaming] = useState(false);

    const handleMouseUp = () => {
        const selection = window.getSelection()?.toString().trim();
        if (!selection) return;
        const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
        if (!rect) return;

        setSelectedText(selection);
        setButtonPos({ x: rect.right + window.scrollX, y: rect.bottom + window.scrollY });
    };

    const handleSend = async (text: string, model?: ModelType, language?: string, textCount?: number) => {
        setModalContent('');
        setStreaming(true);
        const { defaultSetting } = await storage.get('defaultSetting');

        const requestData: SummaryRequestData = {
            text,
            model: model || defaultSetting?.model || 'chatgpt',
            responseTextCount: textCount || Number(defaultSetting?.responseTextCount) || 200,
            nativeLanguage: language || defaultSetting?.nativeLanguage || 'vietnamese',
        };

        const chunkListener = (msg: any) => {
            if (msg.type === 'SUMMARY_CHUNK') {
                setModalContent((prev) => prev + msg.chunk);
            }
        };

        chrome.runtime.onMessage.addListener(chunkListener);

        // Gửi text tới background
        chrome.runtime.sendMessage({ type: 'SEND_SELECTED_TEXT', data: requestData }, (res: any) => {
            if (!res?.ok) {
                console.error(res?.error);
            }
            setStreaming(false);
            chrome.runtime.onMessage.removeListener(chunkListener);
        });
    };

    const handleRefresh = async ({
        model,
        language,
        textCount,
    }: {
        model: ModelType;
        language: string;
        textCount: number;
    }) => {
        console.log({ selectedText });
        handleSend(selectedText, model, language, textCount);
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleClickOutside = () => {
        setButtonPos(null);
    };

    return (
        <>
            {buttonPos && (
                <SelectionButton
                    text={selectedText}
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onSend={handleSend}
                    onOutsideClick={handleClickOutside}
                />
            )}
            {/* {modalContent && ( */}
            <Modal content={modalContent} onClose={() => setModalContent(null)} onRefresh={handleRefresh} />
            {/* )} */}
        </>
    );
};

export default ContentUI;
