import { useEffect, useState } from 'react';

import { keyInputs } from '~/configs/ui';
import { useStorageApiKeys, type ApiKeys } from '~hooks/use-storage-key';
import type { BackgroundResponse, KeyInput, KeyValidateRequestData, Provider } from '~types';

import ApiKeyForm from './api-key-form';

function KeySetting() {
    const { apiKeys, updateKeys } = useStorageApiKeys();
    const [tempKeys, setTempKeys] = useState<ApiKeys>(apiKeys);

    useEffect(() => {
        setTempKeys(apiKeys);
    }, [apiKeys]);
    const saveKey = async (provider: Provider) => {
        try {
            const keyValue = tempKeys[provider];
            const data: KeyValidateRequestData = {
                provider,
                key: keyValue,
            };

            // Đợi kết quả validate từ background
            const res = await new Promise<BackgroundResponse>((resolve, reject) => {
                chrome.runtime.sendMessage({ type: 'VALIDATE_KEY', data }, (response) => {
                    if (chrome.runtime.lastError) return reject(chrome.runtime.lastError);
                    resolve(response);
                });
            });

            if (res?.ok && res?.data?.isValid) {
                await updateKeys({ [provider]: keyValue });
                return;
            } else {
                throw new Error(res?.error?.message || `${provider.toUpperCase()} API key không hợp lệ!`);
            }
        } catch (error) {
            throw new Error(error?.message || `${provider.toUpperCase()} API key không hợp lệ!`);
        }
    };

    const handleChange = (value: string, provider: Provider) => {
        setTempKeys((prev) => ({ ...prev, [provider]: value }));
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
                    value={tempKeys[provider]}
                    onChange={handleChange}
                    onSave={saveKey}
                />
            ))}
        </div>
    );
}

export default KeySetting;
