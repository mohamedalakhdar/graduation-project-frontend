'use client';

import { useCallback, useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllCourseOfferings, deleteCourseOffering } from '@/server/CourseOffering';
import { Course, CourseOffering, Faculty } from '@/types';
import Pagination from '@/components/ui/Pagination';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { CourseOfferingTable } from './CourseOfferingTable';
import { CourseOfferingModal } from './CourseOfferingModal';
import { getAllCourses } from '@/server/Courses';
import { getAllFacultyMember } from '@/server/FacultyAction';

import { useTranslations } from '@/i18n/IntlProvider';

export default function CourseOfferingPage() {
    const t = useTranslations('CourseOfferings');
    const tc = useTranslations('Common');
    const [courseOfferingsData, setCourseOfferingsData] = useState<CourseOffering[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [courses, setCourses] = useState<Course[]>([]);
    const [instructors, setInstructors] = useState<Faculty[]>([]);
    const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState(true);

    // Filters
    const [term, setTerm] = useState<'' | 'Fall' | 'Spring' | 'Summer'>('');
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [courseId, setCourseId] = useState('');
    const [instructorId, setInstructorId] = useState('');

    // Modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        offering: CourseOffering | null;
    }>({ isOpen: false, offering: null });
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);

    // Fetch data
    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const data = await getAllCourseOfferings({
                term: term || undefined,
                year: year ? year : undefined,
                courseId: courseId || undefined,
                instructorId: instructorId || undefined,
                page,
                pageSize,
            });

            if (data) {
                setCourseOfferingsData(data.items || []);
                setTotalPages(data.totalPages || 1);
                setTotalCount(data.totalCount || 0);
            } else {
                setCourseOfferingsData([]);
                setTotalCount(0);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('errorFetchOfferings'));
        } finally {
            setIsLoading(false);
        }
    }, [courseId, instructorId, page, pageSize, term, year, t]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                setIsLoadingFilterOptions(true);

                const [coursesData, facultyData] = await Promise.all([
                    getAllCourses({ pageSize: 100000 }),
                    getAllFacultyMember({ pageSize: 1000 }),
                ]);

                setCourses(coursesData?.items || []);
                setInstructors(
                    facultyData && 'items' in facultyData ? facultyData.items || [] : []
                );
            } catch (error) {
                console.error(error);
                toast.error(t('errorLoadFilterOptions'));
            } finally {
                setIsLoadingFilterOptions(false);
            }
        };

        fetchFilterOptions();
    }, [t]);

    const handleAddNew = () => {
        setIsModalOpen(true);
    };

    const handleDelete = (offering: CourseOffering) => {
        setDeleteConfirmation({ isOpen: true, offering });
    };

    const handleConfirmDelete = async () => {
        if (!deleteConfirmation.offering) return;

        setIsDeleteLoading(true);
        try {
            const res = await deleteCourseOffering(deleteConfirmation.offering.offeringId);

            if (res.success) {
                toast.success(res.message);
                fetchData();
            } else {
                toast.error(res.message || 'Failed to delete course offering');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred while deleting');
        } finally {
            setIsDeleteLoading(false);
            setDeleteConfirmation({ isOpen: false, offering: null });
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleSuccessfulAction = () => {
        handleCloseModal();
        setPage(1); // Reset to first page
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
                    {/* Term Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labelTerm')}
                        </label>
                        <select
                            value={term}
                            onChange={(e) => {
                                setTerm(e.target.value as '' | 'Fall' | 'Spring' | 'Summer');
                                setPage(1);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                        >
                            <option value="">All Terms</option>
                            <option value="Fall">Fall</option>
                            <option value="Spring">Spring</option>
                            <option value="Summer">Summer</option>
                        </select>
                    </div>

                    {/* Year Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labelYear')}
                        </label>
                        <input
                            type="number"
                            value={year}
                            onChange={(e) => {
                                setYear(parseInt(e.target.value) || new Date().getFullYear());
                                setPage(1);
                            }}
                            min="1900"
                            max="2100"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                        />
                    </div>

                    {/* Course Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labelCourse')}
                        </label>
                        <select
                            value={courseId}
                            onChange={(e) => {
                                setCourseId(e.target.value);
                                setPage(1);
                            }}
                            disabled={isLoadingFilterOptions}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingFilterOptions ? t('loadingCourses') : t('allCourses')}
                            </option>
                            {courses.map((course) => (
                                <option key={course.id} value={course.id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Instructor Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('labelInstructor')}
                        </label>
                        <select
                            value={instructorId}
                            onChange={(e) => {
                                setInstructorId(e.target.value);
                                setPage(1);
                            }}
                            disabled={isLoadingFilterOptions}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">
                                {isLoadingFilterOptions ? t('loadingInstructors') : t('allInstructors')}
                            </option>
                            {instructors.map((instructor) => (
                                <option key={instructor.id} value={instructor.id}>
                                    {instructor.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Table */}
            <CourseOfferingTable
                data={courseOfferingsData}
                isLoading={isLoading}
                onDelete={handleDelete}
            />

            {/* Pagination */}
            {!isLoading && courseOfferingsData.length > 0 && (
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
                <CourseOfferingModal
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
                        Are you sure you want to delete this course offering for{' '}
                        <span className="font-semibold text-red-500">
                            {deleteConfirmation.offering?.courseTitle}
                        </span>
                        ? This action cannot be undone.
                    </>
                }
                isLoading={isDeleteLoading}
                confirmText="Delete"
                cancelText="Cancel"
                isDangerous={true}
                onConfirm={handleConfirmDelete}
                onCancel={() => setDeleteConfirmation({ isOpen: false, offering: null })}
            />
        </div>
    );
}
