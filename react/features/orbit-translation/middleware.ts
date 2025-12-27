// orbit-rtc/react/features/orbit-translation/middleware.ts
// Redux middleware for side effects
// Owner: Miles (Eburon Development)

import { AnyAction } from 'redux';

import type { IStore } from '../app/types';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import {
    TRANSCRIPT_SEGMENT_FINALIZED,
    TRANSLATION_RECEIVED,
    UPDATE_TTS_SETTINGS
} from './actionTypes';
import { ttsPlaybackEnded, ttsPlaybackStarted } from './actions';
import { MIN_SEGMENT_LENGTH } from './constants';
import { getTtsSettings } from './functions';
import logger from './logger';
import { AudioQueue } from './services/audioQueue';
import {
    fetchActiveParticipants,
    insertTranscriptSegment,
    updateParticipantSettings,
    upsertTranslationSegment
} from './services/supabaseService';
import { ensureTargetLanguage, translateText } from './services/translationService';
import { getTtsEngine } from './services/tts/getTtsEngine';

// Global audio queue instance (one per client)
const audioQueue = new AudioQueue();

MiddlewareRegistry.register((store: IStore) => (next: Function) => async (action: AnyAction) => {
    const result = next(action);

    switch (action.type) {
    case TRANSCRIPT_SEGMENT_FINALIZED:
        await _handleTranscriptFinalized(store, action);
        break;

    case TRANSLATION_RECEIVED:
        await _handleTranslationReceived(store, action);
        break;

    case UPDATE_TTS_SETTINGS:
        await _handleTtsSettingsUpdate(store, action);
        break;
    }

    return result;
});

async function _handleTranscriptFinalized(store: IStore, action: AnyAction) {
    const { segment } = action;

    // Validate segment
    if (!segment?.text || segment.text.length < MIN_SEGMENT_LENGTH) {
        logger.debug('Skipping short segment:', segment?.text);

        return;
    }

    try {
        // Persist transcript segment
        logger.info('Persisting transcript segment:', segment.text);
        const persistedSegment = await insertTranscriptSegment({
            roomId: segment.roomId,
            speakerId: segment.speakerId,
            speakerName: segment.speakerName,
            sourceLang: segment.sourceLang,
            text: segment.text,
            startMs: segment.startMs,
            endMs: segment.endMs,
            isFinal: segment.isFinal
        });

        logger.info('Transcript segment persisted with ID:', persistedSegment.id);

        // Fetch active participants to determine target languages
        const participants = await fetchActiveParticipants(segment.roomId);
        const targetLanguages = [ ...new Set(participants.map(p => p.preferred_lang)) ];

        logger.info('Translating to languages:', targetLanguages);

        // Translate to each target language
        for (const targetLang of targetLanguages) {
            // Skip if source and target are the same
            if (segment.sourceLang && segment.sourceLang === targetLang) {
                logger.debug('Skipping translation to same language:', targetLang);

                continue;
            }

            try {
                const translatedText = await translateText({
                    text: segment.text,
                    targetLang,
                    sourceLang: segment.sourceLang
                });

                logger.info(`Translated to ${targetLang}:`, translatedText);

                // Persist translation
                await upsertTranslationSegment({
                    roomId: segment.roomId,
                    segmentId: persistedSegment.id,
                    speakerId: segment.speakerId,
                    targetLang,
                    translatedText
                });

                logger.info(`Translation persisted for ${targetLang}`);
            } catch (error: any) {
                logger.error(`Translation failed for ${targetLang}:`, error);
            }
        }
    } catch (error: any) {
        logger.error('Failed to handle transcript finalization:', error);
    }
}

async function _handleTranslationReceived(store: IStore, action: AnyAction) {
    const { translation } = action;
    const state = store.getState();
    const ttsSettings = getTtsSettings(state);

    // Check if read-aloud is enabled
    if (!ttsSettings.readAloudEnabled) {
        logger.debug('Read-aloud disabled, skipping TTS');

        return;
    }

    // Check if translation matches preferred language
    if (translation.targetLang !== ttsSettings.preferredLang) {
        logger.debug('Translation language mismatch, skipping TTS');

        return;
    }

    try {
        // Apply language enforcement
        logger.info('Enforcing language for TTS:', translation.translatedText);
        const enforcedText = await ensureTargetLanguage(
            translation.translatedText,
            ttsSettings.preferredLang
        );

        logger.info('Enforced text:', enforcedText);

        // Enqueue for TTS playback
        audioQueue.enqueue(async () => {
            store.dispatch(ttsPlaybackStarted());

            try {
                const engine = getTtsEngine(ttsSettings.engine);

                logger.info(`Speaking with ${engine.name}:`, enforcedText);

                await engine.speak({
                    text: enforcedText,
                    targetLang: ttsSettings.preferredLang,
                    voiceId: ttsSettings.voiceId ?? undefined
                });

                logger.info('TTS playback complete');
            } catch (error: any) {
                logger.error('TTS playback failed:', error);
            } finally {
                store.dispatch(ttsPlaybackEnded());
            }
        });
    } catch (error: any) {
        logger.error('Failed to handle translation:', error);
    }
}

async function _handleTtsSettingsUpdate(store: IStore, action: AnyAction) {
    const { settings } = action;
    const state = store.getState();
    const conference = state['features/base/conference'].conference;

    // Get room ID and participant ID
    const roomId = conference?.getName() ?? '';
    const participantId = state['features/base/participants'].local?.id ?? '';

    if (!roomId || !participantId) {
        logger.warn('Cannot update settings: missing room or participant ID');

        return;
    }

    try {
        logger.info('Updating participant settings:', settings);

        await updateParticipantSettings(roomId, participantId, {
            preferredLang: settings.preferredLang,
            ttsEngine: settings.engine,
            voiceId: settings.voiceId,
            readAloudEnabled: settings.readAloudEnabled
        });

        logger.info('Settings updated successfully');

        // If engine changed, stop current playback
        if (settings.engine) {
            audioQueue.clear();
            logger.info('Audio queue cleared due to engine change');
        }
    } catch (error: any) {
        logger.error('Failed to update settings:', error);
    }
}
