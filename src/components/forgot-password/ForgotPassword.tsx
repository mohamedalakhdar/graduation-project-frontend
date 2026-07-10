"use client";

import { useActionState, useCallback, useEffect, useState } from 'react'
import { forgotPasswordAction, forgotPasswordStates } from '@/server/ForgotPasswordAction'
import InputMessageError from '../ui/InputMessageError';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Globe } from 'lucide-react';
import Link from 'next/link';
import { useDir, useLocale, useTranslations } from '@/i18n/IntlProvider';

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const router = useRouter();
    const locale = useLocale();
    const dir = useDir();
    const t = useTranslations("ForgotPassword");

    const initialState: forgotPasswordStates = {
        success: false,
        message: "",
        formData: new FormData(),
        error: null
    };

    const [state, action, isPending] = useActionState(forgotPasswordAction, initialState);

    const translateValidationMessage = (message?: string) => {
        switch (message) {
            case "Invalid email address":
            case "Invalid email format":
                return t("errorInvalidEmail");
            default:
                return t("errorInvalidEmail");
        }
    };

    const translateToastMessage = useCallback((message: string, fallbackKey: string) => {
        switch (message) {
            case "Password reset email sent successfully":
                return t("toastSuccess");
            case "Failed to send password reset email":
                return t("toastFailed");
            case "Invalid email format":
                return t("errorInvalidEmail");
            case "Internal server error":
                return t("toastServerError");
            default:
                return message || t(fallbackKey);
        }
    }, [t]);

    const handleLocaleChange = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
    };

    // Show toast notifications based on the forgot password state
    useEffect(() => {
        if (state.success && state.message && !isPending) {
            router.replace("/confirmed-done")
            toast.success(translateToastMessage(state.message, "toastSuccess"));
        }
        if (!state.success && state.message && !isPending) {
            toast.error(translateToastMessage(state.message, "toastFailed"));
        }
    }, [state.success, state.message, isPending, router, translateToastMessage]);

    if (state.success && state.message && !isPending) {
        localStorage.setItem("email", email);
    }

    return (
        <div className="min-h-screen w-full bg-[url('/login_img.png')] bg-cover bg-center flex items-center justify-center" dir={dir}>

            <div className="container mx-auto px-2 py-10 rounded-2xl overflow-hidden">

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="w-87.5 p-2 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xs shadow-xl border border-white/40">
                        <div className="mb-5 flex justify-end">
                            <label className="sr-only" htmlFor="forgot-password-language">
                                {t("language")}
                            </label>
                            <div className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-gray-800">
                                <Globe size={16} className="text-gray-500" />
                                <select
                                    id="forgot-password-language"
                                    value={locale}
                                    onChange={(e) => handleLocaleChange(e.target.value)}
                                    className="bg-transparent text-sm outline-none"
                                    aria-label={t("language")}
                                >
                                    <option value="en">{t("languageEnglish")}</option>
                                    <option value="ar">{t("languageArabic")}</option>
                                </select>
                            </div>
                        </div>

                        <h2 className="text-white text-center text-2xl font-semibold mb-2">{t("title")}</h2>
                        <p className="mb-6 text-center text-sm text-white/90">{t("subtitle")}</p>

                        <form action={action} className="space-y-4">

                            <div>
                                <label className="text-white text-sm block mb-1">
                                    {t("emailLabel")}
                                </label>
                                <input
                                    type="email"
                                    placeholder={t("emailPlaceholder")}
                                    name="email"
                                    className="w-full p-3 rounded-md bg-white text-gray-700 outline-none"
                                    defaultValue={state.formData.get("email") as string}
                                    autoFocus
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                {state.error && state.error.email && <InputMessageError message={translateValidationMessage(state.error.email[0])} />}
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-[#00284d] text-white py-3 rounded-md mt-3 hover:bg-[#003465] transition cursor-pointer"
                            >
                                {isPending ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                        <span>{t("loading")}</span>
                                    </span>
                                ) : (
                                    t("sendResetLink")
                                )}
                            </button>

                            <Link href="/login" className="text-sm text-gray-700 hover:text-gray-900 hover:underline block text-center">
                                {t("backToLogin")}
                            </Link>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default ForgotPassword
