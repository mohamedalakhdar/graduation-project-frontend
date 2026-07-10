/**
 * Zod Validation Schemas
 */

import { z } from 'zod';

/**
 * Student Form Validation Schema
 */
export const studentFormSchema = z.object({
    userName: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters')
        .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),

    email: z
        .string()
        .email('Invalid email address')
        .max(100, 'Email must not exceed 100 characters'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number')
        .regex(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/, 'Password must contain at least one special character'),

    phoneNumber: z
        .string()
        .regex(/^\d{10,}$/, 'Phone number must contain at least 10 digits')
        .max(20, 'Phone number must not exceed 20 characters'),

    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters')
        .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),

    academicNumber: z
        .string()
        .min(5, 'Academic number must be at least 5 characters')
        .max(20, 'Academic number must not exceed 20 characters')
        .regex(/^[a-zA-Z0-9-]+$/, 'Academic number can only contain letters, numbers, and hyphens'),

    nationalId: z
        .string()
        .min(5, 'National ID must be at least 5 characters')
        .max(20, 'National ID must not exceed 20 characters'),

    programId: z
        .string()
        .uuid('Invalid program ID')
        .or(z.string().min(1, 'Program must be selected')),
});

export type StudentFormSchemaType = z.infer<typeof studentFormSchema>;

/**
 * Professor Form Validation Schema (optional, for future use)
 */
export const professorFormSchema = z.object({
    userName: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters'),

    email: z
        .string()
        .email('Invalid email address'),

    password: z
        .string()
        .min(8, 'Password must be at least 8 characters'),

    phoneNumber: z
        .string()
        .regex(/^\d{10,}$/, 'Phone number must contain at least 10 digits'),

    fullName: z
        .string()
        .min(2, 'Full name must be at least 2 characters')
        .max(100, 'Full name must not exceed 100 characters'),

    nationalId: z
        .string()
        .min(5, 'National ID must be at least 5 characters'),

    departmentId: z
        .string()
        .min(1, 'Department must be selected'),

    specialization: z
        .string()
        .min(2, 'Specialization must be at least 2 characters')
        .max(100, 'Specialization must not exceed 100 characters'),
});

export type ProfessorFormSchemaType = z.infer<typeof professorFormSchema>;
