/**
 * Student Modal Component
 * Modal wrapper for student form
 */

'use client';

import { X } from 'lucide-react';
import { Program } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';
import { ProgramForm } from '../forms/ProgramForm';

interface ProgramsModalProps {
    isOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>,
    isEditing: boolean;
    onClose: () => void;
    isLoading?: boolean;
    defaultValuesForEdit: Program | null;
}

export function ProgramsModal({
    isOpen,
    setIsModalOpen,
    isEditing,
    onClose,
    isLoading = false,
    defaultValuesForEdit
}: ProgramsModalProps) {
    const t = useTranslations('Programs');
    const tc = useTranslations('Common');

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
            <div className="fixed top-1/2 left-1/2 -translate-1/2 z-50 p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-in fade-in zoom-in-95 my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditing ? t('editProgram') : t('addProgram')}
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
                    <div className="p-6 max-h-[70vh] overflow-y-auto">
                        <ProgramForm
                            setIsModalOpen={setIsModalOpen}
                            isEditing={isEditing}
                            onCancel={onClose}
                            defaultValuesForEdit={defaultValuesForEdit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
