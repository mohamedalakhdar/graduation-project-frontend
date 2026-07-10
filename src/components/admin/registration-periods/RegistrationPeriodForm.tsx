'use client';

import { useState } from 'react';
import { DateRange } from 'react-day-picker';
import Loader from '@/components/ui/Loader';
import { RegistrationPeriod, RegistrationPeriodFormData } from '@/types';
import { RegistrationPeriodSchema } from '@/validation/registration-period';
import { DateRangePicker } from './DateRangePicker';

interface RegistrationPeriodFormProps {
    defaultValues?: RegistrationPeriod | null;
    isSaving: boolean;
    submitText: string;
    onSubmit: (data: RegistrationPeriodFormData) => Promise<void>;
    onCancel: () => void;
}

function toDate(value?: string) {
    if (!value) return undefined;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? undefined : date;
}

export function RegistrationPeriodForm({
    defaultValues,
    isSaving,
    submitText,
    onSubmit,
    onCancel,
}: RegistrationPeriodFormProps) {
    const [name, setName] = useState(defaultValues?.name || '');
    const [term, setTerm] = useState(defaultValues?.term || '');
    const [year, setYear] = useState(String(defaultValues?.year || new Date().getFullYear()));
    const [isActive, setIsActive] = useState(defaultValues?.isActive || false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>({
        from: toDate(defaultValues?.startDateUtc),
        to: toDate(defaultValues?.endDateUtc),
    });
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setErrors({});

        const data = {
            name,
            term,
            year: Number(year),
            isActive,
            startDateUtc: dateRange?.from?.toISOString() || '',
            endDateUtc: dateRange?.to?.toISOString() || '',
        };
        const validation = RegistrationPeriodSchema.safeParse(data);

        if (!validation.success) {
            const fieldErrors: Record<string, string> = {};
            Object.entries(validation.error.flatten().fieldErrors).forEach(([key, messages]) => {
                if (messages?.[0]) fieldErrors[key] = messages[0];
            });
            setErrors(fieldErrors);
            return;
        }

        await onSubmit(validation.data);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Name *</label>
                    <input
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        disabled={isSaving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition focus:border-transparent focus:ring-2 focus:ring-[#00284d] disabled:bg-gray-100"
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Term *</label>
                    <input
                        value={term}
                        onChange={(event) => setTerm(event.target.value)}
                        disabled={isSaving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition focus:border-transparent focus:ring-2 focus:ring-[#00284d] disabled:bg-gray-100"
                    />
                    {errors.term && <p className="mt-1 text-sm text-red-500">{errors.term}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">Year *</label>
                    <input
                        type="number"
                        min="1900"
                        max="2200"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        disabled={isSaving}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 transition focus:border-transparent focus:ring-2 focus:ring-[#00284d] disabled:bg-gray-100"
                    />
                    {errors.year && <p className="mt-1 text-sm text-red-500">{errors.year}</p>}
                </div>
                <div className="flex items-end">
                    <label className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-lg border border-gray-300 px-3 text-sm font-medium text-gray-700">
                        <input
                            type="checkbox"
                            checked={isActive}
                            onChange={(event) => setIsActive(event.target.checked)}
                            disabled={isSaving}
                            className="h-4 w-4 accent-[#00284d]"
                        />
                        Active registration period
                    </label>
                </div>
            </div>

            <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date Range *</label>
                <DateRangePicker value={dateRange} onChange={setDateRange} disabled={isSaving} />
                {(errors.startDateUtc || errors.endDateUtc) && (
                    <p className="mt-1 text-sm text-red-500">{errors.startDateUtc || errors.endDateUtc}</p>
                )}
            </div>

            <div className="flex gap-3 border-t border-gray-200 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isSaving}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition hover:bg-gray-100 disabled:opacity-50"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#00284d] px-4 py-2 font-medium text-white transition hover:bg-[#003465] disabled:opacity-50"
                >
                    {isSaving ? <Loader /> : submitText}
                </button>
            </div>
        </form>
    );
}
