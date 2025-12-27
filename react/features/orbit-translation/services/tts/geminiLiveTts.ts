// orbit-rtc/react/features/orbit-translation/services/tts/geminiLiveTts.ts
// Gemini Live Audio TTS engine implementation
// Owner: Miles (Eburon Development)

import type { ISpeakArgs, ITtsEngine, TtsEngineName } from './types';
const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '') as string;

function _normalizeLang(lang: string) {
    return (lang || '').toLowerCase().replace('_', '-');
}

async function _getSpeechSynthesisVoices(): Promise<SpeechSynthesisVoice[]> {
    const voices = window.speechSynthesis?.getVoices?.() ?? [];

    if (voices.length > 0) {
        return voices;
    }

    // Some browsers populate voices asynchronously.
    await new Promise<void>(resolve => {
        const timeout = window.setTimeout(() => {
            window.speechSynthesis.onvoiceschanged = null;
            resolve();
        }, 500);

        window.speechSynthesis.onvoiceschanged = () => {
            window.clearTimeout(timeout);
            window.speechSynthesis.onvoiceschanged = null;
            resolve();
        };
    });

    return window.speechSynthesis?.getVoices?.() ?? [];
}

async function _pickVoice(targetLang: string, voiceId?: string): Promise<SpeechSynthesisVoice | undefined> {
    const voices = await _getSpeechSynthesisVoices();
    const normalizedTarget = _normalizeLang(targetLang);

    if (voiceId) {
        const exact = voices.find(v => v.name === voiceId || v.voiceURI === voiceId);

        if (exact) {
            return exact;
        }
    }

    // Prefer an exact language match, then primary language prefix match.
    const exactLang = voices.find(v => _normalizeLang(v.lang) === normalizedTarget);

    if (exactLang) {
        return exactLang;
    }

    const primary = normalizedTarget.split('-')[0];

    return voices.find(v => _normalizeLang(v.lang).startsWith(primary));
}

export class GeminiLiveTts implements ITtsEngine {
    readonly name: TtsEngineName = 'gemini_live';

    async speak(args: ISpeakArgs): Promise<void> {
        const { text, targetLang, voiceId } = args;

        try {
            // TODO: Integrate Gemini Live bidirectional streaming audio.
            // For now, use the browser SpeechSynthesis voice as a low-latency fallback.
            if (!apiKey) {
                console.warn('GEMINI_API_KEY not configured; using browser SpeechSynthesis fallback for TTS');
            }

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = targetLang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            const voice = await _pickVoice(targetLang, voiceId);

            if (voice) {
                utterance.voice = voice;
            }

            return new Promise((resolve, reject) => {
                utterance.onend = () => resolve();
                utterance.onerror = error => reject(error);
                window.speechSynthesis.speak(utterance);
            });
        } catch (error: any) {
            console.error('Gemini Live TTS failed:', error);
            throw error;
        }
    }

    stop(): void {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}
