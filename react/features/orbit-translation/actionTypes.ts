// orbit-rtc/react/features/orbit-translation/actionTypes.ts
// Redux action types
// Owner: Miles (Eburon Development)

/**
 * Action dispatched when a transcript segment is finalized and ready for persistence
 */
export const TRANSCRIPT_SEGMENT_FINALIZED = 'TRANSCRIPT_SEGMENT_FINALIZED';

/**
 * Action dispatched when a new translation arrives via Supabase realtime
 */
export const TRANSLATION_RECEIVED = 'TRANSLATION_RECEIVED';

/**
 * Action dispatched when user updates TTS settings
 */
export const UPDATE_TTS_SETTINGS = 'UPDATE_TTS_SETTINGS';

/**
 * Action dispatched when TTS playback starts
 */
export const TTS_PLAYBACK_STARTED = 'TTS_PLAYBACK_STARTED';

/**
 * Action dispatched when TTS playback ends
 */
export const TTS_PLAYBACK_ENDED = 'TTS_PLAYBACK_ENDED';

/**
 * Action dispatched to set active Supabase subscription
 */
export const SET_ACTIVE_SUBSCRIPTION = 'SET_ACTIVE_SUBSCRIPTION';

/**
 * Action dispatched to update current segment buffer
 */
export const UPDATE_SEGMENT_BUFFER = 'UPDATE_SEGMENT_BUFFER';
