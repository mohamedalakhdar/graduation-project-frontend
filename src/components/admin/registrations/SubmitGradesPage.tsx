'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { CourseOffering } from '@/types';
import { getAllCourseOfferings } from '@/server/CourseOffering';
import { useTranslations } from '@/i18n/IntlProvider';

export default function SubmitGradesPage() {
    const t = useTranslations('Registrations');
    const tc = useTranslations('Common');

    const [offerings, setOfferings] = useState<CourseOffering[]>([]);
    const [isLoadingOfferings, setIsLoadingOfferings] = useState(true);
    const [selectedOfferingId, setSelectedOfferingId] = useState<string>('');

    useEffect(() => {
        const fetchOfferings = async () => {
            try {
                setIsLoadingOfferings(true);
                const data = await getAllCourseOfferings({ pageSize: 100000 });
                setOfferings(data?.items || []);
            } catch (error) {
                console.error(error);
                toast.error(tc('error'));
                setOfferings([]);
            } finally {
                setIsLoadingOfferings(false);
            }
        };

        fetchOfferings();
    }, [tc]);

    const handleOfferingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOfferingId(e.target.value);
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-start">
                    <h2 className="text-3xl font-bold text-gray-900">{t('submitGradesTitle')}</h2>
                    <p className="mt-1 text-gray-600">
                        {t('submitGradesSubtitle')}
                    </p>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6 max-w-2xl text-start">
                <h3 className="font-semibold text-gray-900 mb-4">{t('step1')}</h3>
                
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelCourseOffering')}
                    </label>
                    <select
                        value={selectedOfferingId}
                        onChange={handleOfferingChange}
                        disabled={isLoadingOfferings}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 disabled:cursor-not-allowed text-start"
                    >
                        <option value="">
                            {isLoadingOfferings ? t('loadingOfferings') : t('selectOffering')}
                        </option>
                        {offerings.map((offering) => (
                            <option key={offering.offeringId} value={offering.offeringId}>
                                {offering.courseTitle} ({offering.courseCode}) - {offering.term} {offering.year}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedOfferingId && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 text-sm">
                        <p className="font-semibold mb-1">{t('comingSoon')}</p>
                        <p>
                            {t('comingSoonDesc')}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
