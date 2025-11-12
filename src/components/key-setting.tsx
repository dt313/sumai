import { useEffect, useState } from 'react';

import { keyInputs } from '~/configs/ui';
import { storage } from '~/utils/storage';

import ApiKeyInput from './api-key-input';
import Button from './button';

function KeySetting() {
    const [keys, setKeys] = useState({
        openai: '',
        gemini: '',
        claude: '',
        ssu: '',
    });

    useEffect(() => {
        const loadKeys = async () => {
            const result = await storage.get('apiKeys');
            if (result.apiKeys) setKeys(result.apiKeys);
        };
        loadKeys();
    }, []);

    const saveKey = async (name: string) => {
        try {
            const newKeys = { ...keys };
            await storage.set({ apiKeys: newKeys });
            alert(`${name} API key đã được lưu!`);
        } catch (error) {
            alert(error.toString());
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        setKeys((prev) => ({ ...prev, [name]: e.target.value }));
    };

    return (
        <div className="space-y-4">
            {keyInputs.map(({ label, key, logo, placeholder }) => (
                <div key={key} className="flex flex-col gap-2">
                    <label className="text-sm font-semibold flex items-center gap-2">
                        {logo && <img src={logo} alt={label} className="w-auto h-5 object-cover" />}
                        {label} API Key
                    </label>
                    <div className="flex gap-2">
                        <ApiKeyInput
                            value={keys[key as keyof typeof keys]}
                            onChange={(val) => handleChange({ target: { value: val } } as any, key)}
                            placeholder={placeholder || `Nhập ${label} key...`}
                        />

                        <Button onClick={() => saveKey(label)}>Save</Button>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default KeySetting;
