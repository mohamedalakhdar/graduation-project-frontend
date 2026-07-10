'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { RegistrationPeriodsModal } from '@/components/admin/modals/RegistrationPeriodsModal';
import { RegistrationPeriodsTable } from '@/components/admin/table/RegistrationPeriodsTable';
import { deleteRegistrationPeriod } from '@/server/RegistrationPeriods';
import { RegistrationPeriod } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

export default function RegistrationPeriodsPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const [periodToDelete, setPeriodToDelete] = useState<RegistrationPeriod | null>(null);

    const t = useTranslations('RegistrationPeriods');
    const tc = useTranslations('Common');

    const handleConfirmDelete = async () => {
        if (!periodToDelete) return;
        setIsDeleting(true);
        try {
            const response = await deleteRegistrationPeriod(periodToDelete.id);
            if (response.success) {
                toast.success(response.message);
                setRefreshKey((key) => key + 1);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('Delete failed');
        } finally {
            setIsDeleting(false);
            setPeriodToDelete(null);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="mt-1 text-gray-600">{t('subtitle')}</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="rounded-lg bg-[#00284d] px-4 py-2 font-medium text-white transition hover:bg-[#003465]"
                >
                    + {t('addBtn')}
                </button>
            </div>

            <RegistrationPeriodsTable refreshKey={refreshKey} onDelete={setPeriodToDelete} />

            <RegistrationPeriodsModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onCreated={() => setRefreshKey((key) => key + 1)}
            />

            <ConfirmationDialog
                isOpen={Boolean(periodToDelete)}
                title={t('deleteTitle')}
                message={
                    <>
                        {t('confirmDelete', { name: periodToDelete?.name ?? '' })}
                    </>
                }
                isLoading={isDeleting}
                confirmText={tc('delete')}
                cancelText={tc('cancel')}
                isDangerous
                onConfirm={handleConfirmDelete}
                onCancel={() => setPeriodToDelete(null)}
            />
        </div>
    );
}
