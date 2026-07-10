'use server';

import getTokenFromCookie from '@/utils/getCookie';
import {
    WarningStudent,
    GraduationCandidate,
    ControlStatistics,
} from '@/types';

/**
 * @desc     Get all students with academic warnings
 * @access   admin
 */
export async function getWarningsStudents(): Promise<WarningStudent[] | null> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/control/warnings`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['control-warnings'] },
        });

        if (!res.ok) {
            console.log('Failed to fetch warnings students');
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error fetching warnings students:', error);
        return null;
    }
}

/**
 * @desc     Get all graduation candidates
 * @access   admin
 */
export async function getGraduatesStudents(): Promise<GraduationCandidate[] | null> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/control/graduates`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['control-graduates'] },
        });

        if (!res.ok) {
            console.log('Failed to fetch graduates students');
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error fetching graduates students:', error);
        return null;
    }
}

/**
 * @desc     Get control engine statistics
 * @access   admin
 */
export async function getControlStatistics(): Promise<ControlStatistics | null> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            console.log('No token found');
            return null;
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/control/statistics`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            next: { tags: ['control-statistics'] },
        });

        if (!res.ok) {
            console.log('Failed to fetch control statistics');
            return null;
        }

        const data = await res.json();
        return data;
    } catch (error) {
        console.log('Error fetching control statistics:', error);
        return null;
    }
}

/**
 * @desc     Run control engine
 * @access   admin
 */
export async function runControlEngine(
    term: string,
    year: number
): Promise<{ success: boolean; message: string }> {
    try {
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: 'Unauthorized, Please Login First!',
            };
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/control/run-engine`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ term, year }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.message || 'Failed to run control engine',
            };
        }

        return {
            success: true,
            message: data.message || 'Control engine executed successfully',
        };
    } catch (error) {
        console.log('Error running control engine:', error);
        return {
            success: false,
            message: 'Internal server error',
        };
    }
}
