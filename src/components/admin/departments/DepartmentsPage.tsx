/**
 * Departments Management Page
 */

'use client';

import { useState } from 'react';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { Department } from '@/types';
import toast from 'react-hot-toast';
import { DepartmentsModal } from '../modals/DepartmentsModal';
import { DepartmentsTable } from '../table/DepartmentsTable';
import { deleteDepartment } from '@/server/DepartmentActions';
import { useTranslations } from '@/i18n/IntlProvider';

export default function DepartmentsPage() {
    const t = useTranslations('Departments');
    const tc = useTranslations('Common');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
    const [idForDeleteItem, setIdForDeleteItem] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        department: Department | null;
    }>({ isOpen: false, department: null });

    const handleAddNew = () => {
        setIsEditing(false);
        setSelectedDepartment(null);
        setIsModalOpen(true);
    };

    const handleEdit = (department: Department) => {
        setSelectedDepartment(department);
        setIsModalOpen(true);
    };

    const handleDelete = (department: Department) => {
        setDeleteConfirmation({ isOpen: true, department });
    };

    const handleConfirmDelete = async () => {
        setIsDeleting(true);
        try {
            const res = await deleteDepartment(idForDeleteItem as string);
            toast.success(res.message);
            window.location.reload();
        } catch {
            toast.error("Delete failed");
        } finally {
            setIsDeleting(false);
            setDeleteConfirmation({ isOpen: false, department: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedDepartment(null);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('title')}</h2>
                    <p className="mt-1 text-gray-600">{t('subtitle')}</p>
                </div>
                <button
                    onClick={handleAddNew}
                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium"
                >
                    + {t('addBtn')}
                </button>
            </div>

            {/* Departments Table */}
            <DepartmentsTable
                onEdit={handleEdit}
                setIdForDeleteItem={setIdForDeleteItem}
                onDelete={handleDelete}
                setIsModalOpen={setIsModalOpen}
                setIsEditing={setIsEditing}
            />

            {/* Department Modal */}
            {
                isModalOpen && (
                    <DepartmentsModal
                        setIsModalOpen={setIsModalOpen}
                        isEditing={isEditing}
                        isOpen={isModalOpen}
                        onClose={handleCloseModal}
                        defaultValuesForEdit={selectedDepartment}
                    />
                )
            }

            {/* Delete Confirmation Dialog */}
            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                title={t('deleteTitle')}
                message={
                    <>
                        {t('confirmDelete', { name: deleteConfirmation.department?.name ?? '' })}
                    </>
                }
                isLoading={isDeleting}
                confirmText={tc('delete')}
                cancelText={tc('cancel')}
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmation({ isOpen: false, department: null })}
            />
        </div>
    );
}
