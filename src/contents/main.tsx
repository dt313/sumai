import contentStyle from 'data-text:./styles/content.css';
import markdownStyle from 'data-text:./styles/markdown.css';
import toolTips from 'data-text:./styles/tooltip.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';

import { GlobalErrorBoundary } from '~components/global-error-boundary';
import { TemporarySettingProvider, useTemporarySetting } from '~context/setting-context';
import { useSendOnDoubleClick } from '~hooks/use-send-on-double-click';
import { useSendOnShift } from '~hooks/use-send-on-shift';
import type { ModelType, ModeType, SettingState, SummaryRequestData } from '~types';
import getErrorMessage from '~utils/get-error-msg';
import smartPosition from '~utils/smart-position';

import Modal from '../components/content/modal.content';
import SelectionButton from '../components/content/selection-button.content';

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
        if (!text) return;
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
            chrome.runtime.sendMessage({ type: 'ASK_TEXT', data: requestData }, (res: any) => {
                if (!res?.ok) {
                    console.error(res?.error);
                }
                setStreaming(false);
            });
        } catch (e) {
            setStreaming(false);
        } finally {
            hideButton();
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
        selectedText: currentText,
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
        const sel = window.getSelection();
        const text = sel?.toString().trim();

        const path = e.composedPath?.();
        const isInsideModal = path?.some(
            (el) => el instanceof HTMLElement && (el.classList.contains('plasmo-modal') || el.id === 'plasmo-modal'),
        );

        // selection in modal
        if (isInsideModal) {
            return;
        }

        if (!text) {
            chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text: null });
            setCurrentText(null);
            setButtonPos(null);
            return;
        }

        const anchorNode = sel.anchorNode;
        if (!anchorNode) return;
        chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text });
        // selection offset
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        if (!rect) return;

        const pos = smartPosition(rect);

        setCurrentText(text);
        setButtonPos(pos);
    };

    useEffect(() => {
        const chunkListener = (msg: any) => {
            if (msg.type === 'ASK_CHUNK') {
                setModalContent((prev) => prev + msg.chunk.replace(/([^\n])\n([^\n])/g, '$1\n\n$2'));
            }
            // ERRORS
            if (msg.type === 'ASK_ERROR') {
                setModalContent(`❌ Error: ${getErrorMessage(msg.error)}`);
            }
        };

        chrome.runtime.onMessage.addListener(chunkListener);

        return () => {
            chrome.runtime.onMessage.removeListener(chunkListener);
        };
    }, []);

    useEffect(() => {
        const listener = (msg: any) => {
            if (msg.type === 'CLICK_SUMAI_CONTEXT') {
                if (msg.text) {
                    handleSend({ text: msg.text });
                }
            }
        };

        chrome.runtime.onMessage.addListener(listener);

        return () => {
            chrome.runtime.onMessage.removeListener(listener);
        };
    }, [handleSend]);

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

    const handleContextMenu = () => {
        const sel = window.getSelection();
        const text = sel?.toString().trim() || null;
        chrome.runtime.sendMessage({ type: 'TEXT_SELECTED', text });
        if (!text) {
            setCurrentText(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('contextmenu', handleContextMenu);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('contextmenu', handleContextMenu);
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

            {isOpenModal && (
                <Modal
                    content={modalContent}
                    onClose={handleCloseModal}
                    onRefresh={handleRefresh}
                    isStreaming={streaming}
                />
            )}
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
