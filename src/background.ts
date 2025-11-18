import { defaultSetting } from '~constants';
import { ask } from '~services/ask';
import type { KeyValidateRequestData, SummaryRequestData } from '~types';
import getErrorMessage from '~utils/get-error-msg';
// background.ts

import { storage } from '~utils/storage';
import { validateProviderKey } from '~utils/validate-provider-key';

chrome.runtime.onInstalled.addListener(async () => {
    console.log('✅ Extension installed or reloaded');

    const { setting } = await storage.get('setting');

    if (!setting) {
        await storage.set({
            setting: defaultSetting,
        });

        console.log('✨ Default setting created!');
    }
});

// Nhận message từ content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'ASK_TEXT') {
        const data = msg.data as SummaryRequestData;
        storage.get('apiKeys').then(({ apiKeys }) => {
            const ssuKey = apiKeys?.ssu || null;
            let summary = '';

            ask(ssuKey, data.model, data.text, data.language, data.textCount, data.mode, (chunk) => {
                chrome.tabs.sendMessage(sender.tab!.id!, { type: 'ASK_CHUNK', chunk });
                summary += chunk;
            })
                .then(() => sendResponse({ ok: true, data: { content: summary } }))
                .catch((err) => {
                    const errorMsg = getErrorMessage(err || 'Ask LLM error');

                    chrome.tabs.sendMessage(sender.tab!.id!, {
                        type: 'ASK_ERROR',
                        error: errorMsg,
                    });

                    sendResponse({ ok: false, error: { message: errorMsg } });
                });
        });

        return true; // giữ port mở
    }

    if (msg.type === 'VALIDATE_KEY') {
        const data = msg.data as KeyValidateRequestData;
        validateProviderKey(data.provider, data.key)
            .then((isValid) => sendResponse({ ok: true, data: { isValid } }))
            .catch((err) => sendResponse({ ok: false, error: { message: getErrorMessage(err, 'Validation Error') } }));

        return true;
    }
});
