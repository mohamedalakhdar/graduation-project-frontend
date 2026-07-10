import { CircleX } from "lucide-react";


interface IProps {
    message?: string;
}

const InputMessageError = ({ message }: IProps) => {
    return (
        message && (
            <div className="text-red-800 text-sm flex items-start gap-1 mt-1">
                <span><CircleX size={16} /></span>
                <span>{message}</span>
            </div>
        )
    )
}

export { InputMessageError };
export default InputMessageError;