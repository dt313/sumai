import { CheckIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import images from '~assets/images';

type OptionItem = {
    label: string;
    value: string;
    image?: string;
};

export default function Selection({
    label,
    list = [],
    value,
    onChange,
}: {
    label?: string;
    list: OptionItem[];
    value: string;
    onChange: (val: string) => void;
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    const selected = list.find((i) => i.value === value);

    const toggle = () => {
        setOpen(!open);
    };

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div className="selection-container" ref={ref}>
            {label && <span className="selection-label">{label}</span>}

            <div
                className={`selection-button ${open ? 'open' : ''}`}
                onClick={toggle}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="selected-button">
                    {selected?.image && <img src={selected.image} className="selection-selected-img" alt="" />}
                    <span className="selected-label">{selected?.label}</span>
                </div>

                <svg className="selection-chevron" viewBox="0 0 20 20">
                    <path d="M5 7l5 5 5-5" stroke="gray" strokeWidth="2" fill="none" />
                </svg>
            </div>

            {open && (
                <div className="selection-options" onMouseDown={(e) => e.stopPropagation()}>
                    {list.map((item) => (
                        <div
                            key={item.value}
                            className="selection-option"
                            onClick={(e) => {
                                onChange(item.value);
                                setOpen(false);
                            }}
                        >
                            {item.image && <img src={item.image} alt="" />}

                            <span>{item.label}</span>

                            {item.value === value && (
                                <span className="selection-check">
                                    <CheckIcon aria-hidden="true" size={18} />
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
