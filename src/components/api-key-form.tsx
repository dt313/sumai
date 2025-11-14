import { useState } from 'react';

import type { Provider } from '~types';

import ApiKeyInput from './api-key-input';
import Button from './button';
import SpinLoading from './spin-loading';

type ApiKeyFormProps = {
    label: string;
    provider: Provider;
    logo?: string;
    placeholder?: string;
    link: string;
    value: string;
    onChange: (val: string, provider: Provider) => void;
    onSave: (provider: Provider) => Promise<void>;
};

const ApiKeyForm: React.FC<ApiKeyFormProps> = ({
    label,
    provider,
    logo,
    link,
    placeholder,
    value = '',
    onChange,
    onSave,
}) => {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [success, setSuccess] = useState<boolean>(false);

    const handleSave = async () => {
        try {
            setError(null);
            setLoading(true); // Bật loading
            await onSave(provider);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err: any) {
            setError(err?.message || 'Error on save key');
        } finally {
            setLoading(false); // Tắt loading
        }
    };

    const handleChange = (value) => {
        onChange(value, provider);
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-semibold flex items-center gap-2">
                    {logo && <img src={logo} alt={label} className="w-auto h-5 object-cover" />}
                    {label} API Key
                </label>

                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-700 text-xs hover:underline"
                >
                    Get Key
                </a>
            </div>

            <div className="flex gap-2">
                <ApiKeyInput
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder || `Nhập ${label} key...`}
                />
                {!success ? (
                    <Button onClick={handleSave} loading={loading} disabled={success || loading || !value}>
                        Save
                    </Button>
                ) : (
                    <div className="flex items-center justify-center w-[100px] h-10">
                        <span className="text-black-600 min-w-[80px]  px-4 py-2 text-sm font-medium text-center transition-colors">
                            ✅ Saved
                        </span>
                    </div>
                )}
            </div>

            {error && <span className="text-red-500 text-sm text-center font-medium">{error}</span>}
        </div>
    );
};

export default ApiKeyForm;
