"use server";

import { ForgotPasswordSchema } from "@/validation/auth/ForgotPassword";

interface forgotPasswordError {
    email?: string | null;
}

export interface forgotPasswordStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: forgotPasswordError | null;
}

export async function forgotPasswordAction(
    prevData: unknown,
    formData: FormData,
): Promise<forgotPasswordStates> {
    const email = formData.get("email") as string;

    // make validation
    const result = ForgotPasswordSchema.safeParse({ email });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid email format",
            formData: formData,
            error: result.error.flatten().fieldErrors as forgotPasswordError,
        };
    }

    try {
        const response = await fetch(`${process.env.ENDPOINTS_URL}/api/accounts/forget-password`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, baseUrl: `${process.env.WEBSITE_URL}/reset-password` }),
        });
        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.name || "Failed to send password reset email",
                formData: formData,
                error: null
            };
        }

        return {
            success: true,
            message: data.message || "Password reset email sent successfully",
            formData: new FormData(), // Clear form data on success
            error: null
        };
    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "Internal server error",
            formData: formData,
            error: null
        }
    }
}