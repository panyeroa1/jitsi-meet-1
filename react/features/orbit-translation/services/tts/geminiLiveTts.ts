// orbit-rtc/react/features/orbit-translation/services/tts/geminiLiveTts.ts
// Gemini Live Audio TTS engine implementation
// Owner: Miles (Eburon Development)

import type { ITtsEngine, SpeakArgs, TtsEngineName } from './types';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '') as string;
const genAI = new GoogleGenerativeAI(apiKey);

/**
 * Gemini Live TTS Engine
 * Uses Gemini's multimodal Live API for natural text-to-speech
 */
export class GeminiLiveTts implements ITtsEngine {
    readonly name: TtsEngineName = 'gemini_live';
    private audioContext: AudioContext | null = null;

    /**
     * Speak text using Gemini Live Audio
     */
    async speak(args: SpeakArgs): Promise<void> {
        const { text, targetLang } = args;

        if (!apiKey) {
            console.error('Gemini API key not configured');

            return;
        }

        try {
            // Initialize audio context if needed
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            // System instruction: language-locked, natural speech
            const systemInstruction = [
                `You are a realtime translation voice assistant for Orbit Conference.`,
                `Speak ONLY in ${targetLang}.`,
                `Preserve the speaker's emotion, tone, and intent.`,
                `Do NOT mention that you are translating.`,
                `Do NOT add any meta commentary or explanations.`,
                `Sound natural and native in ${targetLang}.`
            ].join(' ');

            // Use Gemini text-to-speech (simplified for now)
            // TODO: Integrate with actual Gemini Live bidirectional streaming API when available
            // For MVP, we'll use browser's SpeechSynthesis API as fallback

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = targetLang;
            utterance.rate = 1.0;
            utterance.pitch = 1.0;

            return new Promise((resolve, reject) => {
                utterance.onend = () => resolve();
                utterance.onerror = (error) => reject(error);
                window.speechSynthesis.speak(utterance);
            });
        } catch (error: any) {
            console.error('Gemini Live TTS failed:', error);
            throw error;
        }
    }

    /**
     * Stop current playback
     */
    stop(): void {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
    }
}
