import { z } from 'zod';

export const RunControlEngineSchema = z.object({
    term: z.enum(['Fall', 'Spring', 'Summer'], {
        message: 'Term must be Fall, Spring, or Summer',
    }),
    year: z
        .number()
        .int('Year must be an integer')
        .min(1900, 'Year must be after 1900')
        .max(2100, 'Year must be before 2100'),
});

export type RunControlEngineInput = z.infer<typeof RunControlEngineSchema>;
