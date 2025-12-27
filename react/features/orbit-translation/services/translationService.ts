// orbit-rtc/react/features/orbit-translation/services/translationService.ts
// Gemini-based translation and language enforcement
// Owner: Miles (Eburon Development)

import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = (process.env.GEMINI_API_KEY || process.env.API_KEY || '') as string;

if (!apiKey) {
    console.warn('GEMINI_API_KEY not configured - translation service will fail');
}

const genAI = new GoogleGenerativeAI(apiKey);

type TranslateArgs = {
    // e.g. "en", "fr-BE", "nl-BE", "tl-PH"
    sourceLang?: string;
    targetLang: string;
    text: string; // optional
};

export async function translateText(args: TranslateArgs): Promise<string> {
    const { text, targetLang, sourceLang } = args;

    // Strict prompt: translate only, no headers, no quotes, preserve meaning/tone
    const prompt = [
        'You are a professional realtime interpreter.',
        `Translate the user's text into ${targetLang}.`,
        sourceLang ? `The source language is ${sourceLang}.` : 'Detect the source language automatically.',
        'Rules:',
        '- Output ONLY the translated text. No labels, no quotes, no explanations.',
        '- Preserve meaning, tone, and intent.',
        `- Keep it natural for native speakers of ${targetLang}.`,
        '',
        'TEXT:',
        text
    ].join('\n');

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const translatedText = response.text()?.trim() ?? '';

        return translatedText;
    } catch (error: any) {
        console.error('Translation failed:', error);
        throw new Error(`Translation failed: ${error.message}`);
    }
}

export async function ensureTargetLanguage(text: string, targetLang: string): Promise<string> {
    // Use a rewrite step that forces target language without adding meta
    const prompt = [
        `Rewrite the text so it is strictly in ${targetLang}.`,
        'Rules:',
        '- Output ONLY the rewritten text.',
        '- Do NOT mention translation or language.',
        '- Preserve the meaning, tone, emotion, and intent.',
        `- Make it sound native and natural for ${targetLang}.`,
        '',
        'TEXT:',
        text
    ].join('\n');

    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent(prompt);
        const response = await result.response;

        return (response.text() ?? '').trim();
    } catch (error: any) {
        console.error('Language enforcement failed:', error);
        throw new Error(`Language enforcement failed: ${error.message}`);
    }
}
