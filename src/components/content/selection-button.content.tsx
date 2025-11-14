import React, { useEffect, useRef } from 'react';

import images from '~assets/images';

type ButtonProps = {
    text: string;
    x: number;
    y: number;
    onSend: (text: string) => void;
    onOutsideClick: () => void; // callback khi click ngoài
};

const SelectionButton: React.FC<ButtonProps> = ({ text, x, y, onSend, onOutsideClick }) => {
    const btnRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const path = e.composedPath();

            if (!path.includes(btnRef.current)) {
                onOutsideClick();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onOutsideClick]);

    return (
        <button
            ref={btnRef}
            className="selection-btn"
            style={{
                position: 'absolute',
                top: y + 8,
                left: x - 40,
                zIndex: 999999,
                display: 'flex',
            }}
            onClick={(e) => {
                e.stopPropagation();
                onSend(text);
            }}
        >
            <img src={images.logo} className="btn-logo" />
        </button>
    );
};

export default SelectionButton;
