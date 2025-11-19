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
        const onDoubleClick = (e: MouseEvent) => {
            if (isOpenModal) {
                const path = e.composedPath?.();
                const isInsideModal = path?.some(
                    (el) =>
                        el instanceof HTMLElement &&
                        (el.classList.contains('plasmo-modal') || el.id === 'plasmo-modal'),
                );

                // selection in modal
                if (isInsideModal) {
                    return;
                }
            }
            const selection = window.getSelection()?.toString().trim();
            if (!selection) return;

            handleSend({ text: selection });
            hideButton();
        };

        document.addEventListener('dblclick', onDoubleClick);
        return () => document.removeEventListener('dblclick', onDoubleClick);
    }, [isOpenModal, handleSend, hideButton]);
};
