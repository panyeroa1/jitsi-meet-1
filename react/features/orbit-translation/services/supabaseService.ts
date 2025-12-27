// orbit-rtc/react/features/orbit-translation/services/supabaseService.ts
// Supabase client and database operations for ORBIT translation feature
// Owner: Miles (Eburon Development)

import { SupabaseClient, createClient } from '@supabase/supabase-js';

// Environment variables (will be exposed via webpack)
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getClient(): SupabaseClient {
    if (!supabaseClient) {
        if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
            throw new Error('Supabase configuration missing: SUPABASE_URL and SUPABASE_ANON_KEY are required');
        }
        supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    return supabaseClient;
}

export async function insertTranscriptSegment(params: {
    endMs?: number;
    isFinal: boolean;
    roomId: string;
    sourceLang?: string;
    speakerId: string;
    speakerName: string;
    startMs?: number;
    text: string;
}) {
    const client = getClient();
    const { data, error } = await client
        .from('transcript_segments')
        .insert([ {
            room_id: params.roomId,
            speaker_id: params.speakerId,
            speaker_name: params.speakerName,
            source_lang: params.sourceLang ?? null,
            text: params.text,
            start_ms: params.startMs ?? null,
            end_ms: params.endMs ?? null,
            is_final: params.isFinal
        } ])
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to insert transcript segment: ${error.message}`);
    }

    return data as { id: string; };
}

export async function upsertTranslationSegment(params: {
    roomId: string;
    segmentId: string;
    speakerId: string;
    targetLang: string;
    translatedText: string;
    translator?: string;
}) {
    const client = getClient();
    const { error } = await client
        .from('translation_segments')
        .upsert([ {
            room_id: params.roomId,
            segment_id: params.segmentId,
            speaker_id: params.speakerId,
            target_lang: params.targetLang,
            translated_text: params.translatedText,
            translator: params.translator ?? 'gemini'
        } ], { onConflict: 'segment_id,target_lang' });

    if (error) {
        throw new Error(`Failed to upsert translation segment: ${error.message}`);
    }
}

export function subscribeToTranslationSegments(
        roomId: string,
        targetLang: string,
        onInsert: (row: any) => void
): () => void {
    const client = getClient();
    const channel = client
        .channel(`translation_segments:${roomId}:${targetLang}`)
        .on(
            'postgres_changes',
            {
                event: 'INSERT',
                schema: 'public',
                table: 'translation_segments',
                filter: `room_id=eq.${roomId}`
            },
            payload => {
                const row = payload.new as any;

                if (row?.target_lang === targetLang) {
                    onInsert(row);
                }
            }
        )
        .subscribe();

    return () => {
        void client.removeChannel(channel);
    };
}

export async function updateParticipantSettings(
        roomId: string,
        participantId: string,
        settings: {
            preferredLang?: string;
            readAloudEnabled?: boolean;
            ttsEngine?: string;
            voiceId?: string | null;
        }
) {
    const client = getClient();
    const { error } = await client
        .from('participants')
        .upsert([ {
            room_id: roomId,
            participant_id: participantId,
            preferred_lang: settings.preferredLang,
            tts_engine: settings.ttsEngine,
            voice_id: settings.voiceId,
            read_aloud_enabled: settings.readAloudEnabled
        } ], { onConflict: 'room_id,participant_id' });

    if (error) {
        throw new Error(`Failed to update participant settings: ${error.message}`);
    }
}

export async function fetchActiveParticipants(roomId: string) {
    const client = getClient();
    const { data, error } = await client
        .from('participants')
        .select('*')
        .eq('room_id', roomId)
        .eq('read_aloud_enabled', true);

    if (error) {
        throw new Error(`Failed to fetch participants: ${error.message}`);
    }

    return data as Array<{
        id: string;
        participant_id: string;
        preferred_lang: string;
        read_aloud_enabled: boolean;
        room_id: string;
        tts_engine: string;
        voice_id: string | null;
    }>;
}
