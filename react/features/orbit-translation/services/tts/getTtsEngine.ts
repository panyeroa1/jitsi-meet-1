// orbit-rtc/react/features/orbit-translation/services/tts/getTtsEngine.ts
// TTS engine factory
// Owner: Miles (Eburon Development)

import { CartesiaTts } from './cartesiaTts';
import { ElevenLabsTts } from './elevenlabsTts';
import { GeminiLiveTts } from './geminiLiveTts';
import type { ITtsEngine, TtsEngineName } from './types';

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
