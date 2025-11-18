// hoặc theme khác

import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import React, { useMemo } from 'react';

import { useStorageSetting } from '~hooks/use-storage-setting';

// Configure marked with syntax highlighting
marked.use(
    markedHighlight({
        langPrefix: 'hljs language-',
        highlight(code, lang) {
            const language = hljs.getLanguage(lang) ? lang : 'plaintext';
            return hljs.highlight(code, { language }).value;
        },
    }),
);

function SafeMarkdown({ content }: { content: string }) {
    const setting = useStorageSetting();
    console.log({ content });
    const html = useMemo(() => {
        if (!content) return '';

        marked.setOptions({
            breaks: true,
            gfm: true,
        });

        const rawHtml = marked(content) as string;
        return DOMPurify.sanitize(rawHtml);
    }, [content]);

    if (!content) return <div>No content</div>;

    return (
        <div
            className={`markdown-body ${setting?.isDarkTheme ? 'dark' : 'light'}`}
            dangerouslySetInnerHTML={{ __html: html }}
        />
    );
}

export default SafeMarkdown;
