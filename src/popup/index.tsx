import { KeyRound, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import '../style.css';

import Setting from '~/components/setting';
import { storage } from '~/utils/storage';
import images from '~assets/images';
import { GlobalErrorBoundary } from '~components/global-error-boundary';
import KeySetting from '~components/key-setting';

function IndexPopup() {
    const [loading, setLoading] = useState(true);
    const [showKeys, setShowKeys] = useState(false); // state mới

    useEffect(() => {
        console.log('Live now…');
        const checkKeys = async () => {
            const result = await storage.get('apiKeys');
            const apiKeys = result?.apiKeys;
            const hasAnyKey = apiKeys?.openai || apiKeys?.gemini || apiKeys?.anthropic;
            setShowKeys(!hasAnyKey); // nếu chưa có key thì hiển thị KeyInput
            setLoading(false);
        };
        checkKeys();
    }, []);

    if (loading) {
        return <div className="w-[400px] p-4 font-sans text-center text-sm text-gray-500">Đang tải...</div>;
    }

    return (
        <GlobalErrorBoundary>
            <div className="w-[400px] p-4 font-sans bg-bg-light pb-[40px] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b pb-2">
                    <div className="flex items-center">
                        <img src={images.logo} className="w-[24px] h-[24px] object-cover mr-2" />

                        <h1 className="text-lg font-bold text-primary-light dark:text-primary-dark">Sumai</h1>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowKeys(true)} // click vào KeyRound thì hiện KeyInput
                            className="hover:opacity-[.67] cursor-pointer"
                        >
                            <KeyRound size={20} />
                        </button>

                        <button
                            onClick={() => setShowKeys(false)} // click vào Settings thì hiện Setting
                            className="hover:opacity-[.67] cursor-pointer"
                        >
                            <Settings size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="space-y-4">{showKeys ? <KeySetting /> : <Setting />}</div>
            </div>
        </GlobalErrorBoundary>
    );
}

export default IndexPopup;
