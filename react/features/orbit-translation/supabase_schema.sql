-- ORBIT RTC Realtime Translation & Read-Aloud
-- Supabase Schema Migration
-- Owner: Miles (Eburon Development)
-- Date: 2025-12-27

-- ============================================
-- Table: transcript_segments
-- Purpose: Store all speaker transcription segments with metadata
-- ============================================

create table if not exists public.transcript_segments (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  speaker_id text not null,
  speaker_name text not null,
  source_lang text,
  text text not null,
  start_ms bigint,
  end_ms bigint,
  is_final boolean not null default false,
  created_at timestamptz not null default now()
);

-- Indexes for efficient querying
create index if not exists idx_transcript_segments_room_created
  on public.transcript_segments(room_id, created_at);

create index if not exists idx_transcript_segments_room_speaker_created
  on public.transcript_segments(room_id, speaker_id, created_at);

-- ============================================
-- Table: translation_segments
-- Purpose: Store translated versions of each segment (one per target language)
-- ============================================

create table if not exists public.translation_segments (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  segment_id uuid not null references public.transcript_segments(id) on delete cascade,
  speaker_id text not null,
  target_lang text not null,
  translated_text text not null,
  translator text not null default 'gemini',
  created_at timestamptz not null default now(),

  -- Unique constraint prevents duplicate translations for same segment+language
  constraint uq_translation_segment_lang unique(segment_id, target_lang)
);

-- Indexes for efficient querying by room and language
create index if not exists idx_translation_segments_room_lang_created
  on public.translation_segments(room_id, target_lang, created_at);

create index if not exists idx_translation_segments_segment_lang
  on public.translation_segments(segment_id, target_lang);

-- ============================================
-- Table: participants (extend existing or create new)
-- Purpose: Store per-listener language and TTS preferences
-- ============================================

-- NOTE: If participants table doesn't exist, create it:
create table if not exists public.participants (
  id uuid primary key default gen_random_uuid(),
  room_id text not null,
  participant_id text not null,
  display_name text,
  created_at timestamptz not null default now(),

  constraint uq_participants_room_participant unique(room_id, participant_id)
);

-- Add new columns for ORBIT translation features
alter table public.participants
  add column if not exists preferred_lang text default 'en',
  add column if not exists tts_engine text default 'gemini_live',  -- gemini_live | elevenlabs | cartesia
  add column if not exists voice_id text,
  add column if not exists read_aloud_enabled boolean default true;

-- ============================================
-- RLS Policies (optional - for public prototype, skip for now)
-- ============================================

-- For production, enable RLS and add policies:
-- alter table public.transcript_segments enable row level security;
-- alter table public.translation_segments enable row level security;
-- alter table public.participants enable row level security;

-- ============================================
-- Comments
-- ============================================

comment on table public.transcript_segments is 'Stores all finalized transcription segments from speakers';
comment on table public.translation_segments is 'Stores translations of transcript segments (one row per language)';
comment on column public.participants.preferred_lang is 'ISO language code for listener preferred language';
comment on column public.participants.tts_engine is 'Selected TTS engine: gemini_live, elevenlabs, or cartesia';
comment on column public.participants.voice_id is 'Voice ID for TTS engine (engine-specific)';
comment on column public.participants.read_aloud_enabled is 'Whether to read translations aloud for this participant';
