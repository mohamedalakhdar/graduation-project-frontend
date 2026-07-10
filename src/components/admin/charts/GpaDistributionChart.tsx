'use client';

import { ControlStatistics } from '@/types';
import { useTranslations } from '@/i18n/IntlProvider';

interface GpaDistributionChartProps {
    statistics: ControlStatistics | null;
    isLoading: boolean;
}

/**
 * Derives approximate GPA band distribution from known student counts and average CGPA.
 * The API does not return per-band counts, so we estimate using the status breakdown
 * (active → good GPA, warning → borderline, dismissed → failed) combined with averageCGPA.
 */
function deriveGpaBands(statistics: ControlStatistics | null): Record<string, number> {
    if (!statistics) {
        return { '3.5–4.0': 0, '3.0–3.5': 0, '2.5–3.0': 0, '2.0–2.5': 0, '0–2.0': 0 };
    }

    const { activeStudents, warningStudents, dismissedStudents, graduatedStudents } = statistics;

    // Spread active students across higher GPA bands based on average CGPA
    const avg = statistics.averageCGPA ?? 0;
    const highBandRatio = Math.min(1, Math.max(0, (avg - 3.0) / 1.0)); // 0 at 3.0, 1 at 4.0

    const band35to40 = Math.round(activeStudents * highBandRatio * 0.8 + graduatedStudents * 0.6);
    const band30to35 = Math.round(activeStudents * (1 - highBandRatio) * 0.6 + graduatedStudents * 0.4);
    const band25to30 = Math.round(activeStudents * (1 - highBandRatio) * 0.4);
    const band20to25 = Math.round(warningStudents * 0.7);
    const band0to20  = Math.round(warningStudents * 0.3 + dismissedStudents);

    return {
        '3.5–4.0': band35to40,
        '3.0–3.5': band30to35,
        '2.5–3.0': band25to30,
        '2.0–2.5': band20to25,
        '0–2.0':   band0to20,
    };
}

export function GpaDistributionChart({ statistics, isLoading }: GpaDistributionChartProps) {
    const t = useTranslations('Dashboard');

    if (isLoading) {
        return (
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('gpaDistribution')}</h3>
                <div className="space-y-6">
                    {[0, 1, 2, 3, 4].map((i) => (
                        <div key={i} className="animate-pulse">
                            <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
                            <div className="h-3 w-full bg-gray-200 rounded-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const gpaDistribution = deriveGpaBands(statistics);
    const maxValue = Math.max(...Object.values(gpaDistribution), 1);

    return (
        <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">{t('gpaDistribution')}</h3>

            <div className="space-y-6">
                {Object.entries(gpaDistribution).map(([range, count]) => {
                    const percentage = ((count / maxValue) * 100).toFixed(0);
                    return (
                        <div key={range}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">
                                    {t('gpaRange', { range })}
                                </span>
                                <span className="text-sm font-semibold text-gray-900">
                                    {t('studentsCount', { count })}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <div
                                    className="bg-gradient-to-r from-[#00284d] to-[#003465] h-full rounded-full transition-all duration-500"
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                    <span className="font-semibold">{t('noteTitle')}</span> {t('noteContent')}
                </p>
            </div>
        </div>
    );
}
