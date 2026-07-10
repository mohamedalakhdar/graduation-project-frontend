import RegistrationsPage from "@/components/admin/registrations/RegistrationsPage";
import { verifyToken } from "@/utils/verifyToken";
import { cookies } from "next/headers";

export default async function Page() {
    const cookieStore = await cookies();
        const token = cookieStore.get('jwt')?.value || '';
        const decoded = verifyToken(token);

    return <RegistrationsPage id={decoded?.uid || ""} />;
}
