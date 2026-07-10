'use client';

import { Edit2, Trash2 } from 'lucide-react';
import { CourseOffering } from '@/types';
import Link from 'next/link';

interface CourseOfferingTableProps {
    data: CourseOffering[] | null;
    isLoading: boolean;
    onDelete: (offering: CourseOffering) => void;
}

export function CourseOfferingTable({
    data,
    isLoading,
    onDelete,
}: CourseOfferingTableProps) {
    return (
        <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Course
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Instructor
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                isFull
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Year
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Capacity
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Enrolled
                            </th>
                            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {isLoading ? (
                            // Skeleton Loading
                            Array.from({ length: 6 }).map((_, index) => (
                                <tr key={index} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-16 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                            <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : !data || data.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                                    No course offerings found.
                                </td>
                            </tr>
                        ) : (
                            data.map((offering) => (
                                <tr key={offering.offeringId} className="hover:bg-gray-50 transition">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {offering.courseTitle} ({offering.courseCode})
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {offering.instructorName || 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {offering.isFull ? "Yes" : "No"}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {offering.year}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {offering.capacity}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {offering.enrolled || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/admin/course-offering/${offering.offeringId}`}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                            >
                                                <Edit2 size={16} />
                                            </Link>
                                            <button
                                                onClick={() => onDelete(offering)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
