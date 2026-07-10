import { cookies } from 'next/headers';

export const SUPPORTED_LOCALES = ['en', 'ar'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];

/** Read the locale from the NEXT_LOCALE cookie. Falls back to 'en'. */
export async function getLocale(): Promise<Locale> {
    try {
        const cookieStore = await cookies();
        const value = cookieStore.get('NEXT_LOCALE')?.value ?? 'en';
        return SUPPORTED_LOCALES.includes(value as Locale) ? (value as Locale) : 'en';
    } catch {
        return 'en';
    }
}

/** Load message JSON for the given locale. */
export async function getMessages(locale: Locale): Promise<Record<string, unknown>> {
    try {
        // Dynamic require at runtime (Node.js only — this runs in Server Components)
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const fs = require('fs') as typeof import('fs');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const path = require('path') as typeof import('path');
        const filePath = path.join(process.cwd(), 'messages', `${locale}.json`);
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch {
        return {};
    }
}
