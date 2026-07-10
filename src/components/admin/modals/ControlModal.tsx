'use client';

import { X } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { runControlEngine } from '@/server/ControlEngine';
import { useTranslations } from '@/i18n/IntlProvider';

interface ControlModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function ControlModal({ isOpen, onClose, onSuccess }: ControlModalProps) {
    const t = useTranslations('ControlEngine');
    const tc = useTranslations('Common');
    const tf = useTranslations('Forms');

    const [term, setTerm] = useState<'Fall' | 'Spring' | 'Summer'>('Fall');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await runControlEngine(term, year);

            if (result.success) {
                toast.success(t('successRun'));
                setTerm('Fall');
                setYear(new Date().getFullYear());
                onClose();
                onSuccess?.();
            } else {
                toast.error(result.message || t('errorOccurred'));
            }
        } catch (error) {
            toast.error(t('errorOccurred'));
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed z-40 inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-y-auto w-auto sm:w-100">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 my-8 text-start"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t('runEngineTitle')}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            aria-label={tc('close')}
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Term Field */}
                        <div>
                            <label htmlFor="term" className="block text-sm font-semibold text-gray-900 mb-2">
                                {tf('labelTerm')} <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="term"
                                value={term}
                                onChange={(e) => setTerm(e.target.value as 'Fall' | 'Spring' | 'Summer')}
                                disabled={isLoading}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00284d] focus:border-transparent disabled:opacity-50 transition"
                            >
                                <option value="Fall">Fall</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </select>
                        </div>

                        {/* Year Field */}
                        <div>
                            <label htmlFor="year" className="block text-sm font-semibold text-gray-900 mb-2">
                                {tf('labelYear')} <span className="text-red-500">*</span>
                            </label>
                            <input
                                id="year"
                                type="number"
                                value={year}
                                onChange={(e) => setYear(parseInt(e.target.value, 10))}
                                disabled={isLoading}
                                min="1900"
                                max="2100"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00284d] focus:border-transparent disabled:opacity-50 transition"
                            />
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3 justify-end pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 font-medium"
                            >
                                {tc('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 font-medium flex items-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {t('running')}
                                    </>
                                ) : (
                                    t('runEngineBtn')
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
