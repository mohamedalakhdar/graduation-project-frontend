"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

export default function ConfirmedDonePage() {
    const router = useRouter();
    const [seconds, setSeconds] = useState(120);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [toastType, setToastType] = useState<"success" | "error">("success");
    const [email, setEmail] = useState("");

    // Mask email
    const maskedEmail = email.replace(/(.{2}).+(@.+)/, "$1***$2");

    useEffect(() => {
        const storedEmail = localStorage.getItem("email") || "";
        setEmail(storedEmail);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (seconds > 0) {
            const timer = setTimeout(() => setSeconds(seconds - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [seconds]);

    // Clear toast after 4 seconds
    useEffect(() => {
        if (toastMessage) {
            const timer = setTimeout(() => setToastMessage(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [toastMessage]);

    const handleResend = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINTS_URL}/api/accounts/forget-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, baseUrl: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/reset-password` }),
            });

            if (response.ok) {
                setToastMessage("Email sent successfully!");
                setToastType("success");
                setSeconds(120);
            } else {
                setToastMessage("Failed to resend email. Please try again.");
                setToastType("error");
            }
        } catch (err) {
            console.error(err);
            setToastMessage("An error occurred. Please try again.");
            setToastType("error");
        } finally {
            setLoading(false);
        }
    };

    const handleBackToLogin = () => {
        router.replace("/login");
    };

    // Progress steps
    const steps = [
        { number: 1, label: "Enter email", completed: true },
        { number: 2, label: "Check inbox", completed: true, current: true },
        { number: 3, label: "Reset password", completed: false },
    ];

    return (
        <div className="min-h-screen w-full bg-[url('/login_img.png')] bg-cover bg-center flex items-center justify-center">

            <div className="min-h-screen flex items-center justify-center  px-4 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="w-full max-w-md"
                >
                    {/* Main Card */}
                    <div className="w-87.5 p-2 md:p-8 rounded-2xl bg-white/10 backdrop-blur-xs shadow-xl border border-white/90">
                        {/* Progress Indicator */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="flex items-center justify-between mb-8"
                            role="progressbar"
                            aria-valuenow={2}
                            aria-valuemin={1}
                            aria-valuemax={3}
                            aria-label="Password reset progress"
                        >
                            {steps.map((step, index) => (
                                <div key={step.number} className="flex items-center flex-1">
                                    {/* Step Circle */}
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 100,
                                            delay: 0.2 + index * 0.1,
                                        }}
                                        className={`flex h-8 w-8 items-center justify-center rounded-full font-medium text-xs transition-all ${step.completed
                                            ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                                            : step.current
                                                ? "bg-primary text-white"
                                                : "bg-gray-200 dark:bg-zinc-700 text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        {step.completed ? (
                                            <svg
                                                className="h-4 w-4"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        ) : (
                                            step.number
                                        )}
                                    </motion.div>

                                    {/* Connecting Line */}
                                    {index < steps.length - 1 && (
                                        <motion.div
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: 1 }}
                                            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                                            className={`mx-2 h-1 flex-1 rounded-full origin-left transition-colors ${step.completed
                                                ? "bg-green-200 dark:bg-green-900/50"
                                                : "bg-gray-200 dark:bg-zinc-700"
                                                }`}
                                        />
                                    )}

                                    {/* Label */}
                                    <div
                                        className={`ml-2 text-xs font-medium transition-colors hidden sm:block ${step.completed
                                            ? "text-green-700 dark:text-green-400"
                                            : step.current
                                                ? "text-primary"
                                                : "text-gray-500 dark:text-gray-400"
                                            }`}
                                    >
                                        {step.label}
                                    </div>

                                    {/* Mobile-only label */}
                                    {step.current && (
                                        <div className="ml-2 text-xs font-medium text-primary sm:hidden">
                                            {step.label}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </motion.div>

                        {/* Animated Success Icon */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 120, delay: 0.15 }}
                            className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-900/10"
                        >
                            <motion.svg
                                className="h-8 w-8 text-green-600 dark:text-green-400"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                viewBox="0 0 24 24"
                            >
                                {/* Email Envelope */}
                                <motion.g
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.4 }}
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                                    />
                                </motion.g>

                                {/* Checkmark */}
                                <motion.path
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, delay: 0.6 }}
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M20 7l-8 8m0 0l-8-8"
                                    strokeWidth="3"
                                />
                            </motion.svg>
                        </motion.div>

                        {/* Title */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="space-y-2 text-center"
                        >
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Check your email
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                                We&apos;ve sent a password reset link to
                            </p>
                            <p
                                className="font-semibold text-primary text-sm sm:text-base"
                                role="status"
                                aria-live="polite"
                            >
                                {maskedEmail}
                            </p>
                        </motion.div>

                        {/* Info Box */}
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 my-5"
                        >
                            <div className="flex gap-3">
                                <svg
                                    className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                <p className="text-xs sm:text-sm text-blue-800 dark:text-blue-300 leading-relaxed">
                                    The reset link may take a few minutes to arrive. If you don&apos;t
                                    see it, please check your spam folder.
                                </p>
                            </div>
                        </motion.div>

                        {/* Hint */}
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.35 }}
                            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center"
                        >
                            Didn&apos;t receive an email? Check your spam folder or try resending
                            below.
                        </motion.p>

                        {/* Action Buttons */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                            className="space-y-3 pt-2"
                        >
                            {/* Resend Button */}
                            <button
                                onClick={handleResend}
                                type="button"
                                disabled={seconds > 0 || loading}
                                aria-live="polite"
                                aria-label={
                                    loading
                                        ? "Sending email"
                                        : seconds > 0
                                            ? `Resend email in ${seconds} seconds`
                                            : "Resend email"
                                }
                                className={`w-full py-2.5 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${seconds > 0 || loading
                                    ? "bg-gray-100 dark:bg-zinc-800 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                    : "bg-green-500 text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    }`}
                            >
                                {loading && (
                                    <motion.svg
                                        className="h-4 w-4 animate-spin"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
                                    </motion.svg>
                                )}
                                <span>
                                    {loading
                                        ? "Sending..."
                                        : seconds > 0
                                            ? `Resend in ${seconds}s`
                                            : "Resend Email"}
                                </span>
                            </button>

                            {/* Back to Login Button */}
                            <button
                                onClick={handleBackToLogin}
                                className="w-full bg-[#00284d] text-white py-3 rounded-md mt-3 hover:bg-[#003465] transition cursor-pointer"
                            >
                                Back to Login
                            </button>
                        </motion.div>
                    </div>

                    {/* Toast Notification */}
                    <AnimatePresence>
                        {toastMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                transition={{ duration: 0.3 }}
                                role="alert"
                                className={`mt-4 p-4 rounded-lg font-medium text-sm flex items-center gap-3 ${toastType === "success"
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800"
                                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800"
                                    }`}
                            >
                                {toastType === "success" ? (
                                    <svg
                                        className="h-5 w-5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="h-5 w-5 flex-shrink-0"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                )}
                                {toastMessage}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
}
