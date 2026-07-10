import * as z from "zod";

/**
 * @desc     Validation schema for create program form
 * @access   admin
 * @details   Validates that the name and requiredCredits are provided
 * @returns   A Zod schema object for validating program form data
*/
export const CreateProgramSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name must be at most 100 characters long" }),
    requiredCredits: z.string().min(1, { message: "Required credits must be provided" }),
});

/**
 * @desc     Validation schema for update program form
 * @access   admin
 * @details   Validates that the requiredCredits is provided
 * @returns   A Zod schema object for validating program form data
*/
export const UpdateCreditsProgramSchema = z.object({
    requiredCredits: z.string().min(1, { message: "Required credits must be provided" }),
});

/**
 * @desc     Validation schema for update name program form
 * @access   admin
 * @details   Validates that the name is provided
 * @returns   A Zod schema object for validating program form data
*/
export const UpdateNameProgramSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name must be at most 100 characters long" }),
});
