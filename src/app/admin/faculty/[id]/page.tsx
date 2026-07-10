import SingleFacultyPage from "@/components/admin/faculty/SingleFacultyPage";
import { getSingleFacultyMember } from "@/server/FacultyAction";


export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const facultyMember = await getSingleFacultyMember(id);

    return <SingleFacultyPage facultyMember={facultyMember} />;
}