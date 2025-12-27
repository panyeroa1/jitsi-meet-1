import { Theme } from '@mui/material';
import clsx from 'clsx';
import React from 'react';
import { WithTranslation } from 'react-i18next';
import { withStyles } from 'tss-react/mui';

import AbstractDialogTab, {
    IProps as AbstractDialogTabProps
} from '../../../base/dialog/components/web/AbstractDialogTab';
import { translate } from '../../../base/i18n/functions';
import Checkbox from '../../../base/ui/components/web/Checkbox';
import Input from '../../../base/ui/components/web/Input';
import Select from '../../../base/ui/components/web/Select';
import { MAX_ACTIVE_PARTICIPANTS } from '../../../filmstrip/constants';
import type { TtsEngineName } from '../../../orbit-translation/services/tts/types';

/**
 * The type of the React {@code Component} props of {@link MoreTab}.
 */
export interface IProps extends AbstractDialogTabProps, WithTranslation {

    /**
     *  Indicates if closed captions are enabled.
     */
    areClosedCaptionsEnabled: boolean;

    /**
     * CSS classes object.
     */
    classes?: Partial<Record<keyof ReturnType<typeof styles>, string>>;

    /**
     * The currently selected language to display in the language select
     * dropdown.
     */
    currentLanguage: string;

    /**
     * Whether to show hide self view setting.
     */
    disableHideSelfView: boolean;

    /**
     * Whether or not follow me is currently active (enabled by some other participant).
     */
    followMeActive: boolean;

    /**
     * Whether or not to hide self-view screen.
     */
    hideSelfView: boolean;

    /**
     * Whether we are in visitors mode.
     */
    iAmVisitor: boolean;

    /**
     * All available languages to display in the language select dropdown.
     */
    languages: Array<string>;

    /**
     * The number of max participants to display on stage.
     */
    maxStageParticipants: number;

    /**
     * Orbit translation preferred language (listener side).
     */
    orbitPreferredLang: string;

    /**
     * Orbit translation read-aloud enabled (listener side).
     */
    orbitReadAloudEnabled: boolean;

    /**
     * Orbit translation TTS engine.
     */
    orbitTtsEngine: TtsEngineName;

    /**
     * Orbit translation voice ID/name (engine-specific).
     */
    orbitVoiceId: string;

    /**
     * Whether or not to display the language select dropdown.
     */
    showLanguageSettings: boolean;

    /**
     * Whether or not to display moderator-only settings.
     */
    showModeratorSettings: boolean;

    /**
     * Whether orbit translation settings should be shown.
     */
    showOrbitTranslationSettings: boolean;

    /**
     * Whether or not to show subtitles on stage.
     */
    showSubtitlesOnStage: boolean;

    /**
     * Whether or not the stage filmstrip is enabled.
     */
    stageFilmstripEnabled: boolean;
}

const styles = (theme: Theme) => {
    return {
        container: {
            display: 'flex',
            flexDirection: 'column' as const,
            padding: '0 2px'
        },

        divider: {
            margin: `${theme.spacing(4)} 0`,
            width: '100%',
            height: '1px',
            border: 0,
            backgroundColor: theme.palette.ui03
        },

        checkbox: {
            margin: `${theme.spacing(3)} 0`
        }
    };
};

/**
 * React {@code Component} for modifying language and moderator settings.
 *
 * @augments Component
 */
class MoreTab extends AbstractDialogTab<IProps, any> {
    /**
     * Initializes a new {@code MoreTab} instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props: IProps) {
        super(props);

        // Bind event handler so it is only bound once for every instance.
        this._renderMaxStageParticipantsSelect = this._renderMaxStageParticipantsSelect.bind(this);
        this._onMaxStageParticipantsSelect = this._onMaxStageParticipantsSelect.bind(this);
        this._onHideSelfViewChanged = this._onHideSelfViewChanged.bind(this);
        this._onShowSubtitlesOnStageChanged = this._onShowSubtitlesOnStageChanged.bind(this);
        this._onLanguageItemSelect = this._onLanguageItemSelect.bind(this);
        this._onOrbitReadAloudChanged = this._onOrbitReadAloudChanged.bind(this);
        this._onOrbitPreferredLangSelect = this._onOrbitPreferredLangSelect.bind(this);
        this._onOrbitTtsEngineSelect = this._onOrbitTtsEngineSelect.bind(this);
        this._onOrbitVoiceIdChanged = this._onOrbitVoiceIdChanged.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    override render() {
        const {
            areClosedCaptionsEnabled,
            disableHideSelfView,
            iAmVisitor,
            hideSelfView,
            showOrbitTranslationSettings,
            showLanguageSettings,
            showSubtitlesOnStage,
            t
        } = this.props;
        const classes = withStyles.getClasses(this.props);

        return (
            <div
                className = { clsx('more-tab', classes.container) }
                key = 'more'>
                {this._renderMaxStageParticipantsSelect()}
                {!disableHideSelfView && !iAmVisitor && (
                    <Checkbox
                        checked = { hideSelfView }
                        className = { classes.checkbox }
                        label = { t('videothumbnail.hideSelfView') }
                        name = 'hide-self-view'
                        onChange = { this._onHideSelfViewChanged } />
                )}
                {areClosedCaptionsEnabled && <Checkbox
                    checked = { showSubtitlesOnStage }
                    className = { classes.checkbox }
                    label = { t('settings.showSubtitlesOnStage') }
                    name = 'show-subtitles-button'
                    onChange = { this._onShowSubtitlesOnStageChanged } /> }
                {showLanguageSettings && this._renderLanguageSelect()}
                {showOrbitTranslationSettings && (
                    <>
                        <hr className = { classes.divider } />
                        {this._renderOrbitTranslationSettings()}
                    </>
                )}
            </div>
        );
    }

    /**
     * Callback invoked to select a max number of stage participants from the select dropdown.
     *
     * @param {Object} e - The key event to handle.
     * @private
     * @returns {void}
     */
    _onMaxStageParticipantsSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const maxParticipants = Number(e.target.value);

        super._onChange({ maxStageParticipants: maxParticipants });
    }

    /**
     * Callback invoked to select if hide self view should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onHideSelfViewChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        super._onChange({ hideSelfView: checked });
    }

    /**
     * Callback invoked to select if show subtitles button should be enabled.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onShowSubtitlesOnStageChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        super._onChange({ showSubtitlesOnStage: checked });
    }

    /**
     * Callback invoked to select a language from select dropdown.
     *
     * @param {Object} e - The key event to handle.
     *
     * @returns {void}
     */
    _onLanguageItemSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        const language = e.target.value;

        super._onChange({ currentLanguage: language });
    }

    /**
     * Callback invoked to toggle orbit translation read-aloud.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onOrbitReadAloudChanged({ target: { checked } }: React.ChangeEvent<HTMLInputElement>) {
        super._onChange({ orbitReadAloudEnabled: checked });
    }

    /**
     * Callback invoked to change orbit translation preferred language.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onOrbitPreferredLangSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        super._onChange({ orbitPreferredLang: e.target.value });
    }

    /**
     * Callback invoked to change orbit translation TTS engine.
     *
     * @param {Object} e - The key event to handle.
     * @returns {void}
     */
    _onOrbitTtsEngineSelect(e: React.ChangeEvent<HTMLSelectElement>) {
        super._onChange({ orbitTtsEngine: e.target.value as TtsEngineName });
    }

    /**
     * Callback invoked to change orbit translation voice ID/name.
     *
     * @param {string} value - The new voice ID/name.
     * @returns {void}
     */
    _onOrbitVoiceIdChanged(value: string) {
        super._onChange({ orbitVoiceId: value });
    }

    /**
     * Returns the React Element for the max stage participants dropdown.
     *
     * @returns {ReactElement}
     */
    _renderMaxStageParticipantsSelect() {
        const { maxStageParticipants, t, stageFilmstripEnabled } = this.props;

        if (!stageFilmstripEnabled) {
            return null;
        }
        const maxParticipantsItems = Array(MAX_ACTIVE_PARTICIPANTS).fill(0)
            .map((no, index) => {
                return {
                    value: index + 1,
                    label: `${index + 1}`
                };
            });

        return (
            <Select
                id = 'more-maxStageParticipants-select'
                label = { t('settings.maxStageParticipants') }
                onChange = { this._onMaxStageParticipantsSelect }
                options = { maxParticipantsItems }
                value = { maxStageParticipants } />
        );
    }

    /**
     * Returns the menu item for changing displayed language.
     *
     * @private
     * @returns {ReactElement}
     */
    _renderLanguageSelect() {
        const {
            currentLanguage,
            languages,
            t
        } = this.props;

        const languageItems
            = languages.map((language: string) => {
                return {
                    value: language,
                    label: t(`languages:${language}`)
                };
            });

        return (
            <Select
                id = 'more-language-select'
                label = { t('settings.language') }
                onChange = { this._onLanguageItemSelect }
                options = { languageItems }
                value = { currentLanguage } />
        );
    }

    /**
     * Returns UI for orbit translation preferences (read-aloud).
     *
     * @private
     * @returns {ReactElement}
     */
    _renderOrbitTranslationSettings() {
        const {
            orbitPreferredLang,
            orbitReadAloudEnabled,
            orbitTtsEngine,
            orbitVoiceId,
            languages,
            t
        } = this.props;

        const languageItems = languages.map((language: string) => ({
            value: language,
            label: t(`languages:${language}`)
        }));

        const engineItems = [
            { value: 'gemini_live', label: t('settings.orbitTranslationEngineGeminiLive') },
            { value: 'elevenlabs', label: t('settings.orbitTranslationEngineElevenLabs') },
            { value: 'cartesia', label: t('settings.orbitTranslationEngineCartesia') }
        ];

        return (
            <>
                <Checkbox
                    checked = { orbitReadAloudEnabled }
                    label = { t('settings.orbitTranslationReadAloud') }
                    name = 'orbit-translation-read-aloud'
                    onChange = { this._onOrbitReadAloudChanged } />
                <Select
                    id = 'orbit-translation-language-select'
                    label = { t('settings.orbitTranslationLanguage') }
                    onChange = { this._onOrbitPreferredLangSelect }
                    options = { languageItems }
                    value = { orbitPreferredLang } />
                <Select
                    id = 'orbit-translation-tts-engine-select'
                    label = { t('settings.orbitTranslationTtsEngine') }
                    onChange = { this._onOrbitTtsEngineSelect }
                    options = { engineItems }
                    value = { orbitTtsEngine } />
                <Input
                    id = 'orbit-translation-voice-id'
                    label = { t('settings.orbitTranslationVoiceId') }
                    name = 'orbit-translation-voice-id'
                    onChange = { this._onOrbitVoiceIdChanged }
                    placeholder = { t('settings.orbitTranslationVoiceIdPlaceholder') }
                    type = 'text'
                    value = { orbitVoiceId } />
            </>
        );
    }
}

export default withStyles(translate(MoreTab), styles);
