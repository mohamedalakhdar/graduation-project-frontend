import * as z from "zod";

/**
 * @desc     Validation schema for create department form
 * @access   admin
 * @details   Validates that the name and description are provided
 * @returns   A Zod schema object for validating department form data
*/
export const CreateDepartmentSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long" }).max(100, { message: "Name must be at most 100 characters long" }),
    description: z.string().min(10, { message: "Description must be at least 10 characters long" }).max(255, { message: "Description must be at most 255 characters long" }),
});
