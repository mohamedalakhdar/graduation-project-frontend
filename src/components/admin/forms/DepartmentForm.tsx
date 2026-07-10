/**
 * Student Form Component
 * Form for creating and editing students with validation
 */

"use client";

import InputMessageError from "@/components/ui/InputMessageError";
import {
    createNewDepartment,
    departmentStates,
    updateDepartment,
} from "@/server/DepartmentActions";
import { Department } from "@/types";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import toast from "react-hot-toast";

interface StudentFormProps {
    isEditing: boolean;
    defaultValuesForEdit: Department | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
}

export function DepartmentForm({
    isEditing,
    setIsModalOpen,
    defaultValuesForEdit,
    onCancel,
}: StudentFormProps) {
    const router = useRouter();

    const initialState: departmentStates = {
        error: null,
        formData: new FormData(),
        message: "",
        success: false,
    };
    const [state, action, isPending] = useActionState(
        isEditing ? updateDepartment : createNewDepartment,
        initialState,
    );

    useEffect(() => {
        if (state.success && state.message && !isPending) {
            toast.success(state.message);
            setIsModalOpen(false);
            router.refresh();
            window.location.reload();
        }
        if (!state.success && state.message && !isPending) {
            toast.error(state.message);
        }
    }, [state.success, state.message, isPending, setIsModalOpen, router]);

    return (
        <form action={action} className="space-y-5">
            {/* First Row - Name and Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                {isEditing && <input type="hidden" value={defaultValuesForEdit?.id} name="id" />}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name *
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={state.formData.get("name") as string || defaultValuesForEdit?.name}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error?.name ? "border-red-500" : "border-gray-300"}`}
                        placeholder="Electrical Engineer"
                        disabled={isPending}
                    />
                    {state.error && state.error.name && (
                        <InputMessageError message={state.error.name} />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description *
                    </label>
                    <input
                        type="text"
                        name="description"
                        defaultValue={state.formData.get("description") as string || defaultValuesForEdit?.description}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error?.description ? "border-red-500" : "border-gray-300"}`}
                        placeholder="this is Electrical Engineer Department, this is amazing Department for learn and work with programming"
                        disabled={isPending}
                    />
                    {state.error && state.error.description && (
                        <InputMessageError message={state.error.description} />
                    )}
                </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isEditing ? "Updating..." : "Creating..."}
                        </span>
                    ) : isEditing ? (
                        "Update Department"
                    ) : (
                        "Create Department"
                    )}
                </button>
            </div>
        </form>
    );
}
