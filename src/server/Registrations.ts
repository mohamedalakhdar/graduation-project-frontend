'use server';

import getTokenFromCookie from '@/utils/getCookie';
import { GradeSubmission } from '@/types';
import { getAdvisorOrProfData } from './FacultyAction';

/**
 * @desc     Get all registrations
 * @access   admin
 */
interface IGetAllRegistrations {
    status?: string;
    studentId?: string;
    courseOfferingId?: string;
    semester?: string;
    year?: number;
    page?: number;
    pageSize?: number;
}

export async function getAllRegistrations({
    status,
    studentId,
    courseOfferingId,
    semester,
    year,
    page,
    pageSize,
}: IGetAllRegistrations) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const params = new URLSearchParams();

        if (page) params.append('page', String(page));
        if (pageSize) params.append('pageSize', String(pageSize));
        if (status) params.append('status', status);
        if (studentId) params.append('studentId', studentId);
        if (courseOfferingId) params.append('courseOfferingId', courseOfferingId);
        if (semester) params.append('semester', semester);
        if (year) params.append('year', String(year));

        const hasParams = status || studentId || courseOfferingId || semester || year || page || pageSize;
        const url = hasParams
            ? `${process.env.ENDPOINTS_URL}/api/registrations?${params.toString()}`
            : `${process.env.ENDPOINTS_URL}/api/registrations`;

        const res = await fetch(url, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            next: { tags: ['registrations'] },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Get pending registrations
 * @access   admin
 */
export async function getPendingRegistrations(advisorId: string) {
    try {
        const token = await getTokenFromCookie();
        if (!token) {
            console.log('No token found');
            return null;
        }

        // get advisor or prof data
        const dataAdvisorOrProf = await getAdvisorOrProfData(advisorId);

        const params = new URLSearchParams({
            advisorId: dataAdvisorOrProf.id,
        });

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/pending?${params.toString()}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                next: {
                    tags: ['registrations-pending'],
                },
            }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Approve a registration
 * @access   admin
 */
export async function approveRegistration(id: string, advisorId: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return { success: false, message: 'Unauthorized' };
        }

        // get advisor or prof data
        const dataAdvisorOrProf = await getAdvisorOrProfData(id);

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/${dataAdvisorOrProf.id}/approve`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ advisorId }),
            }
        );

        const data = await res.json();

        if (!res.ok) {
            return { success: false, message: data?.name || "Failed to approve registration" };
        }

        return { success: true, message: data?.name || "Registration approved successfully" };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/**
 * @desc     Drop a registration
 * @access   admin
 */
export async function dropRegistration(id: string, studentId: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return { success: false, message: 'Unauthorized' };
        }

        // console.log(id,'kerolos----------------', studentId, 'Kerolos ----------------------', token)

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/${id}/drop`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ studentId }),
            }
        );

        // console.log("res---------------------", res)

        if (!res.ok) {
            return { success: false, message: 'Failed to drop registration' };
        }

        // const data = await res.json();
        // console.log('data +++++++++++++++++++++++', data)

        return { success: true, message: 'Registration dropped successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/**
 * @desc     Withdraw a registration
 * @access   admin
 */
export async function withdrawRegistration(id: string, studentId: string) {
    try {
        const token = await getTokenFromCookie();
        // console.log(id, 'kerolos----------------', studentId, 'Kerolos ----------------------', token)


        if (!token) {
            return { success: false, message: 'Unauthorized' };
        }

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/${id}/withdraw`,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ studentId }),
            }
        );

        // console.log('res +++++++++++++++++++++++', res)
        if (!res.ok) {
            return { success: false, message: 'Failed to withdraw registration' };
        }

        const data = await res.json();
        // console.log('data +++++++++++++++++++++++', data)

        return { success: true, message: 'Registration withdrawn successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/**
 * @desc     Get student schedule
 * @access   admin
 */
export async function getStudentSchedule(studentId: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/schedule/${studentId}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                next: { tags: ['student-schedule'] },
            }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Get available courses for a student
 * @access   admin
 */
interface IGetAvailableCourses {
    studentId: string;
    term?: string;
    year?: number;
}

export async function getAvailableCourses({ studentId, term, year }: IGetAvailableCourses) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const params = new URLSearchParams();
        params.append('studentId', studentId);
        if (term) params.append('term', term);
        if (year) params.append('year', String(year));

        const res = await fetch(
            `${process.env.ENDPOINTS_URL}/api/registrations/available?${params.toString()}`,
            {
                method: 'GET',
                headers: { Authorization: `Bearer ${token}` },
                next: { tags: ['available-courses'] },
            }
        );

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Submit grades for a course offering
 * @access   admin
 */
export async function submitGrades(offeringId: string, submissions: GradeSubmission[]) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return { success: false, message: 'Unauthorized' };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/registrations/submit`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ offeringId, submissions }),
        });

        if (!res.ok) {
            return { success: false, message: 'Failed to submit grades' };
        }

        return { success: true, message: 'Grades submitted successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/**
 * @desc     Get single registration
 * @access   admin
 */
export async function getSingleRegistration(id: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/registrations/${id}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            next: { tags: ['registration'] },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

/**
 * @desc     Get registration grade
 * @access   admin
 */
export async function getRegistrationGrade(id: string) {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/registrations/${id}/grade`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            next: { tags: ['registration-grade'] },
        });

        if (!res.ok) return null;

        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error);
        return null;
    }
}
