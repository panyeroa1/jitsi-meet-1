# ORBIT RTC Translation Feature - Setup Guide

## Overview

The orbit-translation feature adds realtime translation persistence and per-listener read-aloud capabilities to Orbit Conference. When a speaker talks, their speech is:

1. **Transcribed** by existing Jitsi transcription services
2. **Persisted** to Supabase as segment history
3. **Translated** into multiple listener languages using Gemini AI
4. **Read aloud** to each listener using their preferred TTS engine (Gemini Live, ElevenLabs, or Cartesia)

## Prerequisites

### 1. Supabase Account

You need a Supabase project with the schema deployed.

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In the SQL Editor, run the migration script:
   ```bash
   cat react/features/orbit-translation/supabase_schema.sql
   ```
3. Copy the SQL and execute it in your Supabase SQL editor
4. Note your `Project URL` and `anon public` API key from Settings → API

### 2. API Keys

Obtain the following API keys:

- **Gemini API** (Required): Get from [Google AI Studio](https://makersuite.google.com/app/apikey)
- **ElevenLabs** (Optional): Get from [elevenlabs.io](https://elevenlabs.io) → Profile → API Key
- **Cartesia** (Optional): Get from [cartesia.ai](https://cartesia.ai) → API

## Configuration

### Environment Variables

Create a `.env` file in the project root (or use environment variables in your deployment):

```bash
# Required
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key-here
GEMINI_API_KEY=your-gemini-api-key

# Optional (for additional TTS engines)
ELEVENLABS_API_KEY=your-elevenlabs-key
CARTESIA_API_KEY=your-cartesia-key
```

**Note:**  These environment variables are exposed to the client via webpack's `EnvironmentPlugin`. Ensure your Supabase RLS policies are configured appropriately for production.

### Webpack Configuration

The webpack configuration has already been updated to expose these variables. If you need to add more variables, edit `webpack.config.js`:

```javascript
new webpack.EnvironmentPlugin({
    SUPABASE_URL: '',
    SUPABASE_ANON_KEY: '',
    // ... other keys
})
```

## Usage

### For Speakers

1. Join a meeting
2. Enable transcription (existing Jitsi feature)
3. Speak normally - your speech will be transcribed and persisted automatically

### For Listeners

Currently, settings are stored in Supabase with default values:
- **Preferred Language**: `en` (English)
- **TTS Engine**: `gemini_live`
- **Read Aloud**: Enabled

**To customize settings**, you'll need to:
1. Update the `participants` table in Supabase directly, OR
2. Implement the Settings UI (see "Future Work" below)

### TTS Engine Selection

Three engines are available:

1. **Gemini Live** (Default)
   - Uses browser's Speech Synthesis API as fallback
   - No additional API key cost (uses GEMINI_API_KEY)
   - Natural, multi-language support

2. **ElevenLabs**
   - Premium quality neural TTS
   - Requires `ELEVENLABS_API_KEY`
   - Voice selection via `voice_id` parameter

3. **Cartesia**
   - Ultra-low latency TTS
   - Requires `CARTESIA_API_KEY`
   - Good for real-time applications

## Architecture

### Data Flow

```
Speaker Speech
    ↓
[Jitsi Transcription]
    ↓
[orbit-translation/middleware]
    ↓
[Supabase: transcript_segments] ← Persist
    ↓
[Translation Service (Gemini)] ← Translate to each listener language
    ↓
[Supabase: translation_segments] ← Persist translations
    ↓
[Supabase Realtime Subscription] ← Listener subscribes
    ↓
[Language Enforcement] ← Ensure correct language
    ↓
[TTS Engine] ← Speak
    ↓
[Audio Queue] ← Sequential playback
    ↓
Listener Hears Translation
```

### File Structure

```
react/features/orbit-translation/
├── supabase_schema.sql          # Database schema
├── services/
│   ├── supabaseService.ts       # DB operations + realtime
│   ├── translationService.ts    # Gemini translation
│   ├── audioQueue.ts            # Sequential audio playback
│   └── tts/
│       ├── types.ts             # TTS interfaces
│       ├── getTtsEngine.ts      # Factory
│       ├── geminiLiveTts.ts     # Gemini Live engine
│       ├── elevenlabsTts.ts     # ElevenLabs engine
│       └── cartesiaTts.ts       # Cartesia engine
├── actionTypes.ts               # Redux action constants
├── actions.ts                   # Redux action creators
├── reducer.ts                   # Redux reducer
├── middleware.ts                 # Redux middleware (side effects)
├── functions.ts                 # Selectors
├── constants.ts                 # Feature constants
├── types.ts                     # TypeScript definitions
└── logger.ts                    # Feature logger
```

## Testing

### Manual Testing Checklist

1. **Transcript Persistence**
   - [ ] Join meeting
   - [ ] Speak into microphone
   - [ ] Check Supabase `transcript_segments` table for new rows

2. **Translation Generation**
   - [ ] Update a participant's `preferred_lang` to `fr` (French)
   - [ ] Speak in English
   - [ ] Check Supabase `translation_segments` table for French translation

3. **TTS Playback**
   - [ ] Set `read_aloud_enabled` to `true` in participants table
   - [ ] Speak and verify audio playback

4. **Engine Switching**
   - [ ] Change `tts_engine` to `elevenlabs` (if key configured)
   - [ ] Verify playback uses ElevenLabs

### Common Issues

**No transcriptions appearing?**
- Ensure Jitsi transcription is enabled in conference settings
- Check browser console for errors

**No translations in database?**
- Check `GEMINI_API_KEY` is set correctly
- Check browser console for API errors
- Verify Supabase connection

**No audio playback?**
- Check browser audio permissions
- Verify `read_aloud_enabled` is `true`
- Check console for TTS engine errors

## Future Work

The following features are planned per the original spec but not yet implemented:

1. **Settings UI**
   - Add controls to `react/features/settings/components/web/MoreTab.tsx`
   - Language selector dropdown
   - TTS engine radio buttons
   - Voice ID input field
   - Read-aloud toggle

2. **Integration Hook into Subtitles**
   - Currently, transcripts must be manually triggered
   - Need to add hook in `react/features/subtitles/middleware.ts`
   - Detect final segment boundaries and dispatch `finalizeTranscriptSegment` action

3. **Conference Lifecycle Integration**
   - Add subscription management in `Conference.tsx`
   - Initialize on mount, cleanup on unmount
   - Subscribe to user's preferred language

4. **Automated Testing**
   - Unit tests for services
   - Integration tests for middleware
   - E2E tests for full workflow

## Deployment

### Development

```bash
# Install dependencies (already done)
npm install

# Set environment variables
cp .env.example .env
# Edit .env with your keys

# Run dev server
make dev
```

### Production

Ensure all environment variables are set in your production environment (Vercel, Heroku, etc.):

```bash
SUPABASE_URL=...
SUPABASE_ANON_KEY=...
GEMINI_API_KEY=...
ELEVENLABS_API_KEY=...  # optional
CARTESIA_API_KEY=...     # optional
```

Build:
```bash
make compile
```

## Security Considerations

- **API Keys**: Currently exposed to client. For production, consider proxying sensitive operations through a backend.
- **RLS Policies**: Enable Row Level Security on Supabase tables for multi-tenant deployments.
- **Rate Limiting**: Implement rate limiting on translation API calls to prevent abuse.

## Support

For issues or questions, contact Eburon Development.

## License

Follows Orbit Conference (Jitsi Meet) licensing.
