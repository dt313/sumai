import { useCallback, useEffect, useRef, useState } from 'react';

export const useDraggable = () => {
    const dragRef = useRef<HTMLDivElement | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (!dragRef.current) return;

        const modal = dragRef.current;
        const rect = modal.getBoundingClientRect();

        modal.style.left = `${rect.left}px`;
        modal.style.top = `${rect.top}px`;
        modal.style.transform = 'none';

        offset.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };

        setIsDragging(true);
    };

    const handleMouseMove = useCallback(
        (e: MouseEvent) => {
            if (!isDragging || !dragRef.current) return;

            const modal = dragRef.current;
            const modalWidth = modal.offsetWidth;
            const modalHeight = modal.offsetHeight;

            let newLeft = e.clientX - offset.current.x;
            let newTop = e.clientY - offset.current.y;

            // Giới hạn trong viewport
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - modalWidth));
            newTop = Math.max(0, Math.min(newTop, window.innerHeight - modalHeight));

            modal.style.left = `${newLeft}px`;
            modal.style.top = `${newTop}px`;
        },
        [isDragging],
    );

    const handleMouseUp = useCallback(() => {
        setIsDragging(false);
    }, []);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return { dragRef, handleMouseDown, isDragging };
};
