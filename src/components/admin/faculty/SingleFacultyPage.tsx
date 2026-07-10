"use client";

import { useEffect, useState } from "react";
import { Check, Pencil, X, Loader2 } from "lucide-react";
import { FacultyDegree, FacultyStatus } from "@/enums";
import { Department, SingleFacultyMember } from "@/types";
import { getAllDepartment } from "@/server/DepartmentActions";
import Loader from "@/components/ui/Loader";
import { updateDegreeFacultyMember, updateDepartmentFacultyMember, updateStatusFacultyMember } from "@/server/FacultyAction";
import toast from "react-hot-toast";
import { useTranslations } from "@/i18n/IntlProvider";

type EditField = "degree" | "status" | "department" | null;

export default function FacultyInlineUpdates({ facultyMember }: { facultyMember: SingleFacultyMember }) {
    const t = useTranslations('Faculty');
    const tf = useTranslations('Forms');

    // active editing field
    const [activeEdit, setActiveEdit] = useState<EditField>(null);

    // loading field
    const [loadingField, setLoadingField] = useState<EditField>(null);
    const [isLoadingFetchDepartments, setIsLoadingFetchDepartments] = useState<boolean>(false)

    // values
    const [degree, setDegree] = useState(facultyMember.degree);
    const [status, setStatus] = useState<FacultyStatus>(facultyMember.status);
    const [department, setDepartment] = useState(facultyMember.departmentName);

    // departments data
    const [departments, setDepartments] = useState<Department[] | []>([])

    // backup values for cancel
    const [backupValues, setBackupValues] = useState({
        degree,
        status,
        department,
    });

    // --------------------------
    // START EDIT
    // --------------------------
    const handleEdit = (field: EditField) => {
        if (!field) return;

        setBackupValues({
            degree,
            status,
            department,
        });

        setActiveEdit(field);
    };

    // --------------------------
    // CANCEL EDIT
    // --------------------------
    const handleCancel = () => {
        setDegree(backupValues.degree);
        setStatus(backupValues.status);
        setDepartment(backupValues.department);

        setActiveEdit(null);
    };

    // --------------------------
    // SAVE
    // --------------------------
    const handleSave = async (field: EditField) => {
        if (!field) return;

        try {
            setLoadingField(field);

            switch (field) {
                case "degree":
                    // server action for update degree 
                    console.log("first")
                    const resultDegree = await updateDegreeFacultyMember({ facultyMemberId: facultyMember.id, newDegree: Number(degree) });
                    if (resultDegree.success && resultDegree.message && resultDegree.error === null) {
                        toast.success(resultDegree.message)
                    } else {
                        toast.error(resultDegree.message)
                        setStatus(facultyMember.status)
                    }
                    break;

                case "status":
                    // server action for update status
                    const resultStatus = await updateStatusFacultyMember({ facultyMemberId: facultyMember.id, newStatus: Number(status) });
                    if (resultStatus.success && resultStatus.message && resultStatus.error === null) {
                        toast.success(resultStatus.message)
                    } else {
                        toast.error(resultStatus.message)
                        setStatus(facultyMember.status)
                    }
                    break;

                case "department":
                    // server action for update department
                    const resultDepartment = await updateDepartmentFacultyMember({ facultyMemberId: facultyMember.id, newDepartmentId: department });
                    if (resultDepartment.success && resultDepartment.message && resultDepartment.error === null) {
                        toast.success(resultDepartment.message)
                    } else {
                        toast.error(resultDepartment.message)
                        setDepartment(facultyMember.departmentName)
                    }
                    break;

                default:
                    break;
            }

            setActiveEdit(null);
        } catch (error) {
            console.log(error);
        } finally {
            setLoadingField(null);
        }
    };

    // get all departments to show in select
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (setIsLoadingFetchDepartments) setIsLoadingFetchDepartments(true);
                const data = await getAllDepartment({ pageSize: 100000 })
                setDepartments(data.items);
            } catch (error) {
                console.error(error);
                if (setIsLoadingFetchDepartments) setIsLoadingFetchDepartments(false);
            } finally {
                if (setIsLoadingFetchDepartments) setIsLoadingFetchDepartments(false);
            }
        };

        fetchData();
    }, []);

    // Helper to get localized degree labels
    const getDegreeLabel = (deg: string) => {
        switch (deg) {
            case "Teaching Assistant": return t("degreeTA");
            case "Assistant Lecturer": return t("degreeAL");
            case "Lecturer": return t("degreeL");
            case "Associate Professor": return t("degreeAP");
            case "Professor": return t("degreeP");
            default: return deg;
        }
    };

    // Helper to get localized status labels
    const getStatusLabel = (stat: string) => {
        switch (stat) {
            case "Active": return t("statusActive");
            case "Resined": return t("statusSigned");
            case "Retired": return t("statusRetired");
            case "Dismissed": return t("statusDismissed");
            default: return stat;
        }
    };

    // helper
    const isAnotherEditing =
        activeEdit !== null;

    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
            <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-gray-200 p-6 space-y-6 text-start">

                <h2 className="text-2xl font-bold text-gray-600">
                    {t('updatesFor', { name: '' })} <span className="text-[#00284d] text-3xl">{facultyMember.name}</span>
                </h2>

                {/* ========================= */}
                {/* DEGREE */}
                {/* ========================= */}
                <div className="flex items-center justify-between gap-4">

                    <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">
                            {tf('labelDegree')}
                        </label>

                        <select
                            value={degree}
                            onChange={(e) => setDegree(e.target.value as FacultyDegree)}
                            disabled={activeEdit !== "degree"}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-2
                                disabled:bg-gray-100
                                disabled:text-gray-500
                                disabled:cursor-not-allowed
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        >
                            <option value={facultyMember.degree ? facultyMember.degree : ""} hidden disabled>
                                {getDegreeLabel(facultyMember.degree)}
                            </option>
                            {Object.values(FacultyDegree).map((item, idx) => (
                                <option key={item} value={idx}>
                                    {getDegreeLabel(item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ICONS */}
                    <div className="flex items-center gap-2 mt-6">

                        {loadingField === "degree" ? (
                            <Loader2 className="animate-spin text-blue-600" />
                        ) : activeEdit === "degree" ? (
                            <>
                                <button
                                    onClick={() => handleSave("degree")}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-green-100
                                        hover:bg-green-200
                                        text-green-700
                                    "
                                >
                                    <Check size={18} />
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-red-100
                                        hover:bg-red-200
                                        text-red-700
                                    "
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                disabled={isAnotherEditing}
                                onClick={() => handleEdit("degree")}
                                className="
                                    p-2
                                    rounded-lg
                                    bg-blue-100
                                    hover:bg-blue-200
                                    text-blue-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* ========================= */}
                {/* STATUS */}
                {/* ========================= */}
                <div className="flex items-center justify-between gap-4">

                    <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">
                            {t('colStatus')}
                        </label>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value as FacultyStatus)}
                            disabled={activeEdit !== "status"}
                            className="
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                px-4
                                py-2
                                disabled:bg-gray-100
                                disabled:text-gray-500
                                disabled:cursor-not-allowed
                                focus:outline-none
                                focus:ring-2
                                focus:ring-blue-500
                            "
                        >
                            <option value={facultyMember.status ? facultyMember.status : ""} hidden disabled>
                                {getStatusLabel(facultyMember.status)}
                            </option>
                            {Object.values(FacultyStatus).map((item, idx) => (
                                <option key={item} value={idx}>
                                    {getStatusLabel(item)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* ICONS */}
                    <div className="flex items-center gap-2 mt-6">

                        {loadingField === "status" ? (
                            <Loader2 className="animate-spin text-blue-600" />
                        ) : activeEdit === "status" ? (
                            <>
                                <button
                                    onClick={() => handleSave("status")}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-green-100
                                        hover:bg-green-200
                                        text-green-700
                                    "
                                >
                                    <Check size={18} />
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-red-100
                                        hover:bg-red-200
                                        text-red-700
                                    "
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                disabled={isAnotherEditing}
                                onClick={() => handleEdit("status")}
                                className="
                                    p-2
                                    rounded-lg
                                    bg-blue-100
                                    hover:bg-blue-200
                                    text-blue-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                </div>

                {/* ========================= */}
                {/* DEPARTMENT */}
                {/* ========================= */}
                <div className="flex items-center justify-between gap-4">

                    <div className="flex-1">
                        <label className="text-sm text-gray-500 mb-1 block">
                            {tf('labelDepartment')}
                        </label>

                        {
                            isLoadingFetchDepartments
                                ? (
                                    <Loader />
                                )
                                : (
                                    <select
                                        value={department}
                                        onChange={(e) => setDepartment(e.target.value)}
                                        disabled={activeEdit !== "department"}
                                        className="w-full rounded-xl border border-gray-300 px-4 py-2 disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value={facultyMember.departmentName ? facultyMember.departmentName : ""} hidden disabled>
                                            {facultyMember.departmentName}
                                        </option>
                                        {departments.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        ))}
                                    </select>
                                )
                        }
                    </div>

                    {/* ICONS */}
                    <div className="flex items-center gap-2 mt-6">

                        {loadingField === "department" ? (
                            <Loader2 className="animate-spin text-blue-600" />
                        ) : activeEdit === "department" ? (
                            <>
                                <button
                                    onClick={() => handleSave("department")}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-green-100
                                        hover:bg-green-200
                                        text-green-700
                                    "
                                >
                                    <Check size={18} />
                                </button>

                                <button
                                    onClick={handleCancel}
                                    className="
                                        p-2
                                        rounded-lg
                                        bg-red-100
                                        hover:bg-red-200
                                        text-red-700
                                    "
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : (
                            <button
                                disabled={isAnotherEditing}
                                onClick={() => handleEdit("department")}
                                className="
                                    p-2
                                    rounded-lg
                                    bg-blue-100
                                    hover:bg-blue-200
                                    text-blue-700
                                    disabled:opacity-50
                                    disabled:cursor-not-allowed
                                "
                            >
                                <Pencil size={18} />
                            </button>
                        )}
                    </div>
                </div>

            </div>
        </section>
    );
}