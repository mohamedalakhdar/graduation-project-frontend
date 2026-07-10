/**
 * Confirmation Dialog Component
 * Modal for confirming dangerous actions (delete, etc.)
 */

'use client';

import Loader from '@/components/ui/Loader';
import { AlertCircle, X } from 'lucide-react';

interface ConfirmationDialogProps {
    isOpen: boolean;
    title: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    isDangerous?: boolean;
    isLoading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmationDialog({
    isOpen,
    title,
    message,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    isDangerous = false,
    isLoading = false,
    onConfirm,
    onCancel,
}: ConfirmationDialogProps) {
    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={onCancel}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-1/2 z-50 p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-sm w-full animate-in fade-in zoom-in-95"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-start justify-between p-6 border-b border-gray-200">
                        <div className="flex items-start gap-3">
                            {isDangerous ? (
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <AlertCircle className="text-red-600" size={20} />
                                </div>
                            ) : (
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <AlertCircle className="text-blue-600" size={20} />
                                </div>
                            )}
                            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="p-1 hover:bg-gray-100 rounded-lg transition"
                            aria-label="Close"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="p-6">
                        <p className="text-gray-600">{message}</p>
                    </div>

                    {/* Footer */}
                    <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
                        <button
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            disabled={isLoading}
                            className={`flex-1 px-4 py-2 text-white rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed font-medium ${isDangerous
                                    ? 'bg-red-600 hover:bg-red-700'
                                    : 'bg-[#00284d] hover:bg-[#003465]'
                                }`}
                        >
                            {isLoading ? (
                                <Loader />
                            ) : (
                                confirmText
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
