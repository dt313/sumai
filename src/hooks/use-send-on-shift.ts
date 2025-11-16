import { useEffect } from 'react';

export const useSendOnShift = ({
    selectedText,
    isOpenModal,
    handleSend,
    hideButton,
}: {
    selectedText: string | null;
    isOpenModal: boolean;
    handleSend: (text: string) => void;
    hideButton: () => void;
}) => {
    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Shift' && selectedText && !isOpenModal) {
                handleSend(selectedText);
            }
        };

        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    }, [selectedText, isOpenModal, handleSend, hideButton]);
};
