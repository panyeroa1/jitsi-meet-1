// orbit-rtc/react/features/orbit-translation/functions.ts
// Utility functions and selectors
// Owner: Miles (Eburon Development)

import type { IReduxState } from '../app/types';
import type { ISegmentBuffer, ITtsSettings } from './types';

/**
 * Get current segment buffer
 */
export function getCurrentSegment(state: IReduxState): ISegmentBuffer | null {
    return state['features/orbit-translation']?.currentSegment ?? null;
}

/**
 * Get TTS settings
 */
export function getTtsSettings(state: IReduxState): ITtsSettings {
    return state['features/orbit-translation']?.ttsSettings ?? {
        engine: 'gemini_live',
        preferredLang: 'en',
        voiceId: null,
        readAloudEnabled: true
    };
}

/**
 * Check if translation feature is enabled
 */
export function isTranslationEnabled(state: IReduxState): boolean {
    return state['features/orbit-translation']?.ttsSettings?.readAloudEnabled ?? true;
}

/**
 * Get translation queue
 */
export function getTranslationQueue(state: IReduxState) {
    return state['features/orbit-translation']?.translationQueue ?? [];
}

/**
 * Check if TTS is currently playing
 */
export function isPlaying(state: IReduxState): boolean {
    return state['features/orbit-translation']?.isPlaying ?? false;
}
