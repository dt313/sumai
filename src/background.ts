import { summarize } from '~services/summarize';
import type { KeyValidateRequestData, SummaryRequestData } from '~types';
import getErrorMessage from '~utils/get-error-msg';
// background.ts

import { storage } from '~utils/storage';
import { validateProviderKey } from '~utils/validate-provider-key';

chrome.runtime.onInstalled.addListener(() => {
    console.log('✅ Extension installed or reloaded');
});

// Nhận message từ content
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    const { apiKeys } = await storage.get('apiKeys');

    const ssuKey = apiKeys?.ssu || null;

    if (msg.type === 'SEND_SELECTED_TEXT') {
        const data: SummaryRequestData = msg.data;
        console.log('📩 Nhận text từ content:', data);

        try {
            let summary = '';

            await summarize(ssuKey, data.model, data.text, data.nativeLanguage, data.responseTextCount, (chunk) => {
                chrome.tabs.sendMessage(sender.tab!.id!, {
                    type: 'SUMMARY_CHUNK',
                    chunk,
                });
                summary += chunk;
            });

            sendResponse({
                ok: true,
                data: { content: summary },
            });
        } catch (error: any) {
            console.error('Error summarizing:', error);
            sendResponse({ ok: false, error: { message: error.message || 'Summary Error' } });
        }
    } else if (msg.type === 'VALIDATE_KEY') {
        const data: KeyValidateRequestData = msg.data;
        const { provider, key } = data;
        try {
            const isValid = await validateProviderKey(provider, key);
            sendResponse({
                ok: true,
                data: {
                    isValid,
                },
            });
        } catch (error) {
            sendResponse({
                ok: false,
                error: {
                    message: getErrorMessage(error) || 'Validation Error',
                },
            });
        }
    }
});
