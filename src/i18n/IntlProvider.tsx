'use client';

import React, { createContext, useContext, useMemo, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
type Messages = Record<string, unknown>;

interface LocaleContextValue {
    locale: string;
    dir: 'ltr' | 'rtl';
    messages: Messages;
}

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------
const LocaleContext = createContext<LocaleContextValue>({
    locale: 'en',
    dir: 'ltr',
    messages: {},
});

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------
export interface IntlProviderProps {
    locale: string;
    messages: Messages;
    children: React.ReactNode;
}

export function IntlProvider({ locale, messages, children }: IntlProviderProps) {
    const value = useMemo(
        () => ({
            locale,
            dir: (locale === 'ar' ? 'rtl' : 'ltr') as 'ltr' | 'rtl',
            messages,
        }),
        [locale, messages]
    );
    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
export function useLocale(): string {
    return useContext(LocaleContext).locale;
}

export function useDir(): 'ltr' | 'rtl' {
    return useContext(LocaleContext).dir;
}

/** Returns a typed t() function for a given namespace (dot-notation key lookup). */
export function useTranslations(namespace?: string) {
    const { messages } = useContext(LocaleContext);

    return useCallback(
        (key: string, values?: Record<string, string | number>): string => {
            const fullKey = namespace ? `${namespace}.${key}` : key;
            const parts = fullKey.split('.');

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let value: any = messages;
            for (const part of parts) {
                if (value && typeof value === 'object') {
                    value = (value as Record<string, unknown>)[part];
                } else {
                    value = undefined;
                    break;
                }
            }

            if (value === undefined || value === null) {
                return key; // graceful fallback
            }

            let result = String(value);

            if (values) {
                result = result.replace(/\{(\w+)\}/g, (match, p1) =>
                    values[p1] !== undefined ? String(values[p1]) : match
                );
            }

            return result;
        },
        [messages, namespace]
    );
}
