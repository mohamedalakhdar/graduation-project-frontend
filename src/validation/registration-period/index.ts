import { z } from 'zod';

export const RegistrationPeriodSchema = z
    .object({
        name: z.string().trim().min(1, 'Name is required'),
        term: z.string().trim().min(1, 'Term is required'),
        year: z.number().int().min(1900, 'Enter a valid year').max(2200, 'Enter a valid year'),
        isActive: z.boolean(),
        startDateUtc: z.string().datetime('Start date is required'),
        endDateUtc: z.string().datetime('End date is required'),
    })
    .refine((data) => new Date(data.endDateUtc) >= new Date(data.startDateUtc), {
        message: 'End date must be on or after the start date',
        path: ['endDateUtc'],
    });
