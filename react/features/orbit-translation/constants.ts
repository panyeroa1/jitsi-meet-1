// orbit-rtc/react/features/orbit-translation/constants.ts
// Constants for orbit-translation feature
// Owner: Miles (Eburon Development)

/**
 * Default TTS engine
 */
export const DEFAULT_TTS_ENGINE = 'gemini_live';

/**
 * Default preferred language
 */
export const DEFAULT_PREFERRED_LANG = 'en';

/**
 * Segment finalization timeout (ms)
 * If no new text arrives within this time, finalize the segment
 */
export const SEGMENT_FINALIZATION_TIMEOUT = 2000;

/**
 * Minimum segment length to persist (characters)
 */
export const MIN_SEGMENT_LENGTH = 5;
