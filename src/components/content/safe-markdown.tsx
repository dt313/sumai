// hoặc theme khác

import DOMPurify from 'dompurify';
import hljs from 'highlight.js';
import { marked } from 'marked';
import { markedHighlight } from 'marked-highlight';
import React, { useMemo } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

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

// Fallback UI when error
function MarkdownErrorFallback({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) {
    return (
        <div role="alert" style={{ color: 'red' }}>
            <p>Something went wrong while rendering markdown:</p>
            <pre>{error.message}</pre>
        </div>
    );
}

function SafeMarkdown({ content }: { content: string }) {
    const setting = useStorageSetting();
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

// Bọc SafeMarkdown bằng ErrorBoundary khi export
function SafeMarkdownWrapper(props: { content: string }) {
    return (
        <ErrorBoundary FallbackComponent={MarkdownErrorFallback}>
            <SafeMarkdown {...props} />
        </ErrorBoundary>
    );
}
export default SafeMarkdownWrapper;
