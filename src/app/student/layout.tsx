import { ReactNode } from "react";
import { cookies } from "next/headers";
import { StudentLayout } from "@/components/student/StudentLayout";
import { verifyToken } from "@/utils/verifyToken";
import "./style.css";

export default async function StudentGroupLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("jwt")?.value || "";
  const decoded = verifyToken(token);

  return <StudentLayout decoded={decoded}>{children}</StudentLayout>;
}
