import { summarize } from '~services/summarize';
import type { RequestData } from '~types';
// background.ts

import { storage } from '~utils/storage';

console.log('🟢 Background script loaded!');

chrome.runtime.onInstalled.addListener(() => {
    console.log('✅ Extension installed or reloaded');
});

// Nhận message từ content
chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    const { apiKeys } = await storage.get('apiKeys');

    const ssuKey = apiKeys.ssu;
    if (msg.type === 'SEND_SELECTED_TEXT') {
        const data: RequestData = msg.data;
        console.log('📩 Nhận text từ content:', data);

        try {
            let summary = '';

            await summarize(ssuKey, data.model, data.text, data.nativeLanguage, data.responseTextCount, (chunk) => {
                // gửi từng chunk ra content script dần dần
                chrome.tabs.sendMessage(sender.tab!.id!, {
                    type: 'SUMMARY_CHUNK',
                    chunk,
                });
                summary += chunk;
            });

            // gửi tổng summary khi hoàn tất
            sendResponse({
                ok: true,
                data: { content: summary },
            });
        } catch (error: any) {
            console.error('Error summarizing:', error);
            sendResponse({ ok: false, error: error.message });
        }
    }
});
