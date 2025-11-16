import { useEffect } from 'react';

export const useSendOnDoubleClick = ({
    isOpenModal,
    handleSend,
    hideButton,
}: {
    isOpenModal: boolean;
    handleSend: (text: string) => void;
    hideButton: () => void;
}) => {
    useEffect(() => {
        const onDoubleClick = () => {
            const selection = window.getSelection()?.toString().trim();
            console.log({ selection });
            if (!selection || isOpenModal) return;

            handleSend(selection);
            hideButton();
        };

        document.addEventListener('dblclick', onDoubleClick);
        return () => document.removeEventListener('dblclick', onDoubleClick);
    }, [isOpenModal, handleSend, hideButton]);
};
