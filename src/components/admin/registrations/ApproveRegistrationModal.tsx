'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import { Advisor } from '@/types';
import { getAllAdvisors } from '@/server/FacultyAction';
import { approveRegistration } from '@/server/Registrations';
import { useTranslations } from '@/i18n/IntlProvider';

interface ApproveRegistrationModalProps {
    isOpen: boolean;
    registrationId: string | null;
    studentId: string | null;
    advisorId?: string;
    onClose: () => void;
    onSuccess: () => void;
}

export function ApproveRegistrationModal({
    isOpen,
    registrationId,
    advisorId: fixedAdvisorId,
    onClose,
    onSuccess,
}: ApproveRegistrationModalProps) {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [advisorId, setAdvisorId] = useState('');
    const [advisors, setAdvisors] = useState<Advisor[]>([]);
    const [isLoadingAdvisors, setIsLoadingAdvisors] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!isOpen) return;

        if (fixedAdvisorId) {
            setAdvisorId(fixedAdvisorId);
            return;
        }

        const fetchAdvisors = async () => {
            try {
                setIsLoadingAdvisors(true);
                const data = await getAllAdvisors({ pageSize: 100000 });
                setAdvisors(data?.items || []);
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
            } finally {
                setIsLoadingAdvisors(false);
            }
        };

        fetchAdvisors();
        setAdvisorId('');
    }, [fixedAdvisorId, isOpen, tc]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!registrationId || !advisorId) {
            toast.error(t('errorSelectAdvisor'));
            return;
        }

        setIsSubmitting(true);
        try {
            const res = await approveRegistration(registrationId, advisorId);

            if (res.success) {
                toast.success(res.message);
                onSuccess();
            } else {
                toast.error(res.message || tc('error'));
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed z-40 inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900 text-start">
                            {t('approveTitle')}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            aria-label={tc('close')}
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {!fixedAdvisorId && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1 text-start">
                                    {t('labelAdvisor')} *
                                </label>
                                <select
                                    value={advisorId}
                                    onChange={(e) => setAdvisorId(e.target.value)}
                                    disabled={isSubmitting || isLoadingAdvisors}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed text-start"
                                >
                                    <option value="">
                                        {isLoadingAdvisors ? t('loadingAdvisors') : t('selectAdvisor')}
                                    </option>
                                    {advisors.map((advisor) => (
                                        <option key={advisor.id} value={advisor.id}>
                                            {advisor.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isSubmitting}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                {tc('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting || isLoadingAdvisors || !advisorId}
                                className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                            >
                                {isSubmitting && <Loader />}
                                {t('btnApprove')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
