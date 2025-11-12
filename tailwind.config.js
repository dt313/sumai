/** @type {import('tailwindcss').Config} */
module.exports = {
    mode: 'jit',
    darkMode: 'class',
    content: ['./src/**/*.{ts,tsx,js,jsx}'],
    plugins: [],
    theme: {
        extend: {
            colors: {
                primary: {
                    light: '#00a3cc', // normal light mode
                    dark: '#00a3cc', // normal dark mode
                    hover: '#005c88', // hover color
                    disabled: '#7fc3dc', // disabled color
                },
                secondary: {
                    light: '#e5e7eb',
                    dark: '#374151',
                    hover: '#d1d5db',
                    disabled: '#9ca3af',
                },
                cancel: {
                    light: '#ef4444',
                    dark: '#f87171',
                    hover: '#dc2626',
                    disabled: '#fca5a5',
                },
            },
        },
    },
};
