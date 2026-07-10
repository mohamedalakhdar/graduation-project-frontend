'use server';

import getTokenFromCookie from '@/utils/getCookie';
import { RegistrationPeriod, RegistrationPeriodFormData } from '@/types';
import { RegistrationPeriodSchema } from '@/validation/registration-period';

const registrationPeriodsUrl = `${process.env.ENDPOINTS_URL}/api/registration-periods`;

function getResponseMessage(data: unknown, fallback: string) {
    if (data && typeof data === 'object') {
        const response = data as { message?: string; name?: string; title?: string };
        return response.message || response.name || response.title || fallback;
    }
    return fallback;
}

async function readResponse(res: Response) {
    const contentType = res.headers.get('content-type');
    return contentType?.includes('application/json') ? res.json() : null;
}

/** @desc Get all registration periods @access admin */
export async function getAllRegistrationPeriods(): Promise<RegistrationPeriod[] | { items: RegistrationPeriod[] } | null> {
    try {
        const token = await getTokenFromCookie();
        if (!token) return null;

        const res = await fetch(registrationPeriodsUrl, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

/** @desc Get the current registration period @access admin */
export async function getCurrentRegistrationPeriod(): Promise<RegistrationPeriod | RegistrationPeriod[] | null> {
    try {
        const token = await getTokenFromCookie();
        if (!token) return null;

        const res = await fetch(`${registrationPeriodsUrl}/current`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
        });

        if (!res.ok) return null;
        return await res.json();
    } catch (error) {
        console.log(error);
        return null;
    }
}

/** @desc Get a registration period from the collection @access admin */
export async function getSingleRegistrationPeriod(id: string): Promise<RegistrationPeriod | null> {
    const response = await getAllRegistrationPeriods();
    const periods = Array.isArray(response) ? response : response?.items || [];
    return periods.find((period) => period.id === id) || null;
}

/** @desc Create a registration period @access admin */
export async function createRegistrationPeriod(data: RegistrationPeriodFormData) {
    const validation = RegistrationPeriodSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Invalid registration period data' };
    }

    try {
        const token = await getTokenFromCookie();
        if (!token) return { success: false, message: 'Unauthorized' };

        const res = await fetch(registrationPeriodsUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(validation.data),
        });
        const response = await readResponse(res);

        if (!res.ok) {
            return { success: false, message: getResponseMessage(response, 'Failed to create registration period') };
        }
        return { success: true, message: 'Registration period created successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/** @desc Update a registration period @access admin */
export async function updateRegistrationPeriod(id: string, data: RegistrationPeriodFormData) {
    const validation = RegistrationPeriodSchema.safeParse(data);
    if (!validation.success) {
        return { success: false, message: 'Invalid registration period data' };
    }

    try {
        const token = await getTokenFromCookie();
        if (!token) return { success: false, message: 'Unauthorized' };

        const res = await fetch(`${registrationPeriodsUrl}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(validation.data),
        });
        const response = await readResponse(res);

        if (!res.ok) {
            return { success: false, message: getResponseMessage(response, 'Failed to update registration period') };
        }
        return { success: true, message: 'Registration period updated successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}

/** @desc Delete a registration period @access admin */
export async function deleteRegistrationPeriod(id: string) {
    try {
        const token = await getTokenFromCookie();
        if (!token) return { success: false, message: 'Unauthorized' };

        const res = await fetch(`${registrationPeriodsUrl}/${id}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        const response = await readResponse(res);

        if (!res.ok) {
            return { success: false, message: getResponseMessage(response, 'Failed to delete registration period') };
        }
        return { success: true, message: 'Registration period deleted successfully' };
    } catch (error) {
        console.log(error);
        return { success: false, message: 'Internal server error' };
    }
}
