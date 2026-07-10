import LoginForm from "@/components/login/LoginForm";
import { cookies } from "next/headers";

const LoginPage = async () => {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value as string;

    // throw new Error("TEST_ERROR");


    return <LoginForm token={token} />;
};

export default LoginPage;
