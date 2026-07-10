/**
 * Student Form Component
 * Form for creating and editing students with validation
 */

'use client';

import { useState, useEffect, useActionState } from 'react';
import { Program, Student } from '@/types';
import { generatePassword } from '@/utils/passwordGenerator';
import { Eye, EyeOff, Copy, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { createNewStudent, studentStates } from '@/server/StudentsAction';
import Loader from '@/components/ui/Loader';
import { getAllPrograms } from '@/server/ProgramsActions';
import Link from 'next/link';
import InputMessageError from '@/components/ui/InputMessageError';
import { useTranslations } from '@/i18n/IntlProvider';

interface StudentFormProps {
    isEditing: boolean;
    defaultValuesForEdit: Student | null;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    onCancel?: () => void;
}

export function StudentForm({
    isEditing,
    defaultValuesForEdit,
    setIsModalOpen,
    onCancel,
}: StudentFormProps) {
    const t = useTranslations('Forms');
    const tc = useTranslations('Common');

    // const [studentData, setStudentData] = useState<Student[] | null>(null);
    const [programData, setProgramData] = useState<Program[] | null>([]);

    const [password, setPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState(false);

    const [selectedStudentId, setSelectedStudentId] = useState<string>(defaultValuesForEdit?.id || "");
    const [isLoading, setIsLoading] = useState(false);

    const initialState: studentStates = {
        error: null,
        formData: new FormData(),
        message: "",
        success: false,
    };
    const [state, action, isPending] = useActionState(createNewStudent, initialState);

    // get all programs to show in select
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (setIsLoading) setIsLoading(true);
                const data = await getAllPrograms({ pageSize: 100000 });
                setProgramData(data.items);
            } catch (error) {
                console.error(error);
                if (setIsLoading) setIsLoading(false);
            } finally {
                if (setIsLoading) setIsLoading(false);
            }
        };

        fetchData();
    }, [setIsLoading]);

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
        setPassword(password)
        toast.success(t('passwordGenerated') || 'Password generated successfully!');
    };

    const handleCopyPassword = () => {
        if (password) {
            navigator.clipboard.writeText(password);
            toast.success(t('passwordCopied') || 'Password copied to clipboard!');
        }
    };
    //     e.preventDefault();

    //     try {
    //         studentFormSchema.parse(formData);
    //         setErrors({});
    //     } catch (error) {
    //         console.log(error)
    //         // if (error instanceof ZodError) {
    //         //     const newErrors: Record<string, string> = {};
    //         //     error.errors.forEach((err) => {
    //         //         const path = err.path[0] as string;
    //         //         newErrors[path] = err.message;
    //         //     });
    //         //     setErrors(newErrors);
    //         // }
    //     }

    //     try {
    //         await onSubmit(formData);
    //     } catch (error) {
    //         console.error('Form submission error:', error);
    //     }
    // };

    return (
        <form action={action} className="space-y-5">
            {/* First Row - Username and Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* input for programId */}
                <input type="hidden" name="programId" value={selectedStudentId} />
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelUsername')} *
                    </label>
                    <input
                        type="text"
                        name="userName"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.userName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., john_doe"
                        defaultValue={defaultValuesForEdit?.userName || state.formData.get("userName") as string}
                        autoFocus
                        disabled={isLoading}
                    />
                    {state.error && state.error.userName && (
                        <InputMessageError message={state.error.userName} />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelEmail')} *
                    </label>
                    <input
                        type="email"
                        name="email"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., john@university.edu"
                        defaultValue={defaultValuesForEdit?.email || state.formData.get("email") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.email && (
                        <InputMessageError message={state.error.email} />
                    )}
                </div>
            </div>

            {/* Second Row - Full Name and Phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelFullName')} *
                    </label>
                    <input
                        type="text"
                        name="fullName"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.fullName ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., John Doe"
                        defaultValue={defaultValuesForEdit?.fullName || state.formData.get("fullName") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.fullName && (
                        <InputMessageError message={state.error.fullName} />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelPhone')} *
                    </label>
                    <input
                        type="tel"
                        name="phoneNumber"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.phoneNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., 1234567890"
                        defaultValue={defaultValuesForEdit?.phoneNumber || state.formData.get("phoneNumber") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.phoneNumber && (
                        <InputMessageError message={state.error.phoneNumber} />
                    )}
                </div>
            </div>

            {/* Third Row - Academic and National ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelAcademicNumber')} *
                    </label>
                    <input
                        type="text"
                        name="academicNumber"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.academicNumber ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., STU-2024-001"
                        defaultValue={defaultValuesForEdit?.academicNumber || state.formData.get("academicNumber") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.academicNumber && (
                        <InputMessageError message={state.error.academicNumber} />
                    )}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        {t('labelNationalId')} *
                    </label>
                    <input
                        type="text"
                        name="nationalId"
                        className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${state.error && state.error.nationalId ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="e.g., NAT-123456"
                        defaultValue={defaultValuesForEdit?.nationalId || state.formData.get("nationalId") as string}
                        disabled={isLoading}
                    />
                    {state.error && state.error.nationalId && (
                        <InputMessageError message={state.error.nationalId} />
                    )}
                </div>
            </div>

            {/* Program Selection */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Program *
                </label>
                <select
                    name="programId"
                    // value={formData.programId}
                    // onChange={handleInputChange}
                    className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#00284d] focus:border-transparent transition disabled:bg-gray-100 ${errors.programId ? 'border-red-500' : 'border-gray-300'}`}
                    disabled={isLoading}
                >
                    <option value="">Select a program</option>
                    {PROGRAMS.map((program) => (
                        <option key={program.id} value={program.id}>
                            {program.name}
                        </option>
                    ))}
                </select>
                {errors.programId && (
                    <p className="mt-1 text-xs text-red-600">{errors.programId}</p>
                )}
            </div> */}


            {!isEditing && (
                <div className="flex flex-col text-gray-700 gap-2">
                    <label htmlFor="">{t('labelProgram')}</label>
                    {
                        isLoading
                            ? <Loader />
                            : (
                                programData
                                    ? (
                                        <select
                                            name="departments"
                                            id="departments"
                                            value={selectedStudentId}
                                            onChange={(e) => setSelectedStudentId(e.target.value)}
                                        >
                                            {/* default value for selection */}
                                            {/* <option value={defaultValuesForEdit ? defaultValuesForEdit.id : ""} disabled>
                                                {isEditing && defaultValuesForEdit ? defaultValuesForEdit.departmentName : "Select a department"}
                                            </option> */}

                                            <option value={defaultValuesForEdit ? defaultValuesForEdit.id : state.formData.get("programId") ? state.formData.get("programId") as string : ""} disabled>
                                                {isEditing && defaultValuesForEdit ? defaultValuesForEdit.programName : state.formData.get("programId") ? state.formData.get("programId") as string : t('selectProgram')}
                                            </option>

                                            {programData.map((program: Program) => (
                                                <option key={program.id} value={program.id}>
                                                    {program.name}
                                                </option>
                                            ))}
                                        </select>
                                    )
                                    : (
                                        <div >
                                            <p className="font-bold text-sm text-red-500">
                                                {t('noProgramsFound')}
                                            </p>
                                            <div className="text-black mt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
                                                <Link href={"/admin/programs"}
                                                    className="px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition font-medium w-full"
                                                >
                                                    {t('createProgramBtn') || 'Create New Program'}
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
                    {state.error && state.error.programId && (
                        <InputMessageError message={state.error.programId} />
                    )}
                </div>
            )
            }




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

            {/* Form Actions */}
            <div className="flex gap-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {tc('cancel')}
                </button>
                <button
                    type="submit"
                    disabled={isLoading || isPending}
                    className="flex-1 px-4 py-2 bg-[#00284d] text-white rounded-lg hover:bg-[#003465] transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                    {
                        isPending
                            ? <Loader className='text-white' />
                            : isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {isEditing ? t('updating') : t('creating')}
                                </span>
                            ) : isEditing ? (
                                t('updateStudent')
                            ) : (
                                t('createStudent')
                            )
                    }
                </button>
            </div>
        </form>
    );
}
