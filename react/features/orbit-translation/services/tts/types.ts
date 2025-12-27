// orbit-rtc/react/features/orbit-translation/services/tts/types.ts
// TypeScript interfaces for TTS engines
// Owner: Miles (Eburon Development)

export type TtsEngineName = 'gemini_live' | 'elevenlabs' | 'cartesia';

export interface ISpeakArgs {
    targetLang: string;
    text: string;
    voiceId?: string;
}

export interface ITtsEngine {
    name: TtsEngineName;
    speak: (args: ISpeakArgs) => Promise<void>;
    stop?: () => void;
}
