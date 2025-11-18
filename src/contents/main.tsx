import contentStyle from 'data-text:./styles/content.css';
import markdownStyle from 'data-text:./styles/markdown.css';
import toolTips from 'data-text:./styles/tooltip.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';

import { TemporarySettingProvider, useTemporarySetting } from '~context/setting-context';
import { useSendOnDoubleClick } from '~hooks/use-send-on-double-click';
import { useSendOnShift } from '~hooks/use-send-on-shift';
import type { ModelType, ModeType, SettingState, SummaryRequestData } from '~types';

import Modal from '../components/content/modal.content';
import SelectionButton from '../components/content/selection-button.content';

import 'highlight.js/styles/github-dark.css';

import { GlobalErrorBoundary } from '~components/global-error-boundary';

export const config: PlasmoCSConfig = {
    matches: ['<all_urls>'],
    run_at: 'document_idle',
};

export const getStyle = () => {
    const style = document.createElement('style');
    style.textContent = contentStyle + toolTips + markdownStyle;
    return style;
};

export type SendParams = {
    text: string;
    model?: ModelType;
    language?: string;
    textCount?: number;
    mode?: ModeType;
};

const ContentUIInner: React.FC = () => {
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [currentText, setCurrentText] = useState<string | null>(null);
    const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);
    const [modalContent, setModalContent] = useState<string | null>(null);
    const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
    const [streaming, setStreaming] = useState(false);
    const { tempSetting, resetTempSetting } = useTemporarySetting();

    const handleSend = async ({ text, model, language, textCount, mode }: SendParams) => {
        setModalContent('');
        setIsOpenModal(true);
        setStreaming(true);
        setButtonPos(null);
        setSelectedText(text);

        const defaultSetting = tempSetting as SettingState;

        const requestData: SummaryRequestData = {
            text,
            model: model || (defaultSetting?.model as ModelType) || 'chatgpt',
            textCount: textCount || Number(defaultSetting?.textCount) || 200,
            language: language || defaultSetting?.language || 'vietnamese',
            mode: mode || defaultSetting?.mode || 'summary',
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

    const hideButton = () => {
        setButtonPos(null);
        setCurrentText(null);
    };

    const handleCloseModal = () => {
        setSelectedText(null);
        setIsOpenModal(false);
        setButtonPos(null);
        resetTempSetting();
    };

    useSendOnShift({
        selectedText,
        isOpenModal,
        handleSend: tempSetting?.isShift ? handleSend : () => {},
        hideButton: hideButton,
    });

    useSendOnDoubleClick({
        isOpenModal,
        handleSend: tempSetting?.isDoubleClick ? handleSend : () => {},
        hideButton: hideButton,
    });

    const handleMouseUp = (e: MouseEvent) => {
        const path = e.composedPath?.(); // path gồm cả shadow DOM
        const isInsideModal = path?.some(
            (el) => el instanceof HTMLElement && (el.classList.contains('plasmo-modal') || el.id === 'plasmo-modal'),
        );

        if (isInsideModal) {
            // selection trong modal → bỏ qua
            return;
        }

        const sel = window.getSelection();
        const text = sel?.toString().trim();
        if (!text) return;

        const anchorNode = sel.anchorNode;
        if (!anchorNode) return;

        // Lấy vị trí selection
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect) return;

        setCurrentText(text);
        setButtonPos({
            x: rect.right + window.scrollX,
            y: rect.bottom + window.scrollY,
        });
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

    const handleRefresh = async ({
        model,
        language,
        textCount,
        mode,
    }: {
        model: ModelType;
        language: string;
        textCount: number;
        mode: ModeType;
    }) => {
        handleSend({ text: selectedText, model, language, textCount, mode });
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div className={`${tempSetting.isDarkTheme ? 'dark' : 'light'} `}>
            {buttonPos && tempSetting?.isLogoVisible && (
                <SelectionButton
                    text={currentText}
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onSend={handleSend}
                    onOutsideClick={hideButton}
                />
            )}

            {/* <SelectionButton
                text={selectedText}
                x={buttonPos.x}
                y={buttonPos.y}
                onSend={handleSend}
                onOutsideClick={hideButton}
            /> */}
            {isOpenModal && (
                <Modal
                    content={modalContent}
                    onClose={handleCloseModal}
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
        </div>
    );
};

const ContentUI: React.FC = () => {
    return (
        <GlobalErrorBoundary>
            <TemporarySettingProvider>
                <ContentUIInner />
            </TemporarySettingProvider>
        </GlobalErrorBoundary>
    );
};

export default ContentUI;
