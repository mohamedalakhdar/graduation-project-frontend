'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import { createCourse } from '@/server/Courses';
import { getAllDepartment } from '@/server/DepartmentActions';
import { Department } from '@/types';
import { CreateCourseSchema } from '@/validation/course';
import { useTranslations } from '@/i18n/IntlProvider';

interface CourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CourseModal({ isOpen, onClose, onSuccess }: CourseModalProps) {
    const t = useTranslations('Courses');
    const tc = useTranslations('Common');

    const [departments, setDepartments] = useState<Department[]>([]);
    const [departmentId, setDepartmentId] = useState('');
    const [code, setCode] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [credits, setCredits] = useState('3');
    const [lectureHours, setLectureHours] = useState('3');
    const [labHours, setLabHours] = useState('0');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDepts, setIsLoadingDepts] = useState(false);
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

    useEffect(() => {
        if (isOpen) {
            fetchDepartments();
        }
    }, [isOpen]);

    const fetchDepartments = async () => {
        try {
            setIsLoadingDepts(true);
            const data = await getAllDepartment({});
            setDepartments(data.items || []);
        } catch (error) {
            console.error(error);
            toast.error(t('errorFetchDepts'));
        } finally {
            setIsLoadingDepts(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            // Validate input
            const validation = CreateCourseSchema.safeParse({
                departmentId,
                code,
                title,
                description,
                credits: parseInt(credits),
                lectureHours: parseInt(lectureHours),
                labHours: parseInt(labHours),
            });

            if (!validation.success) {
                const fieldErrors: Record<string, string> = {};
                const flatErrors = validation.error.flatten().fieldErrors;
                Object.entries(flatErrors).forEach(([key, messages]) => {
                    if (messages && messages.length > 0) {
                        fieldErrors[key] = messages[0];
                    }
                });
                setErrors(fieldErrors);
                setIsLoading(false);
                return;
            }

            const res = await createCourse({
                departmentId,
                code,
                title,
                description,
                credits: parseInt(credits),
                lectureHours: parseInt(lectureHours),
                labHours: parseInt(labHours),
            });

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
            setIsLoading(false);
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
            <div className="fixed top-1/2 left-1/2 -translate-1/2 z-50 p-4 overflow-y-auto max-h-[90vh]">
                <div
                    className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 my-8"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {t('addTitle')}
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading || isLoadingDepts}
                            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[60vh]">
                        {/* Department ID */}
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
                            {errors.departmentId && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.departmentId)}</p>
                            )}
                        </div>

                        {/* Code */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('codeLabel')}
                            </label>
                            <input
                                type="text"
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                disabled={isLoading}
                                placeholder={t('codePlaceholder')}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.code && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.code)}</p>
                            )}
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
                                disabled={isLoading}
                                placeholder={t('titlePlaceholder')}
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
                                disabled={isLoading}
                                placeholder={t('descriptionPlaceholder')}
                                rows={2}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
                            />
                            {errors.description && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.description)}</p>
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
                                disabled={isLoading}
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.credits && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.credits)}</p>
                            )}
                        </div>

                        {/* Lecture Hours */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('lectureHoursLabel')}
                            </label>
                            <input
                                type="number"
                                value={lectureHours}
                                onChange={(e) => setLectureHours(e.target.value)}
                                disabled={isLoading}
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
                                disabled={isLoading}
                                min="0"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.labHours && (
                                <p className="text-red-500 text-sm mt-1">{getLocalizedError(errors.labHours)}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading || isLoadingDepts}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {tc('cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading || isLoadingDepts}
                                className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader /> : tc('add')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
