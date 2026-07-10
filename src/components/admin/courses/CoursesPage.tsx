'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllCourses, deleteCourse } from '@/server/Courses';
import { Course, Department } from '@/types';
import Pagination from '@/components/ui/Pagination';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { CoursesTable } from './CoursesTable';
import { CourseModal } from './CourseModal';
import { getAllDepartment } from '@/server/DepartmentActions';
import { useTranslations } from '@/i18n/IntlProvider';

export default function CoursesPage() {
    const t = useTranslations('Courses');
    const tc = useTranslations('Common');

    const [coursesData, setCoursesData] = useState<Course[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isLoadingDepts, setIsLoadingDepts] = useState(false);

    // Filters
    const [search, setSearch] = useState('');
    const [departmentId, setDepartmentId] = useState('');
    const [minCredits, setMinCredits] = useState<number | undefined>(undefined);
    const [maxCredits, setMaxCredits] = useState<number | undefined>(undefined);

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        course: Course | null;
    }>({ isOpen: false, course: null });
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAllCourses({
                search: search || undefined,
                departmentId: departmentId || undefined,
                minCredits: minCredits,
                maxCredits: maxCredits,
                page,
                pageSize,
            });

            setIsLoadingDepts(true);
            const dataDeparts = await getAllDepartment({});
            setDepartments(dataDeparts.items || []);

            if (data) {
                setCoursesData(data.items || []);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
            } else {
                setCoursesData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('errorFetchCourses'));
        } finally {
            setIsLoading(false);
            setIsLoadingDepts(false);
        }
    }, [page, pageSize, search, departmentId, minCredits, maxCredits, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleDelete = (course: Course) => {
        setDeleteConfirmation({ isOpen: true, course });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.course) return;

        setIsDeleteLoading(true);
        try {
            const res = await deleteCourse(deleteConfirmation.course.id);

            if (res.success) {
                toast.success(res.message);
                fetchData();
            } else {
                toast.error(res.message || t('errorDeleteCourse'));
            }
        } catch (error) {
            console.error(error);
            toast.error(t('errorDeleting'));
        } finally {
            setIsDeleteLoading(false);
            setDeleteConfirmation({ isOpen: false, course: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSuccessfulAction = () => {
        handleCloseModal();
        setPage(1);
        fetchData();
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
                    className="flex items-center gap-2 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium"
                >
                    <Plus size={20} />
                    {t('addBtn')}
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
                <h3 className="font-semibold text-gray-900">{tc('filters')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tc('search')}
                        </label>
                        <input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={search}
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                        />
                    </div>

                    {/* Department Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('departmentLabel')}
                        </label>
                        <select
                            value={departmentId}
                            onChange={(e) => setDepartmentId(e.target.value)}
                            disabled={isLoading || isLoadingDepts}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">{t('selectDepartment')}</option>
                            {departments.map((dept) => (
                                <option key={dept.id} value={dept.id}>
                                    {dept.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Min Credits Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('minCredits')}
                        </label>
                        <input
                            type="number"
                            placeholder={t('minCreditsPlaceholder')}
                            value={minCredits || ''}
                            onChange={(e) => {
                                setMinCredits(e.target.value ? parseInt(e.target.value) : undefined);
                                setPage(1);
                            }}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                        />
                    </div>

                    {/* Max Credits Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('maxCredits')}
                        </label>
                        <input
                            type="number"
                            placeholder={t('maxCreditsPlaceholder')}
                            value={maxCredits || ''}
                            onChange={(e) => {
                                setMaxCredits(e.target.value ? parseInt(e.target.value) : undefined);
                                setPage(1);
                            }}
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <CoursesTable
                data={coursesData}
                isLoading={isLoading}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            {!isLoading && coursesData.length > 0 && (
                <Pagination
                    totalCount={totalCount}
                    currentPage={page}
                    totalPages={totalPages}
                    pageSize={pageSize}
                    onPageChange={setPage}
                    onPageSizeChange={setPageSize}
                />
            )}

            {/* Modal */}
            {isModalOpen && (
                <CourseModal
                    isOpen={isModalOpen}
                    onClose={handleCloseModal}
                    onSuccess={handleSuccessfulAction}
                />
            )}

            {/* Delete Confirmation */}
            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                title={t('deleteTitle')}
                message={
                    <>
                        {t('confirmDelete', { name: deleteConfirmation.course?.title ?? '' })}
                    </>
                }
                isLoading={isDeleteLoading}
                confirmText={tc('delete')}
                cancelText={tc('cancel')}
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmation({ isOpen: false, course: null })}
            />
        </div>
    );
}
