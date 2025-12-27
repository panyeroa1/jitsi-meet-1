// orbit-rtc/react/features/orbit-translation/services/tts/cartesiaTts.ts
// Cartesia TTS engine implementation
// Owner: Miles (Eburon Development)

import type { ITtsEngine, SpeakArgs, TtsEngineName } from './types';

const CARTESIA_API_KEY = process.env.CARTESIA_API_KEY || '';
const CARTESIA_API_URL = 'https://api.cartesia.ai/tts/bytes';

/**
 * Cartesia TTS Engine
 * Ultra-low latency neural TTS
 */
export class CartesiaTts implements ITtsEngine {
    readonly name: TtsEngineName = 'cartesia';
    private audioContext: AudioContext | null = null;
    private currentSource: AudioBufferSourceNode | null = null;

    /**
     * Speak text using Cartesia API
     */
    async speak(args: SpeakArgs): Promise<void> {
        const { text, targetLang, voiceId = 'a0e99841-438c-4a64-b679-ae501e7d6091' } = args; // Default: Barbershop Man

        if (!CARTESIA_API_KEY) {
            console.error('Cartesia API key not configured');

            return;
        }

        try {
            // Initialize audio context
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            // Call Cartesia API
            const response = await fetch(CARTESIA_API_URL, {
                method: 'POST',
                headers: {
                    'Cartesia-Version': '2024-06-10',
                    'X-API-Key': CARTESIA_API_KEY,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model_id: 'sonic-english',
                    transcript: text,
                    voice: {
                        mode: 'id',
                        id: voiceId
                    },
                    language: targetLang,
                    output_format: {
                        container: 'raw',
                        encoding: 'pcm_f32le',
                        sample_rate: 44100
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`Cartesia API error: ${response.status} ${response.statusText}`);
            }

            // Get audio data
            const arrayBuffer = await response.arrayBuffer();

            // Decode and play
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

            return new Promise((resolve, reject) => {
                const source = this.audioContext!.createBufferSource();

                source.buffer = audioBuffer;
                source.connect(this.audioContext!.destination);
                source.onended = () => {
                    this.currentSource = null;
                    resolve();
                };
                this.currentSource = source;
                source.start(0);
            });
        } catch (error: any) {
            console.error('Cartesia TTS failed:', error);
            throw error;
        }
    }

    /**
     * Stop current playback
     */
    stop(): void {
        if (this.currentSource) {
            this.currentSource.stop();
            this.currentSource = null;
        }
    }
}
