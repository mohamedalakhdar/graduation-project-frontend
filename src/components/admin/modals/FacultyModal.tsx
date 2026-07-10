/**
 * Faculty Modal Component
 * Modal wrapper for faculty form
 */

'use client';

import { Student } from '@/types';
import { X } from 'lucide-react';
import { FacultyMemberForm } from '../forms/FacultyForm';
import { useTranslations } from '@/i18n/IntlProvider';

interface FacultyModalProps {
    isOpen: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditing: boolean;
    onClose: () => void;
    isLoading?: boolean;
    defaultValuesForEdit: Student | null;
}

export function FacultyModal({
    isOpen,
    setIsModalOpen,
    isEditing,
    onClose,
    isLoading = false,
    defaultValuesForEdit,
}: FacultyModalProps) {
    const t = useTranslations('Faculty');
    const tc = useTranslations('Common');

    if (!isOpen) return null;

    return (
        <>
            {/* Overlay */}
            <div
                className="fixed inset-0 bg-black/50 z-40 transition-opacity"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Modal */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 p-4 overflow-y-auto">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-2xl w-full animate-in fade-in zoom-in-95 my-8 text-start"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {isEditing ? t('editBtn') : t('createFaculty')}
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
                        <FacultyMemberForm
                            setIsModalOpen={setIsModalOpen}
                            isEditing={isEditing}
                            onCancel={onClose}
                            // defaultValuesForEdit={defaultValuesForEdit}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
