// orbit-rtc/react/features/orbit-translation/services/tts/types.ts
// TypeScript interfaces for TTS engines
// Owner: Miles (Eburon Development)

export type TtsEngineName = 'gemini_live' | 'elevenlabs' | 'cartesia';

export interface SpeakArgs {
    text: string;
    targetLang: string;
    voiceId?: string;
}

export interface ITtsEngine {
    name: TtsEngineName;
    speak(args: SpeakArgs): Promise<void>;
    stop?(): void;
}
