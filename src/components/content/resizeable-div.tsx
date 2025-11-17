import React, { useEffect, useRef, useState } from 'react';

type Props = {
    children: React.ReactNode;
    minWidth?: number;
    minHeight?: number;
    defaultWidth?: number;
    defaultHeight?: number;
    className?: string;
    divRef?: React.RefObject<HTMLDivElement>;
};

const ResizableDiv: React.FC<Props> = ({
    children,
    minWidth = 300,
    minHeight = 200,
    defaultWidth = 700,
    defaultHeight = 300,
    className = '',
    divRef,
}) => {
    const internalRef = useRef<HTMLDivElement | null>(null);
    const ref = divRef || internalRef;
    const isResizing = useRef(false);
    const [size, setSize] = useState({
        width: defaultWidth,
        height: defaultHeight,
    });

    const handleMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        isResizing.current = true;
    };

    const handleMouseMove = (e: MouseEvent) => {
        if (!isResizing.current || !ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        const newWidth = e.clientX - rect.left;
        const newHeight = e.clientY - rect.top;

        setSize({
            width: Math.max(minWidth, newWidth),
            height: Math.max(minHeight, newHeight),
        });
    };

    const handleMouseUp = (e) => {
        isResizing.current = false;
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    return (
        <div
            ref={ref}
            id="plasmo-modal"
            className={className}
            style={{
                position: 'fixed',
                width: size.width,
                height: size.height,
            }}
        >
            {children}

            {/* Góc kéo resize */}
            <div onMouseDown={handleMouseDown} className="resize-btn" />
        </div>
    );
};

export default ResizableDiv;
