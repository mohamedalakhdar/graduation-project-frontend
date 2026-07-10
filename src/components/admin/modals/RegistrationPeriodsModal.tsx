'use client';

import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { useState } from 'react';
import { createRegistrationPeriod } from '@/server/RegistrationPeriods';
import { RegistrationPeriodFormData } from '@/types';
import { RegistrationPeriodForm } from '@/components/admin/registration-periods/RegistrationPeriodForm';

interface RegistrationPeriodsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreated: () => void;
}

export function RegistrationPeriodsModal({ isOpen, onClose, onCreated }: RegistrationPeriodsModalProps) {
    const [isSaving, setIsSaving] = useState(false);
    if (!isOpen) return null;

    const handleSubmit = async (data: RegistrationPeriodFormData) => {
        setIsSaving(true);
        try {
            const response = await createRegistrationPeriod(data);
            if (response.success) {
                toast.success(response.message);
                onCreated();
                onClose();
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <>
            <div className="fixed inset-0 z-50 bg-black/50" onClick={onClose} aria-hidden="true" />
            <div className="fixed left-1/2 top-1/2 z-50 max-h-[95vh] w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto p-4">
                <div className="rounded-lg bg-white shadow-xl">
                    <div className="flex items-center justify-between border-b border-gray-200 p-6">
                        <h2 className="text-xl font-semibold text-gray-900">Add Registration Period</h2>
                        <button onClick={onClose} className="rounded-lg p-1 transition hover:bg-gray-100" aria-label="Close">
                            <X size={20} className="text-gray-500" />
                        </button>
                    </div>
                    <div className="p-6">
                        <RegistrationPeriodForm
                            isSaving={isSaving}
                            submitText="Create Registration Period"
                            onSubmit={handleSubmit}
                            onCancel={onClose}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
