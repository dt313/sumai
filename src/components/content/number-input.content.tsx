import { ChevronDown, ChevronUp } from 'lucide-react';
import React from 'react';

type NumberInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
    className?: string;
    [key: string]: any;
};

const NumberInput: React.FC<NumberInputProps> = ({
    value,
    onChange,
    min = 10,
    max = 1000,
    step = 50,
    className,
    ...props
}) => {
    return (
        <div className="ni-wrapper">
            <div className="ni-input-box">
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    {...props}
                    className={`ni-input ${className || ''}`}
                />

                <div className="ni-controls">
                    <button type="button" onClick={() => onChange(Math.min(value + step, max))} className="ni-btn">
                        <ChevronUp size={16} strokeWidth={3} />
                    </button>

                    <button type="button" onClick={() => onChange(Math.max(value - step, min))} className="ni-btn">
                        <ChevronDown size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberInput;
