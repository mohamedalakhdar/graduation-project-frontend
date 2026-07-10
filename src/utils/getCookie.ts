import { cookies } from "next/headers";

/**
 * @desc    get token form cookie
 * @access  any one
 * @return  token
*/
const getTokenFromCookie = async (): Promise<string | null> => {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value;

    if (token) {
        return token
    }

    return null;
}

export default getTokenFromCookie;