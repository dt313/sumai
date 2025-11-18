import React from 'react';
import ReactDOM from 'react-dom/client';

import KeySetting from '~/components/key-setting';
import Setting from '~/components/setting';

import '../style.css';

function OptionPage() {
    return (
        <div className="min-h-screen w-full flex justify-center items-center bg-bg-light overflow-y-auto p-6">
            <div className="max-w-[980px] max-h-[600px] w-full flex flex-wrap gap-6">
                {/* Cột phải: KeySetting */}
                <div className="flex-1 bg-bg-light p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">API Keys</h2>
                    <KeySetting />
                </div>
                {/* Cột trái: Setting */}
                <div className="flex-1 bg-bg-light p-4 rounded shadow">
                    <h2 className="text-lg font-semibold mb-4">Settings</h2>
                    <Setting />
                </div>
            </div>
        </div>
    );
}

export default OptionPage;
