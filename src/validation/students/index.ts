import * as z from "zod";

/**
 * @desc     Validation schema for create student form
 * @access   admin
 * @details   Validates that the all inputs are provided
 * @returns   A Zod schema object for validating student form data
*/
export const studentSchema = z.object({
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

    academicNumber: z
        .string()
        .min(1, "Academic number is required")
        .max(20, "Academic number must be at most 20 characters"),

    nationalId: z
        .string()
        .length(14, "National ID must be 14 digits")
        .regex(/^\d+$/, "National ID must be numbers only"),

    programId: z
        .string()
        .min(1, "Program is required"),
});