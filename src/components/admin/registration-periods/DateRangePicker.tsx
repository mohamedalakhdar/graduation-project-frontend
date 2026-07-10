'use client';

import { addYears, format, startOfYear } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { DayPicker, DateRange } from 'react-day-picker';

interface DateRangePickerProps {
    value?: DateRange;
    onChange: (range: DateRange | undefined) => void;
    disabled?: boolean;
}

export function DateRangePicker({ value, onChange, disabled = false }: DateRangePickerProps) {
    const today = new Date();

    return (
        <div className="rounded-lg border border-gray-300 p-4">
            <div className="mb-4 flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays size={18} />
                <span>
                    {value?.from ? format(value.from, 'MMM d, yyyy') : 'Start date'}
                    {' - '}
                    {value?.to ? format(value.to, 'MMM d, yyyy') : 'End date'}
                </span>
            </div>
            <DayPicker
                mode="range"
                selected={value}
                onSelect={onChange}
                disabled={disabled}
                captionLayout="dropdown"
                startMonth={addYears(startOfYear(today), -10)}
                endMonth={addYears(startOfYear(today), 10)}
                showOutsideDays
                classNames={{
                    root: 'w-full',
                    months: 'flex justify-center',
                    month: 'w-full max-w-md space-y-4',
                    month_caption: 'flex h-10 items-center justify-center',
                    dropdowns: 'flex items-center justify-center gap-2',
                    dropdown_root: 'relative rounded-lg border border-gray-300 px-2 py-1',
                    dropdown: 'absolute inset-0 cursor-pointer opacity-0',
                    caption_label: 'text-sm font-medium text-gray-900',
                    nav: 'flex items-center justify-between',
                    button_previous: 'absolute rounded-lg p-2 text-gray-600 hover:bg-gray-100',
                    button_next: 'absolute right-4 rounded-lg p-2 text-gray-600 hover:bg-gray-100',
                    chevron: 'h-4 w-4 fill-gray-600',
                    month_grid: 'w-full border-collapse',
                    weekdays: 'flex',
                    weekday: 'w-[14.285%] py-2 text-center text-xs font-medium text-gray-500',
                    week: 'mt-1 flex w-full',
                    day: 'relative h-10 w-[14.285%] p-0 text-center text-sm',
                    day_button: 'h-10 w-full rounded-lg hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-[#00284d]',
                    today: 'font-bold text-[#00284d]',
                    outside: 'text-gray-300',
                    disabled: 'cursor-not-allowed text-gray-300 opacity-50',
                    range_start: 'rounded-l-lg bg-[#00284d] text-white',
                    range_end: 'rounded-r-lg bg-[#00284d] text-white',
                    range_middle: 'rounded-none bg-blue-100 text-gray-900',
                    selected: 'bg-[#00284d] text-white',
                }}
            />
        </div>
    );
}
