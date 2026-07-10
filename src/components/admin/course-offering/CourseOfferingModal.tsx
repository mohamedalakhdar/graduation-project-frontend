'use client';

import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import { Course, Faculty } from '@/types';
import { createCourseOffering } from '@/server/CourseOffering';
import { CreateCourseOfferingSchema } from '@/validation/course-offering';
import { getAllCourses } from '@/server/Courses';
import { getAllFacultyMember } from '@/server/FacultyAction';

interface CourseOfferingModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

export function CourseOfferingModal({
    isOpen,
    onClose,
    onSuccess,
}: CourseOfferingModalProps) {
    const [courseId, setCourseId] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [term, setTerm] = useState<'Fall' | 'Spring' | 'Summer'>('Fall');
    const [year, setYear] = useState(new Date().getFullYear());
    const [capacity, setCapacity] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isLoadingCourses, setIsLoadingCourses] = useState(false);
    const [isLoadingFacultyMember, setIsLoadingFacultyMember] = useState(false);

    const [courses, setCourses] = useState<Course[]>([]);

    const [selectedFacultyData, setSelectedFacultyData] = useState<Faculty[]>([]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});
        setIsLoading(true);

        try {
            // Validate input
            const validation = CreateCourseOfferingSchema.safeParse({
                courseId,
                instructorId,
                term,
                year,
                capacity: parseInt(capacity),
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

            const res = await createCourseOffering({
                courseId,
                instructorId,
                term,
                year,
                capacity: parseInt(capacity),
            });

            if (res.success) {
                toast.success(res.message);
                onSuccess();
            } else {
                toast.error(res.message || 'An error occurred');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    // get all courses
    const fetchCourses = async () => {
        try {
            setIsLoadingCourses(true);
            const data = await getAllCourses({ pageSize: 100000 });
            setCourses(data.items);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingCourses(false);
        }
    };

    // get all faculty member
    const fetchAllFacultyMember = async () => {
        try {
            setIsLoadingFacultyMember(true);

            const allFacultyMember = await getAllFacultyMember({ pageSize: 1000 });
            setSelectedFacultyData(allFacultyMember.items);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoadingFacultyMember(false);
        }
    };

    useEffect(() => {
        if (isOpen) {
            fetchCourses();
            fetchAllFacultyMember();
        }
    }, [isOpen]);

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
                    className="bg-white rounded-lg shadow-xl max-w-md w-full animate-in fade-in zoom-in-95 max-h-[95vh] overflow-y-auto my-10"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Add New Course Offering
                        </h2>
                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="p-1 hover:bg-gray-100 rounded-lg transition disabled:opacity-50"
                            aria-label="Close"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    {/* Body */}
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        {/* Course ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                course Id *
                            </label>
                            <select
                                value={courseId}
                                onChange={(e) => setCourseId(e.target.value)}
                                disabled={isLoading || isLoadingCourses}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Course</option>
                                {courses.map((course) => (
                                    <option key={course.id} value={course.id}>
                                        {course.title}
                                    </option>
                                ))}
                            </select>
                            {errors.courseId && (
                                <p className="text-red-500 text-sm mt-1">{errors.courseId}</p>
                            )}
                        </div>

                        {/* Instructor ID */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Instructor ID *
                            </label>
                            <select
                                value={instructorId}
                                onChange={(e) => setInstructorId(e.target.value)}
                                disabled={isLoading || isLoadingFacultyMember}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="">Select Instructor</option>
                                {selectedFacultyData.map((member) => (
                                    <option key={member.id} value={member.id}>
                                        {member.name}
                                    </option>
                                ))}
                            </select>
                            {errors.instructorId && (
                                <p className="text-red-500 text-sm mt-1">{errors.instructorId}</p>
                            )}
                        </div>

                        {/* Term */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Term *
                            </label>
                            <select
                                defaultValue={term}
                                onChange={(e) => setTerm(e.target.value as 'Fall' | 'Spring' | 'Summer')}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            >
                                <option value="Fall">Fall</option>
                                <option value="Spring">Spring</option>
                                <option value="Summer">Summer</option>
                            </select>
                            {errors.term && (
                                <p className="text-red-500 text-sm mt-1">{errors.term}</p>
                            )}
                        </div>

                        {/* Year */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Year *
                            </label>
                            <input
                                type="number"
                                // value={year}
                                defaultValue={year}
                                onChange={(e) => setYear(parseInt(e.target.value) || 0)}
                                disabled={isLoading}
                                min="1900"
                                max="2100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.year && (
                                <p className="text-red-500 text-sm mt-1">{errors.year}</p>
                            )}
                        </div>

                        {/* Capacity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Capacity *
                            </label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                disabled={isLoading}
                                min="1"
                                placeholder="Enter capacity"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed"
                            />
                            {errors.capacity && (
                                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-200">
                            <button
                                type="button"
                                onClick={onClose}
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                            >
                                {isLoading ? <Loader /> : "Create"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
