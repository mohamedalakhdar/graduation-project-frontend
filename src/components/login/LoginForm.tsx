"use client";

import { useActionState, useEffect, useState } from "react";
import InputMessageError from "../ui/InputMessageError";
import { loginAction, loginStates } from "@/server/LoginAction";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { EyeIcon, EyeOff, Globe } from "lucide-react";
import Link from "next/link";
import { verifyToken } from "@/utils/verifyToken";
import { useDir, useLocale, useTranslations } from "@/i18n/IntlProvider";
import { Roles } from "@/enums";

interface IProps {
    token: string;
}

const hasRole = (roles: string, role: string) => {
    return roles
        .split(',')
        .map((item) => item.trim())
        .includes(role);
};

const LoginForm = ({ token }: IProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const locale = useLocale();
    const dir = useDir();
    const t = useTranslations("Login");

    const initialState: loginStates = {
        success: false,
        message: "",
        formData: new FormData(),
        error: null,
        token: undefined,
    };
    const [state, action, isPending] = useActionState(loginAction, initialState)

    const translateValidationMessage = (message?: string) => {
        switch (message) {
            case "LOGIN_INVALID_EMAIL":
                return t("errorInvalidEmail");
            case "LOGIN_PASSWORD_REQUIRED":
                return t("errorPasswordRequired");
            default:
                return t("toastInvalidCredentials");
        }
    };

    const handleLocaleChange = (newLocale: string) => {
        document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
        window.location.reload();
    };

    // Show toast notifications based on the login state
    useEffect(() => {
        if (state.success && state.message && !isPending) {
            toast.success(t("toastSuccess"));
            
            // verify token and get roles, then set roles state
            const decodedToken = verifyToken(state.token || token);
            const roles = decodedToken?.roles || "Student";

            // redirect based on its roles
            if (hasRole(roles, Roles.Student)) {
                router.replace("/")
            } else if (hasRole(roles, Roles.Admin)) {
                router.replace("/admin")
            } else if (hasRole(roles, Roles.Advisor) || hasRole(roles, Roles.Teacher) || hasRole(roles, Roles.Professor)) {
                router.replace("/professor/dashboard")
            } else {
                router.replace("/")
            }
        }
        if (!state.success && state.message && !isPending) {
            toast.error(t("toastFailed"));
        }
    }, [state.success, state.message, state.token, isPending, router, token, t]);

    return (
        <div className="min-h-screen w-full bg-[url('/login_img.png')] bg-cover bg-center flex items-center justify-center" dir={dir}>

            <div className="container mx-auto px-2 py-10 rounded-2xl overflow-hidden">

                <div className="relative z-10 flex items-center justify-center h-full">
                    <div className="w-87.5 p-2 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xs shadow-xl border border-white/40">
                        <div className="mb-5 flex justify-end">
                            <label className="sr-only" htmlFor="login-language">
                                {t("language")}
                            </label>
                            <div className="flex items-center gap-1.5 rounded-md bg-white/90 px-2 py-1 text-gray-800">
                                <Globe size={16} className="text-gray-500" />
                                <select
                                    id="login-language"
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

                        <h2 className="text-white text-center text-2xl font-semibold mb-6">{t("title")}</h2>

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
                                />
                                {state.error && state.error.email && <InputMessageError message={translateValidationMessage(state.error.email[0])} />}
                            </div>

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

                            <Link href="/forgot-password" className="text-sm text-gray-700 hover:text-gray-900 hover:underline -mt-3 block text-end">
                                {t("forgotPassword")}
                            </Link>

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
                                    t("signIn")
                                )}
                            </button>

                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LoginForm;
