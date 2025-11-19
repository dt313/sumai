import { useEffect, useRef } from 'react';

export const useSendOnShift = ({
    selectedText,
    isOpenModal,

    handleSend,
    hideButton,
}: {
    selectedText: string | null;
    isOpenModal: boolean;

    handleSend: ({ text }: { text: string }) => void;
    hideButton: () => void;
}) => {
    console.log({ selectedText });
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key !== 'Shift' || !selectedText) return;

            handleSend({ text: selectedText });
            hideButton();
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedText, isOpenModal, handleSend, hideButton]);
};
