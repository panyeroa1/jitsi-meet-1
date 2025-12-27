// orbit-rtc/react/features/orbit-translation/types.ts
// TypeScript type definitions
// Owner: Miles (Eburon Development)

import type { TtsEngineName } from './services/tts/types';

export interface ITranscriptSegment {
    endMs?: number;
    id?: string;
    isFinal: boolean;
    roomId: string;
    sourceLang?: string;
    speakerId: string;
    speakerName: string;
    startMs?: number;
    text: string;
}

export interface ITranslationSegment {
    id?: string;
    roomId: string;
    segmentId: string;
    speakerId: string;
    targetLang: string;
    translatedText: string;
    translator?: string;
}

export interface ITtsSettings {
    engine: TtsEngineName;
    preferredLang: string;
    readAloudEnabled: boolean;
    voiceId: string | null;
}

export interface ISegmentBuffer {
    buffer: string;
    lastFlushAt: number;
    text: string;
}

export interface IOrbitTranslationState {
    activeSubscription: any | null;
    currentSegment: ISegmentBuffer | null;
    isPlaying: boolean;
    translationQueue: ITranslationSegment[];
    ttsSettings: ITtsSettings;
}
