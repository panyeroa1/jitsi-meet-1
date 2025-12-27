// orbit-rtc/react/features/orbit-translation/reducer.ts
// Redux reducer
// Owner: Miles (Eburon Development)

import { ReducerRegistry } from '../base/redux/ReducerRegistry';
import type { IOrbitTranslationState } from './types';
import {
    TRANSCRIPT_SEGMENT_FINALIZED,
    TRANSLATION_RECEIVED,
    UPDATE_TTS_SETTINGS,
    TTS_PLAYBACK_STARTED,
    TTS_PLAYBACK_ENDED,
    SET_ACTIVE_SUBSCRIPTION,
    UPDATE_SEGMENT_BUFFER
} from './actionTypes';
import { DEFAULT_TTS_ENGINE, DEFAULT_PREFERRED_LANG } from './constants';

/**
 * Initial state
 */
const INITIAL_STATE: IOrbitTranslationState = {
    currentSegment: null,
    translationQueue: [],
    ttsSettings: {
        engine: DEFAULT_TTS_ENGINE,
        preferredLang: DEFAULT_PREFERRED_LANG,
        voiceId: null,
        readAloudEnabled: true
    },
    isPlaying: false,
    activeSubscription: null
};

/**
 * Reducer
 */
ReducerRegistry.register<IOrbitTranslationState>(
    'features/orbit-translation',
    (state = INITIAL_STATE, action): IOrbitTranslationState => {
        switch (action.type) {
        case UPDATE_SEGMENT_BUFFER:
            return {
                ...state,
                currentSegment: {
                    text: action.text,
                    buffer: action.text,
                    lastFlushAt: Date.now()
                }
            };

        case TRANSCRIPT_SEGMENT_FINALIZED:
            return {
                ...state,
                currentSegment: null
            };

        case TRANSLATION_RECEIVED:
            return {
                ...state,
                translationQueue: [ ...state.translationQueue, action.translation ]
            };

        case UPDATE_TTS_SETTINGS:
            return {
                ...state,
                ttsSettings: {
                    ...state.ttsSettings,
                    ...action.settings
                }
            };

        case TTS_PLAYBACK_STARTED:
            return {
                ...state,
                isPlaying: true
            };

        case TTS_PLAYBACK_ENDED:
            return {
                ...state,
                isPlaying: false,
                translationQueue: state.translationQueue.slice(1) // Remove played translation
            };

        case SET_ACTIVE_SUBSCRIPTION:
            return {
                ...state,
                activeSubscription: action.subscription
            };

        default:
            return state;
        }
    }
);
