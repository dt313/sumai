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
        <div className="w-full flex items-center gap-2">
            <label className="font-medium text-sm flex-1">Summarize Text Count</label>
            <div className="relative w-[120px]">
                <input
                    type="number"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => onChange(parseInt(e.target.value))}
                    {...props}
                    className={`
            bg-transparent rounded-md border-[1.5px] border-gray-300 w-full
            px-3 py-2 text-sm text-gray-800 shadow-sm 
            transition duration-200 ease-in-out
            hover:border-gray-400 
            focus:outline-none focus:ring-1 focus:ring-cyan-600 focus:border-cyan-600
            [appearance:textfield]
            ${className || ''}
          `}
                />

                <div className="absolute inset-y-0 right-0 flex flex-col items-center justify-center pr-1">
                    <button
                        type="button"
                        onClick={() => onChange(Math.min(value + step, max))}
                        className="text-gray-400 rounded-full hover:text-cyan-600 transition"
                    >
                        <ChevronUp size={16} strokeWidth={3} />
                    </button>
                    <button
                        type="button"
                        onClick={() => onChange(Math.max(value - step, min))}
                        className="text-gray-400   rounded-full hover:text-cyan-600 transition"
                    >
                        <ChevronDown size={16} strokeWidth={3} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NumberInput;
