import { cookies } from 'next/headers';
import ProfessorDashboardPage from '@/components/professor/ProfessorDashboardPage';
import { Roles } from '@/enums';
import { verifyToken } from '@/utils/verifyToken';

function hasRole(roles: string | undefined, role: string) {
    return roles
        ?.split(',')
        .map((item) => item.trim())
        .includes(role) ?? false;
}

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('jwt')?.value || '';
    const decoded = verifyToken(token);

    return (
        <ProfessorDashboardPage
            facultyId={decoded?.uid || ''}
            isAdvisor={hasRole(decoded?.roles, Roles.Advisor)}
        />
    );
}
