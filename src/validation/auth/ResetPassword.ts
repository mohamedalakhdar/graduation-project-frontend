import * as z from "zod";

/**
 * @desc     Validation schema for reset password form
 * @details   Validates that the email is in a proper format and the password meets complexity requirements
 * @returns   A Zod schema object for validating reset password form data
*/
export const ResetPasswordSchema = z.object({
    password: z.string()
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&+])[A-Za-z\d@$!%*?&+]{8,}$/,
            "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character"
        ),
});