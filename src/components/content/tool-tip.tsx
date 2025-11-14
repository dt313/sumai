import React, { useState } from 'react';
import type { ReactNode } from 'react';

type TooltipProps = {
    content: ReactNode; // nội dung tooltip
    children: ReactNode; // element cần hover
    position?: 'top' | 'bottom' | 'left' | 'right'; // vị trí tooltip
};

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div className="tooltip-wrapper" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
            {children}
            {visible && <div className={`tooltip-box tooltip-${position}`}>{content}</div>}
        </div>
    );
};

export default Tooltip;
