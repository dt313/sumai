// ApiKeyInput.tsx
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

type ApiKeyInputProps = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);

    return (
        <div className="relative flex items-center flex-1">
            <input
                type={show ? 'text' : 'password'}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="flex-1 rounded-md border px-2 py-2 text-sm bg-transparent border-[1.5px] border-[#9e9e9e33] outline-none focus:border-[#9e9e9e] focus: pr-10"
            />
            <button
                type="button"
                onClick={() => setShow((prev) => !prev)}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
            >
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
    );
};

export default ApiKeyInput;
