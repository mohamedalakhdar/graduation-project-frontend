"use server";

import getTokenFromCookie from "@/utils/getCookie";
import { CreateProgramSchema, UpdateCreditsProgramSchema, UpdateNameProgramSchema } from "@/validation/program";

export interface programError {
    [key: string]: string;
}

export interface programStates {
    success: boolean;
    message: string;
    formData: FormData;
    error: programError | null;
}

/**
 * @desc     get All programs
 * @access   admin
*/
interface IGetAllPrograms {
    search?: string;
    departmentId?: string;
    page?: number;
    pageSize?: number;
}
export async function getAllPrograms({search, departmentId, page, pageSize}: IGetAllPrograms) {
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

        if(departmentId) {
            params.append("departmentId", departmentId)
        }

        // final url
        let url;
        if (page || pageSize || search) {
            url = `${process.env.ENDPOINTS_URL}/api/departments/programs?${params.toString()}`;
        } else {
            url = `${process.env.ENDPOINTS_URL}/api/departments/programs`;
        }

        const res = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['programs'] }
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return { message: "Internal Server Error" }
    }
}

/**
 * @desc     get Single programs
 * @access   admin
*/
export async function getSingleProgram(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/programs/${id}`, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            },
            next: { tags: ['program'] }
        })

        if (!res.ok) {
            return null;
        }

        const data = await res.json();
        return data;

    } catch (error) {
        console.log(error);
        return { message: "Internal Server Error" }
    }
}

/**
 * @desc     update name for Single programs
 * @access   admin
*/
export async function updateNameForSingleProgram({ id, name }: { id: string, name: string }) {
    // validation with zod
    const result = UpdateNameProgramSchema.safeParse({ name });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            name: name,
            error: result.error.flatten().fieldErrors as programError,
        };
    }

    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/programs/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        })


        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                name: name,
                error: null
            }
        }

        return {
            success: true,
            message: "Name Updated Successfully",
            formData: new FormData(),
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            name: name,
            error: null
        }
    }
}

/**
 * @desc     update credits for Single programs
 * @access   admin
*/
export async function updateCreditsForSingleProgram({ id, requiredCredits }: { id: string, requiredCredits: string }) {
    // validation with zod
    const result = UpdateCreditsProgramSchema.safeParse({ requiredCredits });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            name: requiredCredits,
            error: result.error.flatten().fieldErrors as programError,
        };
    }

    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/programs/${id}/credits`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ newRequiredCredits: Number(requiredCredits) })
        })

        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                name: requiredCredits,
                error: null
            }
        }

        return {
            success: true,
            message: "Required Credits Updated Successfully",
            name: "",
            error: null
        }

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error!",
            name: requiredCredits,
            error: null
        }
    }
}

/**
 * @desc     create new program
 * @access   admin
*/
export async function createAndNewProgram(prevState: unknown, formData: FormData): Promise<programStates> {
    // get data 
    const name = formData.get("name") as string;
    const requiredCredits = formData.get("requiredCredits") as string;
    const departmentId = formData.get("departmentId") as string;

    // validation with zod
    const result = CreateProgramSchema.safeParse({ name, requiredCredits });
    if (!result.success) {
        return {
            success: false,
            message: "Invalid program format",
            formData: formData,
            error: result.error.flatten().fieldErrors as programError,
        };
    }

    // integrate with DB
    try {
        // get token from cookies
        const token = await getTokenFromCookie();

        if (!token) {
            return {
                success: false,
                message: "Unauthorized, Please Login First!",
                formData: formData,
                error: null,
            }
        };

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/${departmentId}/programs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ name, requiredCredits: Number(requiredCredits) }),
        });

        if (!res.ok) {
            return {
                success: false,
                message: "An Error Occurred, Please Try Again!",
                formData: formData,
                error: null,
            };
        }

        return {
            success: true,
            message: "Program Created Successfully",
            formData: new FormData(),
            error: null,
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: "Internal Server Error",
            formData: formData,
            error: null,
        };
    }
}

/**
 * @desc     delete specific program
 * @access   admin
*/
export async function deleteProgram(id: string) {
    try {
        // get token form cookies
        const token = await getTokenFromCookie();

        const res = await fetch(`${process.env.ENDPOINTS_URL}/api/departments/programs/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })

        const data = await res.json()
        if (!res.ok) {
            return {
                success: false,
                message: data.name || "An Error Occurred, Please Try Again!",
                error: null
            }
        }

        return {
            success: true,
            message: "Program Deleted Successfully",
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