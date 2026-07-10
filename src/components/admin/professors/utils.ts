import { Roles } from '@/enums';

export function extractItems<T>(data: unknown): T[] {
    if (Array.isArray(data)) return data as T[];

    if (data && typeof data === 'object') {
        const value = data as { items?: unknown; data?: unknown };
        if (Array.isArray(value.items)) return value.items as T[];
        if (Array.isArray(value.data)) return value.data as T[];
    }

    return [];
}

type AdvisorRoleSource = {
    isAdvisor?: boolean;
    role?: string;
    roles?: string | string[];
};

export function hasAdvisorRole(facultyMember: AdvisorRoleSource): boolean {
    if (facultyMember.isAdvisor) return true;
    if (facultyMember.role === Roles.Advisor) return true;

    if (Array.isArray(facultyMember.roles)) {
        return facultyMember.roles.includes(Roles.Advisor);
    }

    return facultyMember.roles
        ?.split(',')
        .map((role) => role.trim())
        .includes(Roles.Advisor) ?? false;
}
