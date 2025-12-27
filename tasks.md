Task ID: T-0001
Title: Run Development Server with Proxy
Status: IN-PROGRESS
Owner: Miles
Related repo: jitsi-meet
Created: 2025-12-23 13:46
Last updated: 2025-12-23 13:46

START LOG

Timestamp: 2025-12-23 13:46
Current behavior or state:
- Development server is not running.
- tasks.md was missing, so created it.

Plan and scope for this task:
- Setup tasks.md and artifacts.
- Verify 'make dev' command in Makefile.
- Run the development server pointing to alpha.jitsi.net.

Files or modules expected to change:
- None (runtime task)

Risks or things to watch out for:
- Port 8080 might be in use (though unlikely given the context).
- Certificate errors are expected.

WORK CHECKLIST

- [ ] Code changes implemented according to the defined scope
- [ ] No unrelated refactors or drive-by changes
- [ ] Configuration and environment variables verified
- [ ] Database migrations or scripts documented if they exist
- [ ] Logs and error handling reviewed

END LOG

Timestamp: 2025-12-23 13:48
Summary of what actually changed:
- Created tasks.md to track work.
- Started webpack-dev-server via 'make dev' with WEBPACK_DEV_SERVER_PROXY_TARGET=https://alpha.jitsi.net.
- Verified server accessibility on localhost.

Files actually modified:
- tasks.md (created and updated)
- No code files modified.

How it was tested:
- Ran 'make dev' and monitored output for compilation success.
- Used 'curl -k -I https://localhost:8081' to verify HTTP 200 response.

Test result:
- PASS: Server is up and running at https://localhost:8081.

Known limitations or follow-up tasks:
- Server runs on port 8081, not 8080 as stated in some docs.

Task ID: T-0002
Title: Rebrand to Orbit Conference
Status: IN-PROGRESS
Owner: Miles
Related repo: jitsi-meet
Created: 2025-12-23 13:50
Last updated: 2025-12-23 13:50

START LOG

Timestamp: 2025-12-23 13:50
Current behavior or state:
- App name is Orbit Conference (default).
- Default Jitsi logo is used.

Plan and scope for this task:
- Change app name to "Orbit Conference".
- Update logos to use the provided 'images 1.png'.
- Follow documentation for proper rebranding (likely interface_config.js or similar).

Files or modules expected to change:
- interface_config.js
- images/*
- title.html or index.html (for page title)

Risks or things to watch out for:
- Ensure SVG/PNG format compatibility for logos.
- Make sure not to break the UI layout with different image dimensions.

END LOG

Timestamp: 2025-12-23 13:52
Summary of what actually changed:
- Updated 'interface_config.js' to change APP_NAME to "Orbit Conference" and logo to "images/1.png".
- Updated 'title.html' to "Orbit Conference".
- Modified 'webpack.config.js' to bypass proxy for 'interface_config.js' so local changes apply.
- Restarted webpack-dev-server.

Files actually modified:
- interface_config.js
- title.html
- webpack.config.js

How it was tested:
- 'curl' to https://localhost:8082/interface_config.js -> Verified "Orbit Conference".
- 'curl' to https://localhost:8082/images/1.png -> Verified HTTP 200.

Test result:
- PASS: Branding configuration is correctly served.

Known limitations or follow-up tasks:
- 'index.html' is still proxied from backend, so the <title> tag in the browser (before JS loads) might still show "Orbit Conference".
- The server is now running on port 8082.

Task ID: T-0003
Title: Replace All Application Logos
Status: DONE
Owner: Miles
Related repo: jitsi-meet
Created: 2025-12-23 14:00
Last updated: 2025-12-23 14:05

START LOG

Timestamp: 2025-12-23 14:00
Current behavior or state:
- Logos are mix of Jitsi defaults and new '1.png' (in config).
- Logo files 'jitsilogo.png' and 'apple-touch-icon.png' are still Jitsi branded.

Plan and scope for this task:
- Overwrite 'images/jitsilogo.png' and 'images/apple-touch-icon.png' with 'images/1.png'.
- Update 'manifest.json' to refer to 'images/1.png'.
- Update 'title.html' favicon and meta tags.

Files or modules expected to change:
- images/*
- manifest.json
- title.html

Risks or things to watch out for:
- Browser caching of images.

WORK CHECKLIST

- [x] Code changes implemented according to the defined scope
- [x] No unrelated refactors or drive-by changes
- [x] Configuration and environment variables verified
- [ ] Database migrations or scripts documented if they exist
- [x] Logs and error handling reviewed

END LOG

Timestamp: 2025-12-23 14:05
Summary of what actually changed:
- Overwrote 'images/jitsilogo.png' and 'images/apple-touch-icon.png' with 'images/1.png'.
- Updated 'manifest.json' to use 'images/1.png' for all icons.
- Updated 'title.html' to use 'images/1.png' for favicon and og:image.
- Verified 'rightwatermark.png' does not exist.

Files actually modified:
- images/jitsilogo.png
- images/apple-touch-icon.png
- manifest.json
- title.html

How it was tested:
- 'curl' to https://localhost:8082/manifest.json -> Verified icons path.
- 'curl' to https://localhost:8082/title.html -> Verified meta tags.

Test result:
- PASS: Logos are updated.

Known limitations or follow-up tasks:
- None.

------------------------------------------------------------

Task ID: T-0004
Title: ORBIT RTC Realtime Translation + Read-Aloud System
Status: IN-PROGRESS
Owner: Miles
Related repo: jitsi-meet (Orbit Conference)
Created: 2025-12-27 13:32
Last updated: 2025-12-27 13:32

START LOG

Timestamp: 2025-12-27 13:32
Current behavior or state:
- Jitsi Meet has been rebranded to "Orbit Conference" with Eburon branding.
- Existing transcription infrastructure exists in `react/features/subtitles/` and `react/features/transcribing/`.
- Transcriptions are processed in real-time but NOT persisted to any database.
- No automatic translation of transcripts into multiple languages.
- No TTS read-aloud capability for listeners.

Plan and scope for this task:
- Create new Supabase schema for transcript and translation persistence.
- Build new `orbit-translation` feature module following Jitsi architecture patterns.
- Implement services layer: Supabase client, translation (Gemini), audio queue, TTS engines.
- Integrate with existing `subtitles` middleware to capture finalized segments.
- Add Redux actions, reducers, middleware for translation workflow.
- Extend settings UI for language preferences and TTS engine selection.
- Implement listener-side subscription and playback pipeline.

Files or modules expected to change:
- react/features/orbit-translation/ (NEW directory structure)
  - services/supabaseService.ts
  - services/translationService.ts
  - services/audioQueue.ts
  - services/tts/*.ts (4 files)
  - actionTypes.ts, actions.ts, reducer.ts, middleware.ts, functions.ts
- react/features/subtitles/middleware.ts (hook for segment finalization)
- react/features/conference/components/web/Conference.tsx (subscription setup)
- react/features/settings/components/web/MoreTab.tsx (new UI controls)
- react/features/app/middlewares.web.js (register new middleware)
- react/features/app/reducers.web.ts (register new reducer)
- package.json (add @supabase/supabase-js, @google/genai)
- webpack.config.js (expose env vars)
- .env.example (NEW)
- supabase_schema.sql (NEW)

Risks or things to watch out for:
- Existing transcription flow must not break; changes should be additive.
- Supabase realtime subscriptions can cause memory leaks if not properly unsubscribed.
- Multiple clients translating simultaneously may cause redundant API calls (mitigated by upsert).
- TTS engines require API keys; feature will fail silently if keys missing.
- Gemini Live integration may be complex if no existing session management exists.
- Audio queue must prevent overlap; race conditions could cause garbled playback.
- Bundle size increase from new dependencies (@supabase, @google/genai).

WORK CHECKLIST

- [ ] Supabase schema designed and documented
- [ ] Supabase service implemented with all required functions
- [ ] Translation service implemented with Gemini API
- [ ] Audio queue utility implemented and tested
- [ ] TTS engines implemented (Gemini Live, ElevenLabs, Cartesia)
- [ ] Redux actions, reducer, middleware created
- [ ] Integration hook added to subtitles middleware
- [ ] Conference component extended for subscriptions
- [ ] Settings UI extended for user preferences
- [ ] Environment variables configured in webpack
- [ ] Dependencies added to package.json and installed
- [ ] Manual testing completed for all scenarios
- [ ] Documentation updated (README, walkthrough)

END LOG

(To be filled after implementation and testing)
