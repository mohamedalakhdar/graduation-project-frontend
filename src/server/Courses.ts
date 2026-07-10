'use server';

import getTokenFromCookie from '@/utils/getCookie';
import { Course, CoursePrerequisite } from '@/types';

/**
 * @desc     Get all courses
 * @access   admin
 */
interface IGetAllCourses {
    search?: string;
    departmentId?: string;
    minCredits?: number;
    maxCredits?: number;
    page?: number;
    pageSize?: number;
}

export async function getAllCourses({
    search,
    departmentId,
    minCredits,
    maxCredits,
    page,
    pageSize,
}: IGetAllCourses) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const params = new URLSearchParams();

        if (page) {
            params.append('page', String(page));
        }

        if (pageSize) {
            params.append('pageSize', String(pageSize));
        }

        if (search) {
            params.append('search', search);
        }

        if (departmentId) {
            params.append('departmentId', departmentId);
        }

        if (minCredits !== undefined) {
            params.append('minCredits', String(minCredits));
        }

        if (maxCredits !== undefined) {
            params.append('maxCredits', String(maxCredits));
        }

        const url =
            page || pageSize || search || departmentId || minCredits !== undefined || maxCredits !== undefined
                ? `${process.env.ENDPOINTS_URL}/api/courses?${params.toString()}`
                : `${process.env.ENDPOINTS_URL}/api/courses`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['courses'] },
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Get single course
 * @access   admin
 */
export async function getSingleCourse(id: string): Promise<Course | null> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/courses/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['course'] },
        });

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Create course
 * @access   admin
 */
export async function createCourse(data: {
    departmentId: string;
    code: string;
    title: string;
    description: string;
    credits: number;
    lectureHours: number;
    labHours: number;
}) {
    try {
        const token = await getTokenFromCookie();
        console.log("9090909090990", data)

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/courses`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData = await res.json()

        if (!res.ok) {
            return {
                success: false,
                message: resData.name || 'Failed to create course',
            };
        }

        return {
            success: true,
            message: 'Course created successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}

/**
 * @desc     Update course
 * @access   admin
 */
export async function updateCourse(
    id: string,
    data: {
        departmentId: string;
        title: string;
        description: string;
        credits: number;
        lectureHours: number;
        labHours: number;
    }
) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/courses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to update course',
            };
        }

        return {
            success: true,
            message: 'Course updated successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}

/**
 * @desc     Delete course
 * @access   admin
 */
export async function deleteCourse(id: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/courses/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        let data;
        if(res.body) {
            data = await res.json();
        }

        if (!res.ok) {
            return {
                success: false,
                message: data && data.name || 'Failed to delete course',
            };
        }

        return {
            success: true,
            message: 'Course deleted successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}

/**
 * @desc     Get course prerequisites
 * @access   admin
 */
export async function getCoursePrerequisites(courseId: string): Promise<CoursePrerequisite[] | null> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/courses/${courseId}/prerequisites`,
            {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                next: { tags: ['course-prerequisites'] },
            }
        );

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Add course prerequisite
 * @access   admin
 */
export async function addCoursePrerequisite(
    courseId: string,
    prerequisiteCourseId: string
) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/courses/${courseId}/prerequisites`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ prerequisiteCourseId }),
            }
        );

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to add prerequisite',
            };
        }

        return {
            success: true,
            message: 'Prerequisite added successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}

/**
 * @desc     Delete course prerequisite
 * @access   admin
 */
export async function deleteCoursePrerequisite(
    courseId: string,
    prerequisiteId: string
) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/courses/${courseId}/prerequisites/${prerequisiteId}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to delete prerequisite',
            };
        }

        return {
            success: true,
            message: 'Prerequisite deleted successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}
