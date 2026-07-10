/**
 * @desc     verify token
 * @params   token
 * @return   payload
*/
import { JwtPayload } from "@/types";
import { jwtDecode } from "jwt-decode";

export function verifyToken(token: string): JwtPayload | null {
    try {
        const decoded = jwtDecode(token) as JwtPayload;
        return decoded;
    } catch (error) {
        console.log(error)
        return null;
    }
}
