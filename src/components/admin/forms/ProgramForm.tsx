/*
 * Program Form Component
 * Form for creating and editing programs with validation
 */

"use client";

import InputMessageError from "@/components/ui/InputMessageError";
import Loader from "@/components/ui/Loader";
import { getAllDepartment } from "@/server/DepartmentActions";
import { createAndNewProgram, programStates } from "@/server/ProgramsActions";
import { Department, Program } from "@/types";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useTranslations } from "@/i18n/IntlProvider";

interface ProgramFormProps {
    isEditing: boolean;
    defaultValuesForEdit: Program | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
}

export function ProgramForm({
    isEditing,
    defaultValuesForEdit,
    setIsModalOpen,
    onCancel,
}: ProgramFormProps) {
    // Translation hooks
    const t = useTranslations('Programs');
    const tc = useTranslations('Common');

    const [departmentData, setDepartmentData] = useState<Department[] | null>(null);
    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>(defaultValuesForEdit?.id || "");
    const [isLoading, setIsLoading] = useState(false);

    const initialState: programStates = {
        error: null,
        formData: new FormData(),
        message: "",
        success: false,
    };
    const [state, action, isPending] = useActionState(createAndNewProgram, initialState);

    useEffect(() => {
        if (state.success && state.message && !isPending) {
            toast.success(state.message);
            setIsModalOpen(false);
            window.location.reload();
        }
        if (!state.success && state.message && !isPending) {
            toast.error(state.message);
        }
    }, [state.success, state.message, isPending, setIsModalOpen]);

    // Load departments for select field
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDepartment({});
                setDepartmentData(data.items);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <form action={action} className="space-y-5">
            {/* Name and Required Credits */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-black">
                {/* Hidden input for departmentId */}
                <input type="hidden" name="departmentId" value={selectedDepartmentId} />

                {/* Program Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelProgramName')} *
                    </label>
                    <input
                        type="text"
                        name="name"
                        defaultValue={state.formData.get("name") as string || defaultValuesForEdit?.name}
                        readOnly={isEditing}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${isEditing ? "bg-gray-100 cursor-not-allowed" : ""} ${state.error?.name ? "border-red-500" : "border-gray-300"}`}
                        placeholder={t('placeholderProgramName')}
                        disabled={isPending}
                    />
                    {state.error && state.error.name && (
                        <InputMessageError message={state.error.name} />
                    )}
                </div>

                {/* Required Credits */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelRequiredCredits')} *
                    </label>
                    <input
                        type="number"
                        name="requiredCredits"
                        defaultValue={state.formData.get("requiredCredits") as string || defaultValuesForEdit?.requiredCredits}
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error?.requiredCredits ? "border-red-500" : "border-gray-300"}`}
                        placeholder={t('placeholderRequiredCredits')}
                        disabled={isPending}
                    />
                    {state.error && state.error.requiredCredits && (
                        <InputMessageError message={state.error.requiredCredits} />
                    )}
                </div>
            </div>

            {/* Departments select */}
            {!isEditing && (
                <div className="flex flex-col text-gray-700 gap-2">
                    <label htmlFor="departments">{t('labelDepartments')}</label>
                    {isLoading ? (
                        <Loader />
                    ) : departmentData ? (
                        <select
                            name="departments"
                            id="departments"
                            value={selectedDepartmentId}
                            onChange={(e) => setSelectedDepartmentId(e.target.value)}
                        >
                            <option value={defaultValuesForEdit ? defaultValuesForEdit.id : ""} disabled>
                                {isEditing && defaultValuesForEdit ? defaultValuesForEdit.departmentName : t('selectDepartment')}
                            </option>
                            {departmentData.map((department: Department) => (
                                <option key={department.id} value={department.id}>
                                    {department.name}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div>
                            <p className="font-bold text-sm text-red-500">
                                {t('noDepartmentsFound')}
                            </p>
                            <div className="text-black mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <Link href="/admin/departments" className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium w-full">
                                    {t('createDepartment')}
                                </Link>
                                <button type="button" onClick={() => window.location.reload()} className="px-4 py-2 border text-black rounded-lg transition font-medium w-full">
                                    {t('refresh')}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isPending}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {tc('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {isPending ? (
                        <span className="flex items-center justify-center gap-2">
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            {isEditing ? t('updating') : t('creating')}
                        </span>
                    ) : isEditing ? (
                        t('btnUpdateProgram')
                    ) : (
                        t('btnCreateProgram')
                    )}
                </button>
            </div>
        </form>
    );
}
