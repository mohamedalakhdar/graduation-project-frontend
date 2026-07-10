import { z } from 'zod';

/**
 * @desc     Validation schema for create course offering form
 * @access   admin
 */
export const CreateCourseOfferingSchema = z.object({
    courseId: z.string().min(1, { message: 'Course is required' }),
    instructorId: z.string().min(1, { message: 'Instructor is required' }),
    term: z.enum(['Fall', 'Spring', 'Summer'], {
        message: 'Term must be Fall, Spring, or Summer',
    }),
    year: z
        .number()
        .int('Year must be an integer')
        .min(1900, 'Year must be after 1900')
        .max(2100, 'Year must be before 2100'),
    capacity: z
        .number()
        .int('Capacity must be an integer')
        .min(1, 'Capacity must be at least 1'),
});

/**
 * @desc     Validation schema for update course offering capacity
 * @access   admin
 */
export const UpdateCourseOfferingCapacitySchema = z.object({
    newCapacity: z
        .number()
        .int('Capacity must be an integer')
        .min(1, 'Capacity must be at least 1'),
});

/**
 * @desc     Validation schema for update course offering instructor
 * @access   admin
 */
export const UpdateCourseOfferingInstructorSchema = z.object({
    newInstructorId: z.string().min(1, { message: 'Instructor is required' }),
});

/**
 * @desc     Validation schema for update course offering (both)
 * @access   admin
 */
export const UpdateCourseOfferingSchema = z.object({
    newCapacity: z
        .number()
        .int('Capacity must be an integer')
        .min(1, 'Capacity must be at least 1'),
    newInstructorId: z.string().min(1, { message: 'Instructor is required' }),
});

export type CreateCourseOfferingInput = z.infer<typeof CreateCourseOfferingSchema>;
export type UpdateCourseOfferingCapacityInput = z.infer<typeof UpdateCourseOfferingCapacitySchema>;
export type UpdateCourseOfferingInstructorInput = z.infer<typeof UpdateCourseOfferingInstructorSchema>;
export type UpdateCourseOfferingInput = z.infer<typeof UpdateCourseOfferingSchema>;
