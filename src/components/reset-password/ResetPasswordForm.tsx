"use client";

import { useActionState, useEffect, useState } from 'react';
import { EyeIcon, EyeOff, Globe } from 'lucide-react';
import { resetPasswordAction, resetPasswordStates } from '@/server/ResetPasswordAction';
import InputMessageError from '../ui/InputMessageError';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useDir, useLocale, useTranslations } from '@/i18n/IntlProvider';

const ResetPasswordForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const locale = useLocale();
    const dir = useDir();
    const t = useTranslations("ResetPassword");

    const initialState: resetPasswordStates = {
        success: false,
        message: "",
        formData: new FormData(),
        error: null
    }
    const [state, action, isPending] = useActionState(resetPasswordAction, initialState);

    const translateValidationMessage = (message?: string) => {
        switch (message) {
            case "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character":
            case "Invalid password format":
                return t("errorPasswordRequirements");
            default:
                return t("errorPasswordRequirements");
        }
    };

    const translateToastMessage = (message: string, fallbackKey: string) => {
        switch (message) {
            case "Password reset successfully":
                return t("toastSuccess");
            case "Failed to reset password":
                return t("toastFailed");
            case "Invalid password format":
                return t("errorPasswordRequirements");
            case "Internal server error":
                return t("toastServerError");
            default:
                return message || t(fallbackKey);
        }
    };

    const handleLocaleChange = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
    };

    // Show toast notifications based on the reset password state
    useEffect(() => {
        if (state.success && state.message && !isPending) {
            router.replace("/login");
            toast.success(translateToastMessage(state.message, "toastSuccess"));
        }
        if (!state.success && state.message && !isPending) {
            toast.error(translateToastMessage(state.message, "toastFailed"));
        }
    }, [state.success, state.message, isPending, router, t]);

    // for get userId and code form URL
    const searchParams = useSearchParams();
    const userId = searchParams.get('userId');
    const code = searchParams.get('code');
    return (
        <div className="min-h-screen w-full bg-[url('/login_img.png')] bg-cover bg-center flex items-center justify-center" dir={dir}>

            <div className="container mx-auto px-2 py-10 rounded-2xl overflow-hidden">

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="w-87.5 p-2 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xs shadow-xl border border-white/40">
                        <div className="mb-5 flex justify-end">
                            <label className="sr-only" htmlFor="reset-password-language">
                                {t("language")}
                            </label>
                            <div className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-gray-800">
                                <Globe size={16} className="text-gray-500" />
                                <select
                                    id="reset-password-language"
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
                            {/* these inputs for send userId and code form URL */}
                            <input type="hidden" name='userId' value={userId as string} />
                            <input type="hidden" name='code' value={code as string} />

                            <div className="relative">
                                <div>
                                    <label className="text-white text-sm block mb-1">
                                        {t("passwordLabel")}
                                    </label>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        placeholder={t("passwordPlaceholder")}
                                        name="password"
                                        className="w-full p-3 rounded-md bg-white text-gray-700 outline-none pe-10"
                                        defaultValue={state.formData.get("password") as string}
                                    />
                                    {state.error && state.error.password && <InputMessageError message={translateValidationMessage(state.error.password[0])} />}
                                </div>
                                {
                                    showPassword ? (
                                        <EyeOff
                                            size={20}
                                            onClick={() => setShowPassword(false)}
                                            aria-label={t("hidePassword")}
                                            className={`absolute ${dir === "rtl" ? "left-3" : "right-3"} top-9 cursor-pointer text-black`}
                                        />
                                    ) : (
                                        <EyeIcon
                                            size={20}
                                            onClick={() => setShowPassword(true)}
                                            aria-label={t("showPassword")}
                                            className={`absolute ${dir === "rtl" ? "left-3" : "right-3"} top-9 cursor-pointer text-black`}
                                        />
                                    )
                                }
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
                                    t("reset")
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

export default ResetPasswordForm
