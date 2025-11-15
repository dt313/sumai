import contentStyle from 'data-text:./styles/content.css';
import toolTips from 'data-text:./styles/tooltip.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';

// import './styles/content.css';
// import './styles/tooltip.css';

import type { ModelType, SettingState, SummaryRequestData } from '~types';
import { storage } from '~utils/storage';

import Modal from '../components/content/modal.content';
import SelectionButton from '../components/content/selection-button.content';

export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    run_at: 'document_idle',
};

export const getStyle = () => {
    const style = document.createElement('style');
    style.textContent = contentStyle + toolTips;
    return style;
};

const ContentUI: React.FC = () => {
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [streaming, setStreaming] = useState(false);

    const handleMouseUp = () => {
        const selection = window.getSelection()?.toString().trim();
        if (!selection) return;
        const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
        if (!rect) return;

        setSelectedText(selection);
        setButtonPos({ x: rect.right + window.scrollX, y: rect.bottom + window.scrollY });
    };

    useEffect(() => {
        const chunkListener = (msg: any) => {
            if (msg.type === 'SUMMARY_CHUNK') {
                setModalContent((prev) => prev + msg.chunk.replace(/([^\n])\n([^\n])/g, '$1\n\n$2'));
            }
        };

        chrome.runtime.onMessage.addListener(chunkListener);

        return () => {
            chrome.runtime.onMessage.removeListener(chunkListener);
        };
    }, []);

    const handleSend = async (text: string, model?: ModelType, language?: string, textCount?: number) => {
        setModalContent('');
        setIsOpenModal(true);
        setStreaming(true);

        const defaultSetting = (await storage.get('setting')).setting as SettingState;

        const requestData: SummaryRequestData = {
            text,
            model: model || (defaultSetting?.model as ModelType) || 'chatgpt',
            textCount: textCount || Number(defaultSetting?.textCount) || 200,
            language: language || defaultSetting?.language || 'vietnamese',
        };

        try {
            chrome.runtime.sendMessage({ type: 'SEND_SELECTED_TEXT', data: requestData }, (res: any) => {
                if (!res?.ok) console.error(res?.error);
                setStreaming(false);
            });
        } catch (e) {
            console.warn('Cannot send message:', e);
            setStreaming(false);
        }
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
            {isOpenModal && (
                <Modal
                    content={modalContent}
                    onClose={() => setIsOpenModal(false)}
                    onRefresh={handleRefresh}
                    isStreaming={streaming}
                />
            )}

            {/* <Modal
                content={modalContent}
                onClose={() => setIsOpenModal(false)}
                onRefresh={handleRefresh}
                isStreaming={streaming}
            /> */}
        </>
    );
};

export default ContentUI;
