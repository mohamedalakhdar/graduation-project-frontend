'use server';

import getTokenFromCookie from '@/utils/getCookie';

/**
 * @desc     Get all course offerings
 * @access   admin
 */
interface IGetAllCourseOfferings {
    term?: string;
    year?: number;
    courseId?: string;
    instructorId?: string;
    page?: number;
    pageSize?: number;
}

export async function getAllCourseOfferings({
    term,
    year,
    courseId,
    instructorId,
    page,
    pageSize,
}: IGetAllCourseOfferings) {
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

        if (term) {
            params.append('term', term);
        }

        if (year) {
            params.append('year', String(year));
        }

        if (courseId) {
            params.append('courseId', courseId);
        }

        if (instructorId) {
            params.append('instructorId', instructorId);
        }

        const url =
            page || pageSize || term || year || courseId || instructorId
                ? `${process.env.ENDPOINTS_URL}/api/course-offerings?${params.toString()}`
                : `${process.env.ENDPOINTS_URL}/api/course-offerings`;

        const res = await fetch(url, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['course-offerings'] },
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
 * @desc     Get single course offering
 * @access   admin
 */
export async function getSingleCourseOffering(id: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/course-offerings/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['course-offering'] },
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
 * @desc     Create course offering
 * @access   admin
 */
export async function createCourseOffering(data: {
    courseId: string;
    instructorId: string;
    term: string;
    year: number;
    capacity: number;
}) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/course-offerings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        });

        const resData = await res.json();
        if (!res.ok) {
            return {
                success: false,
                message: resData.name || 'Failed to create course offering',
            };
        }

        return {
            success: true,
            message: 'Course offering created successfully',
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
 * @desc     Update course offering capacity
 * @access   admin
 */
export async function updateCourseOfferingCapacity(
    id: string,
    newCapacity: number
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
            `${process.env.ENDPOINTS_URL}/api/course-offerings/${id}/capacity`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newCapacity }),
            }
        );

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to update capacity',
            };
        }

        return {
            success: true,
            message: 'Capacity updated successfully',
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
 * @desc     Update course offering instructor
 * @access   admin
 */
export async function updateCourseOfferingInstructor(
    id: string,
    newInstructorId: string
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
            `${process.env.ENDPOINTS_URL}/api/course-offerings/${id}/instructor`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ newInstructorId }),
            }
        );

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to update instructor',
            };
        }

        return {
            success: true,
            message: 'Instructor updated successfully',
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
 * @desc     Update course offering (capacity and instructor)
 * @access   admin
 */
export async function updateCourseOffering(
    id: string,
    data: { newCapacity: number; newInstructorId: string }
) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/course-offerings/${id}`, {
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
                message: 'Failed to update course offering',
            };
        }

        return {
            success: true,
            message: 'Course offering updated successfully',
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
 * @desc     Delete course offering
 * @access   admin
 */
export async function deleteCourseOffering(id: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/course-offerings/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!res.ok) {
            return {
                success: false,
                message: 'Failed to delete course offering',
            };
        }

        return {
            success: true,
            message: 'Course offering deleted successfully',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}
