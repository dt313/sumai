import { defaultSetting } from '~constants';
import { summarize } from '~services/summarize';
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
    if (msg.type === 'SEND_SELECTED_TEXT') {
        const data = msg.data as SummaryRequestData;
        storage.get('apiKeys').then(({ apiKeys }) => {
            const ssuKey = apiKeys?.ssu || null;
            let summary = '';

            summarize(ssuKey, data.model, data.text, data.language, data.textCount, (chunk) => {
                chrome.tabs.sendMessage(sender.tab!.id!, { type: 'SUMMARY_CHUNK', chunk });
                summary += chunk;
            })
                .then(() => sendResponse({ ok: true, data: { content: summary } }))
                .catch((err) => sendResponse({ ok: false, error: { message: err.message || 'Summary Error' } }));
        });

        return true; // giữ port mở
    }

    if (msg.type === 'VALIDATE_KEY') {
        const data = msg.data as KeyValidateRequestData;
        validateProviderKey(data.provider, data.key)
            .then((isValid) => sendResponse({ ok: true, data: { isValid } }))
            .catch((err) =>
                sendResponse({ ok: false, error: { message: getErrorMessage(err) || 'Validation Error' } }),
            );

        return true;
    }
});
