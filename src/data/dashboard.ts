/**
 * Static Dashboard Data
 * Fixed statistics and chart data — no fetching required
 */

import { StudentStatistics } from '@/types';

export const dashboardStats: StudentStatistics = {
    totalStudents: 5,
    activeStudents: 3,
    warningStudents: 1,
    dismissedStudents: 1,
    averageGPA: 3.0,
};

/**
 * GPA Distribution — counts per range band
 */
export const gpaDistribution: Record<string, number> = {
    '3.5–4.0': 2,
    '3.0–3.5': 1,
    '2.5–3.0': 1,
    '2.0–2.5': 0,
    '0–2.0': 1,
};
