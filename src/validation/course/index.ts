import { z } from 'zod';

/**
 * @desc     Validation schema for create course form
 * @access   admin
 */
export const CreateCourseSchema = z.object({
    departmentId: z.string().min(1, { message: 'Department is required' }),
    code: z
        .string()
        .regex(/^[A-Za-z]{3}\s?\d{3}$/, {
            message: 'Code must be 3 letters followed by 3 digits (e.g. CSC123 or CSC 123)',
        }),
    title: z.string().min(2, { message: 'Title must be at least 2 characters long' }).max(100, { message: 'Title must be at most 100 characters long' }),
    description: z.string().min(5, { message: 'Description must be at least 5 characters long' }).max(500, { message: 'Description must be at most 500 characters long' }),
    credits: z
        .number()
        .int('Credits must be an integer')
        .min(1, 'Credits must be at least 1')
        .max(100, 'Credits must be at most 100'),
    lectureHours: z
        .number()
        .int('Lecture hours must be an integer')
        .min(0, 'Lecture hours cannot be negative')
        .max(100, 'Lecture hours must be at most 100'),
    labHours: z
        .number()
        .int('Lab hours must be an integer')
        .min(0, 'Lab hours cannot be negative')
        .max(100, 'Lab hours must be at most 100'),
});

/**
 * @desc     Validation schema for update course form
 * @access   admin
 */
export const UpdateCourseSchema = z.object({
    departmentId: z.string().min(1, { message: 'Department is required' }),
    title: z.string().min(2, { message: 'Title must be at least 2 characters long' }).max(100, { message: 'Title must be at most 100 characters long' }),
    description: z.string().min(5, { message: 'Description must be at least 5 characters long' }).max(500, { message: 'Description must be at most 500 characters long' }),
    credits: z
        .number()
        .int('Credits must be an integer')
        .min(1, 'Credits must be at least 1')
        .max(100, 'Credits must be at most 100'),
    lectureHours: z
        .number()
        .int('Lecture hours must be an integer')
        .min(0, 'Lecture hours cannot be negative')
        .max(100, 'Lecture hours must be at most 100'),
    labHours: z
        .number()
        .int('Lab hours must be an integer')
        .min(0, 'Lab hours cannot be negative')
        .max(100, 'Lab hours must be at most 100'),
});

/**
 * @desc     Validation schema for add course prerequisite
 * @access   admin
 */
export const AddCoursePrerequisiteSchema = z.object({
    prerequisiteCourseId: z.string().min(1, { message: 'Prerequisite course is required' }),
});

export type CreateCourseInput = z.infer<typeof CreateCourseSchema>;
export type UpdateCourseInput = z.infer<typeof UpdateCourseSchema>;
export type AddCoursePrerequisiteInput = z.infer<typeof AddCoursePrerequisiteSchema>;
