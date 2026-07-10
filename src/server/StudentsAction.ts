"use server";

import getTokenFromCookie from "@/utils/getCookie";
import { studentSchema } from "@/validation/students";
import { revalidatePath } from "next/cache";

interface studentError {
    [key: string]: string;
}

export interface studentStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: studentError | null
}

/**
 * @desc     get All department
 * @access   admin
*/
interface IGetAllStudents {
    search?: string;
    programId?: string;
    advisorId?: string;
    status?: string;
    minCGPA?: number;
    maxCGPA?: number;
    page?: number;
    pageSize?: number;
}
export async function getAllStudents({search, programId, advisorId, status, minCGPA, maxCGPA, page, pageSize}: IGetAllStudents) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

         // create params
        const params = new URLSearchParams();

        if (page) {
            params.append("page", String(page));
        }

        if (pageSize) {
            params.append("pageSize", String(pageSize));
        }

        if (search) {
            params.append("search", search);
        }

        if (programId) {
            params.append("programId", programId);
        }

        if (advisorId) {
            params.append("advisorId", advisorId);
        }

        if (minCGPA !== undefined) {
            params.append("minCGPA", minCGPA.toString());
        }

        if (maxCGPA !== undefined) {
            params.append("maxCGPA", maxCGPA.toString());
        }

        if (status !== undefined) {
            params.append("status", status.toString());
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Students?${params.toString()}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['students'] }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "Failed to load students",
                formData: null,
                error: null
            }
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal server error",
            formData: null,
            error: null
        }
    }
}


/**
 * @desc     create new student
 * @access   admin
*/
export async function createNewStudent(prevState: unknown, formData: FormData): Promise<studentStates> {
    // get raw data
    const userName = formData.get("userName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const phoneNumber = formData.get("phoneNumber") as string;
    const fullName = formData.get("fullName") as string;
    const academicNumber = formData.get("academicNumber") as string;
    const nationalId = formData.get("nationalId") as string;
    const programId = formData.get("programId") as string;

    // validation with zod
    const result = studentSchema.safeParse({ userName, email, password, phoneNumber, fullName, academicNumber, nationalId, programId });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid students format",
            formData: formData,
            error: result.error.flatten().fieldErrors as studentError,
        };
    }

    // integrate with DB
    try {
        // get token from cookies
        const token = await getTokenFromCookie();
        console.log("token", token)

        if (!token) {
            return {
                success: false,
                message: "Unauthorized, Please Login First!",
                formData: formData,
                error: null,
            }
        }

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/students`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                userName,
                email,
                password,
                phoneNumber,
                fullName,
                academicNumber,
                nationalId,
                programId,
            }),
        });

        const data = await res.json();

        if (!res.ok) {
            return {
                success: false,
                message: data.name || "Failed to create new student",
                formData: formData,
                error: null,
            }
        }

        // revalidate path after create new department
        revalidatePath('/admin/students', 'page')

        return {
            success: true,
            message: "Student created successfully",
            formData: new FormData(), // Clear form data on success
            error: null,
        }

    } catch (error) {
        console.log(error)
        return {
            success: false,
            message: "internal server error",
            formData: formData,
            error: null,
        }
    }
}


/**
 * @desc     dismiss specific student
 * @access   admin
*/
export async function dismissStudent(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/Students/${id}/dismiss`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                error: null
            }
        }

        return {
            success: true,
            message: "Student Dismissed Successfully",
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            error: null
        }
    }
}