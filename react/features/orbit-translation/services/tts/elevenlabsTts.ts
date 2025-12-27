// orbit-rtc/react/features/orbit-translation/services/tts/elevenlabsTts.ts
// ElevenLabs TTS engine implementation
// Owner: Miles (Eburon Development)

import type { ITtsEngine, SpeakArgs, TtsEngineName } from './types';

const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY || '';
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

/**
 * ElevenLabs TTS Engine
 * High-quality neural TTS with voice cloning
 */
export class ElevenLabsTts implements ITtsEngine {
    readonly name: TtsEngineName = 'elevenlabs';
    private audioContext: AudioContext | null = null;
    private currentSource: AudioBufferSourceNode | null = null;

    /**
     * Speak text using ElevenLabs API
     */
    async speak(args: SpeakArgs): Promise<void> {
        const { text, voiceId = '21m00Tcm4TlvDq8ikWAM' } = args; // Default: Rachel voice

        if (!ELEVENLABS_API_KEY) {
            console.error('ElevenLabs API key not configured');

            return;
        }

        try {
            // Initialize audio context
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            // Call ElevenLabs API
            const response = await fetch(`${ELEVENLABS_API_URL}/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': ELEVENLABS_API_KEY
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_monolingual_v1',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5
                    }
                })
            });

            if (!response.ok) {
                throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
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
            console.error('ElevenLabs TTS failed:', error);
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
