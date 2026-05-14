import images from '~/assets/images';
import type { KeyInput } from '~types';

export const keyInputs: readonly KeyInput[] = [
    { label: 'OpenAI', provider: 'chatgpt', logo: images.openai, link: 'https://platform.openai.com/api-keys' },
    { label: 'Gemini', provider: 'gemini', logo: images.gemini, link: 'https://aistudio.google.com/app/api-keys' },
    {
        label: 'Claude',
        provider: 'claude',
        logo: images.claude,
        link: 'https://console.anthropic.com/settings/admin-keys',
    },
    {
        label: 'OLAMA',
        provider: 'olama',
        logo: images.olama,
        placeholder: 'Enter OLAMA Key here',
        link: 'https://ollama.com/settings/keys',
    },
];

export const modelSelection = [
    { label: 'OpenAI', value: 'chatgpt', image: images.openai },
    { label: 'Gemini', value: 'gemini', image: images.gemini },
    { label: 'Claude', value: 'claude', image: images.claude },
    { label: 'Olama', value: 'olama', image: images.olama },
];

export const modeSelection = [
    { label: 'Summary', value: 'summary', image: images.summary },
    { label: 'Explain', value: 'explain', image: images.bulb },
    { label: 'Translate', value: 'translate', image: images.earth },
];

export const languageSelection = [
    { value: 'english', label: 'English' },
    { value: 'vietnamese', label: 'Vietnamese' },
    { value: 'korean', label: 'Korean' },
    { value: 'japanese', label: 'Japanese' },
    { value: 'chinese', label: 'Chinese' },
    { value: 'french', label: 'French' },
    { value: 'german', label: 'German' },
];
