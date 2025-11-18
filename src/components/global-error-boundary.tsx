import React, { useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

function AutoReloadExtensionFallback() {
    useEffect(() => {
        console.warn('Extension crashed. Reloading...');
        const timer = setTimeout(() => {
            chrome.runtime.reload();
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return <div>Something went wrong. Reloading extension...</div>;
}

export const GlobalErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return <ErrorBoundary fallbackRender={() => <AutoReloadExtensionFallback />}>{children}</ErrorBoundary>;
};
