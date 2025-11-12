import styles from 'data-text:./content.css';
import type { PlasmoCSConfig } from 'plasmo';
import React, { useEffect, useState } from 'react';

import Modal from '../components/modal';
import SelectionButton from '../components/selection-button';

import './content.css';

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

    const handleMouseUp = () => {
        const selection = window.getSelection()?.toString().trim();
        if (!selection) return;
        const rect = window.getSelection()?.getRangeAt(0).getBoundingClientRect();
        if (!rect) return;

        setSelectedText(selection);
        setButtonPos({ x: rect.right + window.scrollX, y: rect.bottom + window.scrollY });
    };

    const handleSend = (text: string) => {
        chrome.runtime.sendMessage({ type: 'SEND_SELECTED_TEXT', text }, (res: BackgroundResponse) => {
            console.log(res);
            if (res?.ok) setModalContent(res.data?.content || 'No content returned');
        });
        setSelectedText(null); // ẩn button
    };

    useEffect(() => {
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const handleClickOutside = () => {
        setSelectedText(null);
        setButtonPos(null);
    };

    console.log({ modalContent });

    return (
        <>
            {selectedText && buttonPos && (
                <SelectionButton
                    text={selectedText}
                    x={buttonPos.x}
                    y={buttonPos.y}
                    onSend={handleSend}
                    onOutsideClick={handleClickOutside}
                />
            )}
            {modalContent && <Modal content={modalContent || 'Hello anh em'} onClose={() => setModalContent(null)} />}
        </>
    );
};

export default ContentUI;
