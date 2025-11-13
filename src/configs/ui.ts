import images from '~/assets/images';
import type { KeyInput, Provider } from '~types';

export const keyInputs: readonly KeyInput[] = [
    { label: 'OpenAI', provider: 'chatgpt', logo: images.openai },
    { label: 'Gemini', provider: 'gemini', logo: images.gemini },
    { label: 'Claude', provider: 'claude', logo: images.claude },
    { label: 'SSU', provider: 'ssu', logo: images.ssu, placeholder: 'Enter SSU Key here' },
];
