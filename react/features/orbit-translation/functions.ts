// orbit-rtc/react/features/orbit-translation/functions.ts
// Utility functions and selectors
// Owner: Miles (Eburon Development)

import type { IReduxState } from '../app/types';

import type { ISegmentBuffer, ITtsSettings } from './types';

export function getCurrentSegment(state: IReduxState): ISegmentBuffer | null {
    return state['features/orbit-translation']?.currentSegment ?? null;
}

export function getTtsSettings(state: IReduxState): ITtsSettings {
    return state['features/orbit-translation']?.ttsSettings ?? {
        engine: 'gemini_live',
        preferredLang: 'en',
        voiceId: null,
        readAloudEnabled: true
    };
}

export function isTranslationEnabled(state: IReduxState): boolean {
    return state['features/orbit-translation']?.ttsSettings?.readAloudEnabled ?? true;
}

export function getTranslationQueue(state: IReduxState) {
    return state['features/orbit-translation']?.translationQueue ?? [];
}

export function isPlaying(state: IReduxState): boolean {
    return state['features/orbit-translation']?.isPlaying ?? false;
}
