// orbit-rtc/react/features/orbit-translation/types.ts
// TypeScript type definitions
// Owner: Miles (Eburon Development)

import type { TtsEngineName } from './services/tts/types';

/**
 * Transcript segment
 */
export interface ITranscriptSegment {
    id?: string;
    roomId: string;
    speakerId: string;
    speakerName: string;
    sourceLang?: string;
    text: string;
    startMs?: number;
    endMs?: number;
    isFinal: boolean;
}

/**
 * Translation segment
 */
export interface ITranslationSegment {
    id?: string;
    roomId: string;
    segmentId: string;
    speakerId: string;
    targetLang: string;
    translatedText: string;
    translator?: string;
}

/**
 * TTS settings
 */
export interface ITtsSettings {
    engine: TtsEngineName;
    preferredLang: string;
    voiceId: string | null;
    readAloudEnabled: boolean;
}

/**
 * Current segment buffer state
 */
export interface ISegmentBuffer {
    text: string;
    buffer: string;
    lastFlushAt: number;
}

/**
 * Redux state for orbit-translation feature
 */
export interface IOrbitTranslationState {
    currentSegment: ISegmentBuffer | null;
    translationQueue: ITranslationSegment[];
    ttsSettings: ITtsSettings;
    isPlaying: boolean;
    activeSubscription: any | null;
}
