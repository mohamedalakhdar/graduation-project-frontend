'use client';

import { useTranslations } from '@/i18n/IntlProvider';

interface ViewFilterDropdownProps {
    selectedView: 'warnings' | 'graduates';
    onViewChange: (view: 'warnings' | 'graduates') => void;
    isLoading: boolean;
}

export function ViewFilterDropdown({
    selectedView,
    onViewChange,
    isLoading,
}: ViewFilterDropdownProps) {
    const t = useTranslations('ControlEngine');

    return (
        <div className="bg-white rounded-lg shadow overflow-hidden p-6 border border-gray-200 text-start">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
                {t('viewLabel')}
            </label>
            <select
                value={selectedView}
                onChange={(e) => onViewChange(e.target.value as 'warnings' | 'graduates')}
                disabled={isLoading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00284d] focus:border-transparent disabled:opacity-50 transition"
            >
                <option value="warnings">{t('viewWarningsOption')}</option>
                <option value="graduates">{t('viewGraduatesOption')}</option>
            </select>
        </div>
    );
}
