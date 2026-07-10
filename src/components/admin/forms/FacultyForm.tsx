/**
 * Faculty Form Component
 * Form for creating and editing faculty members with validation
 */

'use client';

import { useState, useEffect, useActionState } from 'react';
import { Department } from '@/types';
import { generatePassword } from '@/utils/passwordGenerator';
import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import Loader from '@/components/ui/Loader';
import Link from 'next/link';
import InputMessageError from '@/components/ui/InputMessageError';
import { getAllDepartment } from '@/server/DepartmentActions';
import { FacultyDegree } from '@/enums';
import { createNewFacultyMember, facultyStates } from '@/server/FacultyAction';
import { useTranslations } from '@/i18n/IntlProvider';

interface FacultyMemberProps {
    isEditing: boolean;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
}

export function FacultyMemberForm({
    isEditing,
    setIsModalOpen,
    onCancel,
}: FacultyMemberProps) {
    const t = useTranslations('Forms');
    const tc = useTranslations('Common');
    const tf = useTranslations('Faculty');

    const [departmentData, setDepartmentData] = useState<Department[] | null>([]);

    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const [selectedDepartmentId, setSelectedDepartmentId] = useState<string>("");
    const [selectedDegree, setSelectedDegree] = useState<string>("");

    const [isLoading, setIsLoading] = useState(false);
    const [isAdvisor, setIsAdvisor] = useState(false);

    const initialState: facultyStates = {
        error: null,
        formData: new FormData(),
        message: "",
        success: false,
    };
    const [state, action, isPending] = useActionState(createNewFacultyMember, initialState);

    // get isAdvisor and other fields from server when error occurred
    useEffect(() => {
        setIsAdvisor(state.formData.get("isAdvisor") === "on");

        const deg = state.formData.get("degree");
        if (deg) {
            setSelectedDegree(deg as string);
        }

        const deptId = state.formData.get("departmentId");
        if (deptId) {
            setSelectedDepartmentId(deptId as string);
        }

        const pass = state.formData.get("password");
        if (pass) {
            setPassword(pass as string);
        }
    }, [state.formData]);

    // get all programs to show in select
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const data = await getAllDepartment({ pageSize: 100000 });
                setDepartmentData(data.items);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

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

    const handleGeneratePassword = () => {
        const password = generatePassword();
        setPassword(password);
        toast.success(t('passwordGenerated'));
    };

    const handleCopyPassword = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast.success(t('passwordCopied'));
        }
    };

    // Helper to get localized degree labels
    const getDegreeLabel = (deg: string) => {
        switch (deg) {
            case "Teaching Assistant":
                return tf("degreeTA");
            case "Assistant Lecturer":
                return tf("degreeAL");
            case "Lecturer":
                return tf("degreeL");
            case "Associate Professor":
                return tf("degreeAP");
            case "Professor":
                return tf("degreeP");
            default:
                return deg;
        }
    };

    return (
        <form action={action} className="space-y-5 text-start">
            {/* First Row - Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* userName */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelUsername')} *
                    </label>
                    <input
                        type="text"
                        name="userName"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.userName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., john_doe"
                        defaultValue={state.formData.get("userName") as string}
                        autoFocus
                        disabled={isLoading}
                    />
                    {state.error && state.error.userName && (
                        <InputMessageError message={state.error.userName} />
                    )}
                </div>

                {/* Email */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelEmail')} *
                    </label>
                    <input
                        type="email"
                        name="email"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., john@university.edu"
                        defaultValue={state.formData.get("email") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.email && (
                        <InputMessageError message={state.error.email} />
                    )}
                </div>
            </div>

            {/* Second Row - Full Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelFullName')} *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., John Doe"
                        defaultValue={state.formData.get("fullName") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.fullName && (
                        <InputMessageError message={state.error.fullName} />
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelPhone')} *
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 1234567890"
                        defaultValue={state.formData.get("phoneNumber") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.phoneNumber && (
                        <InputMessageError message={state.error.phoneNumber} />
                    )}
                </div>
            </div>

            {/* Degree */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('labelDegree')} *
                </label>
                <select
                    id="degree"
                    name="degree"
                    value={selectedDegree}
                    onChange={(e) => setSelectedDegree(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                >
                    <option value="" disabled>
                        {t('selectDegree')}
                    </option>

                    {Object.values(FacultyDegree).map((degree, idx) => (
                        <option key={degree} value={idx + 1}>
                            {getDegreeLabel(degree)}
                        </option>
                    ))}
                </select>
                {state.error && state.error.degree && (
                    <InputMessageError message={state.error.degree} />
                )}
            </div>

            {/* Department */}
            {!isEditing && (
                <div className="flex flex-col text-gray-700 gap-2">
                    <label htmlFor="departmentId" className="text-sm font-medium text-gray-700">{t('labelDepartment')}</label>
                    {
                        isLoading
                            ? <Loader />
                            : (
                                departmentData
                                    ? (
                                        <select
                                            name="departmentId"
                                            id="departmentId"
                                            value={selectedDepartmentId}
                                            onChange={(e) => setSelectedDepartmentId(e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition"
                                        >
                                            <option value="" disabled>
                                                {t('selectDepartment')}
                                            </option>

                                            {departmentData.map((department: Department) => (
                                                <option key={department.id} value={department.id}>
                                                    {department.name}
                                                </option>
                                            ))}
                                        </select>
                                    )
                                    : (
                                        <div>
                                            <p className="font-bold text-sm text-red-500">{tf('departmentRequiredDesc')}</p>
                                            <div className="text-black mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <Link href={"/admin/departments"}
                                                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium w-full text-center"
                                                >
                                                    {tf('goToDepartments')}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => window.location.reload()}
                                                    className="px-4 py-2 border text-black rounded-lg transition font-medium w-full"
                                                >
                                                    {tc('refresh')}
                                                </button>
                                            </div>
                                        </div>
                                    )
                            )
                    }
                    {state.error && state.error.departmentId && (
                        <InputMessageError message={state.error.departmentId} />
                    )}
                </div>
            )}

            {/* Password Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('passwordReadOnly')}
                </label>
                <div className="flex gap-2">
                    <div className="flex-1 relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={password}
                            readOnly
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition cursor-not-allowed"
                            placeholder={t('passwordPlaceholder')}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            tabIndex={-1}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    <button
                        type="button"
                        onClick={handleCopyPassword}
                        disabled={Boolean(!password) || isLoading}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        title="Copy password"
                    >
                        <Copy size={18} />
                    </button>
                </div>
                {!password && state.error && (
                    <InputMessageError message={state.error.password} />
                )}
            </div>

            {/* Generate Password Button */}
            <button
                type="button"
                onClick={handleGeneratePassword}
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg hover:bg-blue-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                <RefreshCw size={18} />
                {t('generatePassword')}
            </button>

            {/* isAdvisor */}
            <div className='flex items-center justify-start gap-2 cursor-pointer w-fit'>
                <input
                    type="checkbox"
                    name="isAdvisor"
                    id="isAdvisor"
                    className={`px-4 py-2 border-none outline-none accent-[#00284d] w-5 h-5 rounded-lg transition disabled:bg-gray-100 cursor-pointer`}
                    defaultChecked={isAdvisor}
                    onChange={(e) => setIsAdvisor(e.target.checked)}
                    disabled={isLoading}
                />
                <label className="block text-sm font-medium text-gray-700 select-none cursor-pointer" htmlFor='isAdvisor'>
                    {t('labelIsAdvisor')}
                </label>
            </div>

            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="order-1 sm:order-0 w-full flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {tc('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || isPending}
                    className="order-0 sm:order-1 whitespace-nowrap flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {
                        isPending
                            ? <Loader className='text-white' />
                            : isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isPending ? t('creating') : isEditing ? t('updating') : ""}
                                </span>
                            ) : isEditing ? (
                                tf('updateFaculty')
                            ) : (
                                tf('createFaculty')
                            )
                    }
                </button>
            </div>
        </form>
    );
}
