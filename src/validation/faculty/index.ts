import * as z from "zod";

/**
 * @desc     Validation schema for create faculty member form
 * @access   admin
 * @details   Validates that the all inputs are provided
 * @returns   A Zod schema object for validating faculty member form data
*/
export const facultyMemberSchema = z.object({
    userName: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, underscore allowed"),

    email: z
        .string()
        .email("Invalid email format"),

    password: z
        .string()
        .min(6, "Password must be at least 6 characters"),

    phoneNumber: z
        .string()
        .regex(/^01[0-2,5]{1}[0-9]{8}$/, "Invalid Egyptian phone number"),

    fullName: z
        .string()
        .min(3, "Full name is required"),

    departmentId: z
        .string("department is required")
        .min(1, "department is required"),
        
    degree: z
    .number("degree is required")
    .min(1, "degree is required"),

    isAdvisor: z
        .boolean()
        .optional()
        .default(false),
});

/**
 * @desc     Validation schema for update degree of faculty member form
 * @access   admin
 * @details   Validates that the all inputs are provided
 * @returns   A Zod schema object for validating faculty member form data
*/
export const updateDegreeFacultyMemberSchema = z.object({
    newDegree: z
        .number("degree is required"),
});

/**
 * @desc     Validation schema for update department of faculty member form
 * @access   admin
 * @details   Validates that the all inputs are provided
 * @returns   A Zod schema object for validating faculty member form data
*/
export const updateDepartmentFacultyMemberSchema = z.object({
    newDepartmentId: z
        .string("department is required"),
});

/**
 * @desc     Validation schema for update status of faculty member form
 * @access   admin
 * @details   Validates that the all inputs are provided
 * @returns   A Zod schema object for validating faculty member form data
*/
export const updateStatusFacultyMemberSchema = z.object({
    newStatus: z
        .number("status is required"),
});