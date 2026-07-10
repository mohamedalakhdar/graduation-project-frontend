import SingleProgramPage from "@/components/admin/programs/SingleProgramPage";
import { getSingleProgram } from "@/server/ProgramsActions";


export default async function Page({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    const program = await getSingleProgram(id);

    return <SingleProgramPage program={program} />;
}