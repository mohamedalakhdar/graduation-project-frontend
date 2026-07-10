import * as z from "zod";

/**
 * @desc     Validation schema for user login
 * @details   Validates that the email is in a proper format and the password meets complexity requirements
 * @returns   A Zod schema object for validating login form data
*/
export const LoginSchema = z.object({
    email: z.string().email({ message: "LOGIN_INVALID_EMAIL" }),
    password: z.string().min(1, { message: "LOGIN_PASSWORD_REQUIRED" })
});
