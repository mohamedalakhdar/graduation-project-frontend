"use client";

import { programError, updateCreditsForSingleProgram, updateNameForSingleProgram } from "@/server/ProgramsActions";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from '@/i18n/IntlProvider';
import toast from "react-hot-toast";
import Loader from "@/components/ui/Loader";
import InputMessageError from "@/components/ui/InputMessageError";

interface IProps {
    departmentId: string;
    departmentName: string;
    id: string;
    name: string;
    requiredCredits: number;
}

export interface IResult {
    success: boolean;
    message: string;
    name: string;
    error: programError | null;
    formData?: undefined;
}

export default function SingleProgramPage({ program }: { program: IProps }) {
    const router = useRouter();
    const tc = useTranslations('Common');
    const t = useTranslations('Programs');

    const [isLoadingName, setIsLoadingName] = useState<boolean>(false)
    const [isEditingName, setIsEditingName] = useState(false);
    const [isLoadingCredits, setIsLoadingCredits] = useState<boolean>(false)
    const [isEditingCredits, setIsEditingCredits] = useState(false);

    const [name, setName] = useState(program.name);
    const [credits, setCredits] = useState(program.requiredCredits);

    // state for result
    const [resultValue, setResultValue] = useState<IResult | undefined>();

    const handleUpdateName = async ({ id, name }: { id: string, name: string }) => {
        setIsEditingCredits(false);
        if (isEditingName) {
            setIsLoadingName(true)
            // server action
            const result = await updateNameForSingleProgram({ id, name }) as IResult;
            setResultValue(result);

            if (result.success && result.message && result.error === null) {
                toast.success(result.message);
            } else {
                toast.error(result.message || tc('error'))
            }

            setIsLoadingName(false)
            router.refresh();
        }
        setIsEditingName(!isEditingName);
    };

    const handleUpdateCredits = async ({ id, requiredCredits }: { id: string, requiredCredits: string }) => {
        setIsEditingName(false);
        if (isEditingCredits) {
            // server action
            setIsLoadingCredits(true)
            // server action
            const result = await updateCreditsForSingleProgram({ id, requiredCredits }) as IResult;
            setResultValue(result);

            if (result.success && result.message && result.error === null) {
                toast.success(result.message);
            } else {
                toast.error(result.message || tc('error'))
            }

            setIsLoadingCredits(false)
            router.refresh();
        }
        setIsEditingCredits(!isEditingCredits);
    };

    return (
        <section className="flex flex-col justify-center items-center">
            <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md border border-gray-200">
                {/* Department */}
                <p className="text-sm text-gray-500 mb-2">
                    {program.departmentName}
                </p>

                {/* Name */}
                <div className="mb-4">
                    <label className="text-sm text-gray-600">{t('labelProgramName')}</label>

                    {isEditingName ? (
                        <input
                            name="name"
                            value={name}
                            autoFocus={isEditingName}
                            onChange={(e) => setName(e.target.value)}
                            placeholder={t('placeholderProgramName')}
                            className="w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00284d]"
                        />
                    ) : (
                        <div className="flex justify-between gap-2 text-lg font-semibold mt-1">
                            <p>{program.name}</p>
                            {/* <span className="cursor-pointer" onClick={handleUpdateName}><Edit /></span> */}
                        </div>
                    )}
                    {resultValue?.message && resultValue.error && <InputMessageError message={resultValue.error.name as string} />}
                </div>

                {/* Credits */}
                <div className="mb-6">
                    <label className="text-sm text-gray-600">{t('labelRequiredCredits')}</label>

                    {isEditingCredits ? (
                        <input
                            name="credits"
                            type="number"
                            value={credits}
                            onChange={(e) => setCredits(Number(e.target.value))}
                            placeholder={t('placeholderRequiredCredits')}
                            className={`w-full mt-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00284d] `}
                        />
                    ) : (
                        <div className="flex justify-between gap-2 text-lg font-semibold mt-1">
                            <p>{credits}</p>
                            {/* <span className="cursor-pointer" onClick={handleUpdateCredits}><Edit /></span> */}
                        </div>
                    )}
                </div>

                {/* Buttons */}
                <div className="flex gap-3">
                    <button
                        disabled={isLoadingName || isLoadingCredits || isEditingCredits}
                        onClick={() => handleUpdateName({ id: program.id, name })}
                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        {isLoadingName ? <Loader /> : isEditingName ? t('btnSaveName') : t('btnUpdateName')}
                    </button>

                    <button
                        disabled={isLoadingName || isLoadingCredits || isEditingName}
                        onClick={() => handleUpdateCredits({ id: program.id, requiredCredits: String(credits) })}
                        className={`flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition`}
                    >
                        {isLoadingCredits ? <Loader /> : isEditingCredits ? t('btnSaveCredits') : t('btnUpdateCredits')}
                    </button>
                </div>
            </div>
        </section>
    );
}


