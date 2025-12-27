// orbit-rtc/react/features/orbit-translation/actions.ts
// Redux actions
// Owner: Miles (Eburon Development)

import {
    SET_ACTIVE_SUBSCRIPTION,
    TRANSCRIPT_SEGMENT_FINALIZED,
    TRANSLATION_RECEIVED,
    TTS_PLAYBACK_ENDED,
    TTS_PLAYBACK_STARTED,
    UPDATE_SEGMENT_BUFFER,
    UPDATE_TTS_SETTINGS
} from './actionTypes';
import type { ITranscriptSegment, ITranslationSegment, ITtsSettings } from './types';

export function finalizeTranscriptSegment(segment: ITranscriptSegment) {
    return {
        type: TRANSCRIPT_SEGMENT_FINALIZED,
        segment
    };
}

export function translationReceived(translation: ITranslationSegment) {
    return {
        type: TRANSLATION_RECEIVED,
        translation
    };
}

export function updateTtsSettings(settings: Partial<ITtsSettings>) {
    return {
        type: UPDATE_TTS_SETTINGS,
        settings
    };
}

export function ttsPlaybackStarted() {
    return {
        type: TTS_PLAYBACK_STARTED
    };
}

export function ttsPlaybackEnded() {
    return {
        type: TTS_PLAYBACK_ENDED
    };
}

export function setActiveSubscription(subscription: any) {
    return {
        type: SET_ACTIVE_SUBSCRIPTION,
        subscription
    };
}

export function updateSegmentBuffer(text: string) {
    return {
        type: UPDATE_SEGMENT_BUFFER,
        text
    };
}
