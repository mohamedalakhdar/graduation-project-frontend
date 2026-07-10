'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import Loader from '@/components/ui/Loader';
import {
    getSingleCourse,
    updateCourse,
    getCoursePrerequisites,
    addCoursePrerequisite,
    deleteCoursePrerequisite,
    getAllCourses,
} from '@/server/Courses';
import { getAllDepartment } from '@/server/DepartmentActions';
import { Course, CoursePrerequisite, Department } from '@/types';
import { UpdateCourseSchema } from '@/validation/course';
import { ConfirmationDialog } from '@/components/admin/modals/ConfirmationDialog';
import { useTranslations } from '@/i18n/IntlProvider';

interface EditCoursePageProps {
    courseId: string;
}

export default function EditCoursePage({ courseId }: EditCoursePageProps) {
    const t = useTranslations('Courses');
    const tc = useTranslations('Common');
    const router = useRouter();

    const [course, setCourse] = useState<Course | null>(null);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [prerequisites, setPrerequisites] = useState<CoursePrerequisite[]>([]);
    const [availableCourses, setAvailableCourses] = useState<Course[]>([]);

    const [isLoadingCourse, setIsLoadingCourse] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isAddingPrereq, setIsAddingPrereq] = useState(false);
    const [isDeletingPrereq, setIsDeletingPrereq] = useState(false);

    // Form state
    const [departmentId, setDepartmentId] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState('');
    const [lectureHours, setLectureHours] = useState('');
    const [labHours, setLabHours] = useState('');
    const [selectedPrereqCourse, setSelectedPrereqCourse] = useState('');

    // Delete confirmation
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        prereqId: string | null;
    }>({ isOpen: false, prereqId: null });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const getLocalizedError = (errMessage: string) => {
        switch (errMessage) {
            case 'Department is required':
                return t('errorDepartmentRequired');
            case 'Code must be 3 letters followed by 3 digits (e.g. CSC123 or CSC 123)':
                return t('errorCodeFormat');
            case 'Title must be at least 2 characters long':
                return t('errorTitleMin');
            case 'Title must be at most 100 characters long':
                return t('errorTitleMax');
            case 'Description must be at least 5 characters long':
                return t('errorDescMin');
            case 'Description must be at most 500 characters long':
                return t('errorDescMax');
            case 'Credits must be an integer':
                return t('errorCreditsInteger');
            case 'Credits must be at least 1':
                return t('errorCreditsMin');
            case 'Credits must be at most 100':
                return t('errorCreditsMax');
            case 'Lecture hours must be an integer':
                return t('errorLectureHoursInteger');
            case 'Lecture hours cannot be negative':
                return t('errorLectureHoursMin');
            case 'Lecture hours must be at most 100':
                return t('errorLectureHoursMax');
            case 'Lab hours must be an integer':
                return t('errorLabHoursInteger');
            case 'Lab hours cannot be negative':
                return t('errorLabHoursMin');
            case 'Lab hours must be at most 100':
                return t('errorLabHoursMax');
            case 'Prerequisite course is required':
                return t('errorPrerequisiteRequired');
            default:
                return errMessage;
        }
    };

    // Fetch initial data
    useEffect(() => {
        fetchData();
    }, [courseId, departmentId, title, description, credits, lectureHours, labHours]);

    // fetch prerequisites
    useEffect(() => {
        const fetchPrerequisites = async () => {
            try {
                const prereqsData = await getCoursePrerequisites(courseId);
                if (prereqsData) {
                    setPrerequisites(prereqsData);
                }
            } catch (error) {
                console.error(error);
                toast.error(t('errorFetchPrereqs'));
            }
        };
        fetchPrerequisites();
    }, [courseId]);

    const fetchData = async () => {
        try {
            setIsLoadingCourse(true);

            // Fetch course, departments, prerequisites, and all courses in parallel
            const [courseData, deptsData, prereqsData, allCoursesData] = await Promise.all([
                getSingleCourse(courseId),
                getAllDepartment({}),
                getCoursePrerequisites(courseId),
                getAllCourses({}),
            ]);

            if (courseData) {
                setCourse(courseData);
                setDepartmentId(courseData.departmentId);
                setTitle(courseData.title);
                setDescription(courseData.description);
                setCredits(String(courseData.credits));
                setLectureHours(String(courseData.lectureHours));
                setLabHours(String(courseData.labHours));
            }

            if (deptsData) {
                setDepartments(deptsData.items || []);
            }

            if (prereqsData) {
                setPrerequisites(prereqsData);
            }

            if (allCoursesData) {
                setAvailableCourses(allCoursesData.items || []);
            }
        } catch (error) {
            console.error(error);
            toast.error(t('errorFetchDetails'));
        } finally {
            setIsLoadingCourse(false);
        }
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsSaving(true);

        try {
            const validation = UpdateCourseSchema.safeParse({
                departmentId,
                title,
                description,
                credits: parseInt(credits),
                lectureHours: parseInt(lectureHours),
                labHours: parseInt(labHours),
            });

            if (!validation.success) {
                const flattened = validation.error.flatten().fieldErrors;
                const fieldErrors: Record<string, string> = {};
                Object.entries(flattened).forEach(([key, value]) => {
                    if (value && value[0]) {
                        fieldErrors[key] = value[0];
                    }
                });
                setErrors(fieldErrors);
                setIsSaving(false);
                return;
            }

            const res = await updateCourse(courseId, {
                departmentId,
                title,
                description,
                credits: parseInt(credits),
                lectureHours: parseInt(lectureHours),
                labHours: parseInt(labHours),
            });

            if (res.success) {
                toast.success(res.message);
            } else {
                toast.error(res.message || t('errorUpdateCourse'));
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsSaving(false);
        }
    };

    const handleAddPrerequisite = async () => {
        if (!selectedPrereqCourse) {
            toast.error(t('errorSelectPrereq'));
            return;
        }

        setIsAddingPrereq(true);

        try {
            const res = await addCoursePrerequisite(courseId, selectedPrereqCourse);
            console.log('prerequest code', res)

            if (res.success) {
                toast.success(res.message);
                setSelectedPrereqCourse('');
                // Refresh prerequisites
                const prereqsData = await getCoursePrerequisites(courseId);
                if (prereqsData) {
                    setPrerequisites(prereqsData);
                }
            } else {
                toast.error(res.message || t('errorAddPrereq'));
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsAddingPrereq(false);
        }
    };

    const handleDeletePrerequisite = async () => {
        if (!deleteConfirmation.prereqId) return;

        setIsDeletingPrereq(true);
        console.log(courseId, deleteConfirmation.prereqId)

        try {
            const res = await deleteCoursePrerequisite(courseId, deleteConfirmation.prereqId);

            if (res.success) {
                toast.success(res.message);
                // Refresh prerequisites
                const prereqsData = await getCoursePrerequisites(courseId);
                if (prereqsData) {
                    setPrerequisites(prereqsData);
                }
            } else {
                toast.error(res.message || t('errorDeletePrereq'));
            }
        } catch (error) {
            console.error(error);
            toast.error(tc('error'));
        } finally {
            setIsDeletingPrereq(false);
            setDeleteConfirmation({ isOpen: false, prereqId: null });
        }
    };

    if (isLoadingCourse) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader />
            </div>
        );
    }

    if (!course) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">{t('courseNotFound')}</p>
                <button
                    onClick={() => router.push('/admin/courses')}
                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition"
                >
                    {t('backToCourses')}
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/admin/courses')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">{t('editTitle')}</h2>
                    <p className="text-gray-600">{course.code} - {course.title}</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('courseDetails')}</h3>

                <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Department */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('departmentLabel')}
                            </label>
                            <select
                                value={departmentId}
                                onChange={(e) => setDepartmentId(e.target.value)}
                                disabled={isSaving}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                {departments.map((dept) => (
                                    <option key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                            {errors.departmentId && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.departmentId)}</p>
                            )}
                        </div>

                        {/* Credits */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('creditsLabel')}
                            </label>
                            <input
                                type="number"
                                value={credits}
                                onChange={(e) => setCredits(e.target.value)}
                                disabled={isSaving}
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.credits && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.credits)}</p>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('titleLabel')}
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            disabled={isSaving}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        />
                        {errors.title && (
                            <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.title)}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('descriptionLabel')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            disabled={isSaving}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                        />
                        {errors.description && (
                            <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.description)}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Lecture Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('lectureHoursLabel')}
                            </label>
                            <input
                                type="number"
                                value={lectureHours}
                                onChange={(e) => setLectureHours(e.target.value)}
                                disabled={isSaving}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.lectureHours && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.lectureHours)}</p>
                            )}
                        </div>

                        {/* Lab Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('labHoursLabel')}
                            </label>
                            <input
                                type="number"
                                value={labHours}
                                onChange={(e) => setLabHours(e.target.value)}
                                disabled={isSaving}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.labHours && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.labHours)}</p>
                            )}
                        </div>
                    </div>

                    {/* Save Button */}
                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/courses')}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {tc('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isSaving && <Loader />}
                            {tc('save')}
                        </button>
                    </div>
                </form>
            </div>

            {/* Prerequisites Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('prerequisites')}</h3>

                {/* Add Prerequisite */}
                <div className="mb-6 pb-6 border-b border-gray-200">
                    <div className="flex gap-3">
                        <select
                            value={selectedPrereqCourse}
                            onChange={(e) => setSelectedPrereqCourse(e.target.value)}
                            disabled={isAddingPrereq}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="">{t('selectPrereqPlaceholder')}</option>
                            {availableCourses
                                .filter((c) => c.id !== courseId)
                                .map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.code} - {c.title}
                                    </option>
                                ))}
                        </select>
                        <button
                            onClick={handleAddPrerequisite}
                            disabled={isAddingPrereq || !selectedPrereqCourse}
                            className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                        >
                            <Plus size={18} />
                            {tc('add')}
                        </button>
                    </div>
                </div>

                {/* Prerequisites List */}
                {prerequisites && prerequisites.length > 0 ? (
                    <div className="space-y-2">
                        {prerequisites.map((prereq) => (
                            <div
                                key={prereq.courseId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                                <div>
                                    <p className="font-mono text-sm font-semibold text-black">
                                        {prereq.code}
                                    </p>
                                    <p className="text-sm text-black">
                                        {prereq.title}
                                    </p>
                                </div>
                                <button
                                    onClick={() =>
                                        setDeleteConfirmation({ isOpen: true, prereqId: prereq.courseId })
                                    }
                                    disabled={isDeletingPrereq}
                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center py-8 text-gray-500">{t('noPrerequisites')}</p>
                )}
            </div>

            {/* Delete Prerequisite Confirmation */}
            <ConfirmationDialog
                isOpen={deleteConfirmation.isOpen}
                title={t('removePrereqTitle')}
                message={t('removePrereqMessage')}
                isLoading={isDeletingPrereq}
                confirmText={tc('delete')}
                cancelText={tc('cancel')}
                isDangerous={true}
                onConfirm={handleDeletePrerequisite}
                onCancel={() => setDeleteConfirmation({ isOpen: false, prereqId: null })}
            />
        </div>
    );
}
