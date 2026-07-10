'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import {
    getSingleCourseOffering,
    updateCourseOffering,
    updateCourseOfferingCapacity,
    updateCourseOfferingInstructor,
} from '@/server/CourseOffering';
import { getAllFacultyMember } from '@/server/FacultyAction';
import { CourseOffering, Faculty } from '@/types';
import {
    UpdateCourseOfferingCapacitySchema,
    UpdateCourseOfferingInstructorSchema,
    UpdateCourseOfferingSchema,
} from '@/validation/course-offering';

interface EditCourseOfferingPageProps {
    courseOfferingId: string;
}

export default function EditCourseOfferingPage({ courseOfferingId }: EditCourseOfferingPageProps) {
    const router = useRouter();
    const [courseOffering, setCourseOffering] = useState<CourseOffering | null>(null);
    const [facultyMembers, setFacultyMembers] = useState<Faculty[]>([]);
    const [capacity, setCapacity] = useState('');
    const [instructorId, setInstructorId] = useState('');
    const [originalCapacity, setOriginalCapacity] = useState(0);
    const [originalInstructorId, setOriginalInstructorId] = useState('');
    const [isLoadingCourseOffering, setIsLoadingCourseOffering] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoadingCourseOffering(true);

                const [courseOfferingData, facultyData] = await Promise.all([
                    getSingleCourseOffering(courseOfferingId),
                    getAllFacultyMember({ pageSize: 1000 }),
                ]);

                if (courseOfferingData) {
                    setCourseOffering(courseOfferingData);
                    setCapacity(String(courseOfferingData.capacity));
                    setInstructorId(courseOfferingData.instructorId);
                    setOriginalCapacity(courseOfferingData.capacity);
                    setOriginalInstructorId(courseOfferingData.instructorId);
                }

                if (facultyData && 'items' in facultyData) {
                    setFacultyMembers(facultyData.items || []);
                }
            } catch (error) {
                console.error(error);
                toast.error('Failed to fetch course offering details');
            } finally {
                setIsLoadingCourseOffering(false);
            }
        };

        fetchData();
    }, [courseOfferingId]);

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        const newCapacity = Number(capacity);
        const capacityChanged = newCapacity !== originalCapacity;
        const instructorChanged = instructorId !== originalInstructorId;

        if (!capacityChanged && !instructorChanged) {
            toast('No changes to save');
            return;
        }

        const validation = capacityChanged && instructorChanged
            ? UpdateCourseOfferingSchema.safeParse({ newCapacity, newInstructorId: instructorId })
            : capacityChanged
                ? UpdateCourseOfferingCapacitySchema.safeParse({ newCapacity })
                : UpdateCourseOfferingInstructorSchema.safeParse({ newInstructorId: instructorId });

        if (!validation.success) {
            const fieldErrors = validation.error.flatten().fieldErrors;
            setErrors({
                capacity: 'newCapacity' in fieldErrors ? fieldErrors.newCapacity?.[0] || '' : '',
                instructorId: 'newInstructorId' in fieldErrors
                    ? fieldErrors.newInstructorId?.[0] || ''
                    : '',
            });
            return;
        }

        setIsSaving(true);

        try {
            const res = capacityChanged && instructorChanged
                ? await updateCourseOffering(courseOfferingId, {
                    newCapacity,
                    newInstructorId: instructorId,
                })
                : capacityChanged
                    ? await updateCourseOfferingCapacity(courseOfferingId, newCapacity)
                    : await updateCourseOfferingInstructor(courseOfferingId, instructorId);

            if (res.success) {
                setOriginalCapacity(newCapacity);
                setOriginalInstructorId(instructorId);
                setCourseOffering((current) => current ? {
                    ...current,
                    capacity: newCapacity,
                    instructorId,
                    instructorName: facultyMembers.find((member) => member.id === instructorId)?.name
                        || current.instructorName,
                } : current);
                toast.success(res.message);
            } else {
                toast.error(res.message || 'Failed to update course offering');
            }
        } catch (error) {
            console.error(error);
            toast.error('An error occurred');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoadingCourseOffering) {
        return (
            <div className="flex items-center justify-center h-96">
                <Loader />
            </div>
        );
    }

    if (!courseOffering) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">Course offering not found</p>
                <button
                    onClick={() => router.push('/admin/course-offering')}
                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition"
                >
                    Back to Course Offerings
                </button>
            </div>
        );
    }

    const disabledInputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600';
    const editableInputClass = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed';

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => router.push('/admin/course-offering')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Edit Course Offering</h2>
                    <p className="text-gray-600">
                        {courseOffering.courseCode} - {courseOffering.courseTitle}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Course Offering Details</h3>

                <form onSubmit={handleSaveChanges} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Offering ID</label>
                            <input
                                value={courseOffering.offeringId || courseOfferingId}
                                disabled
                                className={disabledInputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course ID</label>
                            <input value={courseOffering.courseId} disabled className={disabledInputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                            <input
                                value={`${courseOffering.courseCode} - ${courseOffering.courseTitle}`}
                                disabled
                                className={disabledInputClass}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Instructor *</label>
                            <select
                                value={instructorId}
                                onChange={(e) => setInstructorId(e.target.value)}
                                disabled={isSaving}
                                className={editableInputClass}
                            >
                                <option value="">Select Instructor</option>
                                {facultyMembers.map((member) => (
                                    <option key={member.id} value={member.id}>{member.name}</option>
                                ))}
                            </select>
                            {errors.instructorId && (
                                <p className="text-red-500 text-sm mt-1">{errors.instructorId}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Term</label>
                            <input value={courseOffering.term} disabled className={disabledInputClass} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                            <input value={courseOffering.year} disabled className={disabledInputClass} />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Capacity *</label>
                            <input
                                type="number"
                                value={capacity}
                                onChange={(e) => setCapacity(e.target.value)}
                                disabled={isSaving}
                                min="1"
                                className={editableInputClass}
                            />
                            {errors.capacity && (
                                <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Enrolled</label>
                            <input value={courseOffering.enrolled} disabled className={disabledInputClass} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full</label>
                        <input value={courseOffering.isFull ? 'Yes' : 'No'} disabled className={disabledInputClass} />
                    </div>

                    <p className="text-sm text-gray-500">Disabled fields cannot be edited.</p>

                    <div className="flex gap-3 pt-4 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => router.push('/admin/course-offering')}
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
                        >
                            {isSaving ? <Loader /> : "Save Changes"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
