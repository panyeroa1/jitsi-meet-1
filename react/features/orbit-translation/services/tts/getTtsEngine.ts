// orbit-rtc/react/features/orbit-translation/services/tts/getTtsEngine.ts
// TTS engine factory
// Owner: Miles (Eburon Development)

import type { ITtsEngine, TtsEngineName } from './types';
import { GeminiLiveTts } from './geminiLiveTts';
import { ElevenLabsTts } from './elevenlabsTts';
import { CartesiaTts } from './cartesiaTts';

/**
 * Factory function to instantiate TTS engines
 *
 * @param name - Engine name
 * @returns TTS engine instance
 */
export function getTtsEngine(name: TtsEngineName): ITtsEngine {
    switch (name) {
    case 'elevenlabs':
        return new ElevenLabsTts();
    case 'cartesia':
        return new CartesiaTts();
    case 'gemini_live':
    default:
        return new GeminiLiveTts();
    }
}
