import { KeyRound, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';

import '../style.css';

import KeyInput from '~/components/key-input';
import Setting from '~/components/setting';
import { storage } from '~/utils/storage';

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
        <div className="w-[400px] p-4 font-sans">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 border-b pb-2">
                <h1 className="text-lg font-bold text-primary-light dark:text-primary-dark">Sumai</h1>

                <div className="flex gap-2">
                    <button
                        onClick={() => setShowKeys(true)} // click vào KeyRound thì hiện KeyInput
                        className="hover:opacity-[.67]"
                    >
                        <KeyRound size={20} />
                    </button>

                    <button
                        onClick={() => setShowKeys(false)} // click vào Settings thì hiện Setting
                        className="hover:opacity-[.67]"
                    >
                        <Settings size={20} />
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="space-y-4">{showKeys ? <KeyInput /> : <Setting />}</div>
        </div>
    );
}

export default IndexPopup;
