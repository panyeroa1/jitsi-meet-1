// orbit-rtc/react/features/orbit-translation/actions.ts
// Redux actions
// Owner: Miles (Eburon Development)

import type { ITranscriptSegment, ITranslationSegment, ITtsSettings } from './types';
import {
    TRANSCRIPT_SEGMENT_FINALIZED,
    TRANSLATION_RECEIVED,
    UPDATE_TTS_SETTINGS,
    TTS_PLAYBACK_STARTED,
    TTS_PLAYBACK_ENDED,
    SET_ACTIVE_SUBSCRIPTION,
    UPDATE_SEGMENT_BUFFER
} from './actionTypes';

/**
 * Finalize a transcript segment (triggers persistence and translation)
 */
export function finalizeTranscriptSegment(segment: ITranscriptSegment) {
    return {
        type: TRANSCRIPT_SEGMENT_FINALIZED,
        segment
    };
}

/**
 * Translation received from Supabase realtime
 */
export function translationReceived(translation: ITranslationSegment) {
    return {
        type: TRANSLATION_RECEIVED,
        translation
    };
}

/**
 * Update TTS settings
 */
export function updateTtsSettings(settings: Partial<ITtsSettings>) {
    return {
        type: UPDATE_TTS_SETTINGS,
        settings
    };
}

/**
 * TTS playback started
 */
export function ttsPlaybackStarted() {
    return {
        type: TTS_PLAYBACK_STARTED
    };
}

/**
 * TTS playback ended
 */
export function ttsPlaybackEnded() {
    return {
        type: TTS_PLAYBACK_ENDED
    };
}

/**
 * Set active Supabase subscription
 */
export function setActiveSubscription(subscription: any) {
    return {
        type: SET_ACTIVE_SUBSCRIPTION,
        subscription
    };
}

/**
 * Update segment buffer
 */
export function updateSegmentBuffer(text: string) {
    return {
        type: UPDATE_SEGMENT_BUFFER,
        text
    };
}
