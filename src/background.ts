// background.ts

console.log('🟢 Background script loaded!');

chrome.runtime.onInstalled.addListener(() => {
    console.log('✅ Extension installed or reloaded');
});

// Nhận message từ content
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.type === 'SEND_SELECTED_TEXT') {
        console.log('📩 Nhận text từ content:', msg.text);
        sendResponse({
            ok: true,
            data: {
                content: msg.text.toUpperCase(),
            },
        });
    }
});
