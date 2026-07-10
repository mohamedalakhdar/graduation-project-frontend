import z from "zod";

/**
 * @desc     Validation schema for forgot password
 * @details   Validates that the email is in a proper format
 * @returns   A Zod schema object for validating forgot password form data
*/
export const ForgotPasswordSchema = z.object({
    email: z.string().email()
});