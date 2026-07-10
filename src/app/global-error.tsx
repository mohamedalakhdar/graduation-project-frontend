"use client";

/**
 * Global Error Boundary
 * Catches unhandled errors and displays a user-friendly error page
 * With modern SaaS design, animations, and recovery options
 */

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RotateCcw, ArrowLeft, Home, Bug } from "lucide-react";
import { useRouter } from "next/navigation";

interface GlobalErrorProps {
    error: Error & { digest?: string };
    reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
    const router = useRouter();
    const [isRetrying, setIsRetrying] = useState(false);
    const [showDebugInfo, setShowDebugInfo] = useState(false);

    // Generate error ID from error properties
    const errorId = `ERR_${error.digest?.substring(0, 8).toUpperCase() || "DEBUG"}`;

    useEffect(() => {
        // In development, log to console
        if (process.env.NODE_ENV === "development") {
            console.error("Global Error:", error);
        }
    }, [error]);

    const handleRetry = async () => {
        setIsRetrying(true);
        // Small delay for UX
        await new Promise((resolve) => setTimeout(resolve, 600));
        reset();
        setIsRetrying(false);
    };

    const handleNavigateToDashboard = () => {
        router.push("/admin");
    };

    const handleNavigateHome = () => {
        router.push("/");
    };

    return (
        <div className="min-h-screen w-full overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-4 relative">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Gradient blobs */}
                <motion.div
                    className="absolute w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        x: [0, 100, 0],
                        y: [0, 50, 0],
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        top: "-10%",
                        left: "-5%",
                    }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        x: [0, -100, 0],
                        y: [0, -50, 0],
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        top: "50%",
                        right: "-10%",
                    }}
                />
                <motion.div
                    className="absolute w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 100, 0],
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                    style={{
                        bottom: "-10%",
                        left: "50%",
                    }}
                />
            </div>

            {/* Content */}
            <motion.div
                className="relative z-10 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
            >
                {/* Main error card */}
                <div className="backdrop-blur-2xl bg-linear-to-br from-slate-800/40 to-slate-900/40 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
                    {/* Error icon with animation */}
                    <motion.div
                        className="flex justify-center mb-6"
                        animate={{
                            y: [0, -10, 0],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <div className="relative">
                            <div className="absolute inset-0 bg-red-500/20 rounded-full blur-lg animate-pulse" />
                            <div className="relative bg-linear-to-br from-red-500 to-red-600 p-4 rounded-2xl">
                                <AlertTriangle className="w-8 h-8 text-white" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Title */}
                    <motion.h1
                        className="text-3xl font-bold text-center text-white mb-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                    >
                        Something Went Wrong
                    </motion.h1>

                    {/* Error message */}
                    <motion.p
                        className="text-center text-slate-300 mb-6 leading-relaxed"
                    >
                        {(() => {
                            let message = error.message;

                            try {
                                const parsed = JSON.parse(error.message);
                                message = parsed.message || message;
                            } catch { }

                            return message;
                        })()}
                    </motion.p>

                    {/* Error ID for support */}
                    <motion.div
                        className="bg-slate-900/50 border border-slate-700/30 rounded-2xl p-4 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                                Error ID
                            </span>
                            <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full font-mono">
                                {/* {errorCode} */}
                            </span>
                        </div>
                        <code className="text-xs text-slate-300 font-mono break-all">{errorId}</code>
                        <p className="text-xs text-slate-500 mt-2">
                            Share this ID with support if the problem persists
                        </p>
                    </motion.div>

                    {/* Suggested action */}
                    <motion.div
                        className="bg-linear-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/20 rounded-2xl p-3 mb-6"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                    >
                        <p className="text-sm text-blue-200">💡 Try Again or check your roles</p>
                    </motion.div>

                    {/* Action buttons */}
                    <motion.div
                        className="space-y-3"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                    >
                        {/* Retry button - always visible */}
                        <motion.button
                            onClick={handleRetry}
                            disabled={isRetrying}
                            whileHover={{ scale: isRetrying ? 1 : 1.02 }}
                            whileTap={{ scale: isRetrying ? 1 : 0.98 }}
                            className={`w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 transition-all duration-300 ${isRetrying
                                ? "bg-indigo-500/60 text-white cursor-not-allowed"
                                : "bg-linear-to-r from-indigo-500 to-indigo-600 text-white hover:shadow-lg hover:shadow-indigo-500/50"
                                }`}
                        >
                            {isRetrying ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    >
                                        <RotateCcw className="w-5 h-5" />
                                    </motion.div>
                                    Retrying...
                                </>
                            ) : (
                                <>
                                    <RotateCcw className="w-5 h-5" />
                                    Try Again
                                </>
                            )}
                        </motion.button>

                        {/* Dashboard button */}
                        <motion.button
                            onClick={handleNavigateToDashboard}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-slate-800/60 text-slate-200 hover:bg-slate-700/60 border border-slate-700/50 transition-all duration-300 hover:shadow-lg hover:shadow-slate-500/10"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Go to Dashboard
                        </motion.button>

                        {/* Home button */}
                        <motion.button
                            onClick={handleNavigateHome}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 bg-slate-900/40 text-slate-300 hover:bg-slate-900/60 border border-slate-700/30 transition-all duration-300"
                        >
                            <Home className="w-5 h-5" />
                            Go Home
                        </motion.button>
                    </motion.div>

                    {/* Footer text */}
                    <p className="text-center text-xs text-slate-500 mt-6">
                        If the problem persists, please contact support with the Error ID above
                    </p>
                </div>

                {/* Debug info - only in development */}
                {showDebugInfo && process.env.NODE_ENV === "development" && (
                    <motion.div
                        className="mt-6 backdrop-blur-xl bg-slate-900/40 border border-amber-500/30 rounded-2xl p-4"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7, duration: 0.5 }}
                    >
                        <button
                            onClick={() => setShowDebugInfo(!showDebugInfo)}
                            className="flex items-center gap-2 text-amber-300 hover:text-amber-200 text-sm font-semibold mb-3 transition-colors"
                        >
                            <Bug className="w-4 h-4" />
                            Debug Info
                        </button>

                        {showDebugInfo && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-2 text-xs"
                            >
                                <div className="bg-slate-950/60 rounded p-2 border border-slate-800/50">
                                    <p className="text-slate-400">
                                        <span className="text-amber-400 font-semibold">Message:</span>{" "}
                                        <code className="text-slate-200">{error.message}</code>
                                    </p>
                                </div>

                                {error.stack && (
                                    <div className="bg-slate-950/60 rounded p-2 border border-slate-800/50">
                                        <p className="text-slate-400 mb-1">
                                            <span className="text-amber-400 font-semibold">Stack:</span>
                                        </p>
                                        <code className="text-slate-300 whitespace-pre-wrap break-all text-[10px]">
                                            {error.stack}
                                        </code>
                                    </div>
                                )}

                                <div className="bg-slate-950/60 rounded p-2 border border-slate-800/50">
                                    <p className="text-slate-400">
                                        <span className="text-amber-400 font-semibold">Digest:</span>{" "}
                                        <code className="text-slate-200">{error.digest || "N/A"}</code>
                                    </p>
                                </div>

                                <div className="mt-3">
                                    <button
                                        // onClick={() => {
                                        //     const errors = getLoggedErrors();
                                        //     console.table(errors);
                                        // }}
                                        className="text-amber-300 hover:text-amber-200 text-xs font-semibold underline transition-colors"
                                    >
                                        View all logged errors in console
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}
