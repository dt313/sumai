import { useEffect, useState } from 'react';

import { keyInputs } from '~/configs/ui';
import { storage } from '~/utils/storage';
import type { BackgroundResponse, KeyInput, KeyValidateRequestData, Provider } from '~types';

import ApiKeyForm from './api-key-form';
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

    const saveKey = async (name: Provider) => {
        try {
            const newKeys = { ...keys };
            const data: KeyValidateRequestData = {
                provider: name,
                key: keys[name],
            };

            // Đợi kết quả validate từ background
            const res = await new Promise<BackgroundResponse>((resolve) => {
                chrome.runtime.sendMessage({ type: 'VALIDATE_KEY', data }, (response) => {
                    resolve(response);
                });
            });

            if (res?.ok && res?.data?.isValid) {
                await storage.set({ apiKeys: newKeys });
                return;
            } else {
                throw new Error(res?.error?.message || `${name.toUpperCase()} API key không hợp lệ!`);
            }
        } catch (error) {
            throw new Error(error?.message || `${name.toUpperCase()} API key không hợp lệ!`);
        }
    };

    const handleChange = (value, name: string) => {
        setKeys((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="space-y-4">
            {keyInputs.map(({ label, provider, logo, placeholder, link }: KeyInput) => (
                <ApiKeyForm
                    key={provider}
                    label={label}
                    provider={provider}
                    logo={logo}
                    link={link}
                    placeholder={placeholder}
                    value={keys[provider]}
                    onChange={handleChange}
                    onSave={saveKey}
                />
            ))}
        </div>
    );
}

export default KeySetting;
