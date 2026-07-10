// src/app/professor/grades/page.tsx
"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save, Search, CheckCircle2, Download } from "lucide-react"; // تم إضافة أيقونة Download
import Link from "next/link";

// تعريف نوع بيانات الطالب
interface StudentGrade {
  id: string;
  studentId: string;
  name: string;
  midterm: number | string;
  coursework: number | string;
  final: number | string;
}

function GradingContent() {
  const searchParams = useSearchParams();
  const courseId = searchParams.get("courseId") || "Unknown Course";

  const [students, setStudents] = useState<StudentGrade[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // محاكاة جلب بيانات الطلاب المسجلين في هذه المادة
    const fetchStudents = () => {
      setTimeout(() => {
        setStudents([
          {
            id: "1",
            studentId: "2023001",
            name: "Ahmed Ali",
            midterm: 20,
            coursework: 15,
            final: 45,
          },
          {
            id: "2",
            studentId: "2023045",
            name: "Sara Mohamed",
            midterm: 18,
            coursework: 20,
            final: 40,
          },
          {
            id: "3",
            studentId: "2023088",
            name: "Omar Hassan",
            midterm: 25,
            coursework: 25,
            final: 50,
          },
          {
            id: "4",
            studentId: "2023102",
            name: "Nour Al-Din",
            midterm: 24,
            coursework: 22,
            final: 48,
          },
          {
            id: "5",
            studentId: "2023150",
            name: "Mona Youssef",
            midterm: "",
            coursework: "",
            final: "",
          },
        ]);
        setIsLoading(false);
      }, 1500);
    };

    fetchStudents();
  }, [courseId]);

  // دالة لتحديث الدرجة في الـ State
  const handleGradeChange = (
    id: string,
    field: keyof StudentGrade,
    value: string,
  ) => {
    if (value !== "" && isNaN(Number(value))) return;

    setStudents((prev) =>
      prev.map((student) =>
        student.id === id
          ? { ...student, [field]: value === "" ? "" : Number(value) }
          : student,
      ),
    );
  };

  // دالة الحفظ
  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  // دالة تصدير الدرجات لملف CSV
  const handleExportCSV = () => {
    // 1. تعريف رؤوس الأعمدة
    const headers = [
      "Student ID",
      "Name",
      "Midterm (25)",
      "Coursework (25)",
      "Final (50)",
      "Total (100)",
    ];

    // 2. تحويل بيانات الطلاب لنصوص تفصلها فواصل (Comma-separated)
    const csvData = students.map((student) => {
      const midterm = Number(student.midterm) || 0;
      const coursework = Number(student.coursework) || 0;
      const final = Number(student.final) || 0;
      const total = midterm + coursework + final;

      return [
        student.studentId,
        `"${student.name}"`, // وضعنا الاسم بين علامتي تنصيص لتجنب مشاكل لو الاسم فيه فاصلة
        student.midterm,
        student.coursework,
        student.final,
        total > 0 ? total : 0, // المجموع
      ].join(",");
    });

    // 3. دمج الرؤوس مع البيانات
    const csvString = [headers.join(","), ...csvData].join("\n");

    // 4. إنشاء ملف للتحميل
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    // تسمية الملف برقم المادة
    link.setAttribute("download", `Grades_${courseId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link); // تنظيف بعد التحميل
  };

  // فلترة الطلاب بناءً على البحث
  const filteredStudents = students.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.studentId.includes(searchQuery),
  );

  return (
    <div className="animate-in fade-in duration-500 p-4 mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Button
            variant="ghost"
            asChild
            className="mb-2 -ml-2 text-muted-foreground"
          >
            <Link href="/professor/courses">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Courses
            </Link>
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Manage Grades</h1>
          <p className="text-muted-foreground mt-1">
            Course ID:{" "}
            <span className="font-semibold text-foreground">{courseId}</span>
          </p>
        </div>

        {!isLoading && (
          <div className="flex items-center gap-2">
            {/* زرار التصدير الجديد */}
            <Button variant="outline" onClick={handleExportCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>

            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="min-w-[140px]"
            >
              {isSaving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Saving...
                </div>
              ) : showSuccess ? (
                <div className="flex items-center gap-2 text-green-300">
                  <CheckCircle2 className="w-4 h-4" />
                  Saved!
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </div>
              )}
            </Button>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {isLoading ? (
        <div className="space-y-4 bg-card border rounded-xl p-4">
          <div className="flex justify-between mb-6">
            <Skeleton className="h-10 w-64" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      ) : (
        /* Main Content */
        <div className="bg-card border rounded-xl overflow-hidden animate-in slide-in-from-bottom-4 duration-700 shadow-sm">
          {/* Toolbar */}
          <div className="p-4 border-b bg-muted/20 flex items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>
            <div className="text-sm text-muted-foreground hidden md:block">
              Total Students:{" "}
              <span className="font-semibold text-foreground">
                {students.length}
              </span>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/40 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Student Info</th>
                  <th className="px-6 py-4 font-medium w-32">Midterm (25)</th>
                  <th className="px-6 py-4 font-medium w-32">
                    Coursework (25)
                  </th>
                  <th className="px-6 py-4 font-medium w-32">Final (50)</th>
                  <th className="px-6 py-4 font-medium w-32 text-center">
                    Total (100)
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredStudents.length > 0 ? (
                  filteredStudents.map((student) => {
                    const total =
                      (Number(student.midterm) || 0) +
                      (Number(student.coursework) || 0) +
                      (Number(student.final) || 0);

                    return (
                      <tr
                        key={student.id}
                        className="hover:bg-muted/10 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-foreground">
                            {student.name}
                          </div>
                          <div className="text-muted-foreground text-xs mt-0.5">
                            {student.studentId}
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <Input
                            type="text"
                            value={student.midterm}
                            onChange={(e) =>
                              handleGradeChange(
                                student.id,
                                "midterm",
                                e.target.value,
                              )
                            }
                            className="h-9 text-center bg-transparent focus-visible:bg-background"
                            maxLength={2}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <Input
                            type="text"
                            value={student.coursework}
                            onChange={(e) =>
                              handleGradeChange(
                                student.id,
                                "coursework",
                                e.target.value,
                              )
                            }
                            className="h-9 text-center bg-transparent focus-visible:bg-background"
                            maxLength={2}
                          />
                        </td>
                        <td className="px-6 py-3">
                          <Input
                            type="text"
                            value={student.final}
                            onChange={(e) =>
                              handleGradeChange(
                                student.id,
                                "final",
                                e.target.value,
                              )
                            }
                            className="h-9 text-center bg-transparent focus-visible:bg-background"
                            maxLength={2}
                          />
                        </td>
                        <td className="px-6 py-4 text-center font-bold text-primary text-base">
                          {total > 0 ? total : "-"}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-12 text-center text-muted-foreground"
                    >
                      No students found matching your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProfessorGrades() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-muted-foreground">
          Loading Gradebook...
        </div>
      }
    >
      <GradingContent />
    </Suspense>
  );
}