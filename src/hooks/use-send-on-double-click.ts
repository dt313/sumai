import { useEffect } from 'react';

export const useSendOnDoubleClick = ({
    isOpenModal,
    handleSend,
    hideButton,
}: {
    isOpenModal: boolean;
    handleSend: ({ text }: { text: string }) => void;
    hideButton: () => void;
}) => {
    useEffect(() => {
        const onDoubleClick = () => {
            const selection = window.getSelection()?.toString().trim();
            if (!selection) return;

            handleSend({ text: selection });
            hideButton();
        };

        document.addEventListener('dblclick', onDoubleClick);
        return () => document.removeEventListener('dblclick', onDoubleClick);
    }, [isOpenModal, handleSend, hideButton]);
};
