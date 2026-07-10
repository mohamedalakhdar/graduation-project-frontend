const fs = require('fs');

function updateJson(path, updates) {
    const data = JSON.parse(fs.readFileSync(path, 'utf8'));
    for (const [namespace, keyValues] of Object.entries(updates)) {
        if (!data[namespace]) data[namespace] = {};
        for (const [key, value] of Object.entries(keyValues)) {
            data[namespace][key] = value;
        }
    }
    fs.writeFileSync(path, JSON.stringify(data, null, 2));
}

updateJson('messages/en.json', {
    "Sidebar": {
        "studentPanel": "Student Panel"
    },
    "Student": {
        "courseName": "Course Name",
        "grade": "Grade",
        "studentInfoMissing": "Student information is missing. Please refresh the page",
        "advisorAssignedSuccess": "You have successfully assigned Dr. {advisorName} as your advisor.",
        "advisorAssignedFailed": "Failed to assign advisor. Please try again.",
        "academicAdvisors": "Academic Advisors",
        "assignAdvisorDesc": "Assign an academic advisor to guide you through your program.",
        "searchByNameOrDept": "Search by name or department...",
        "assigning": "Assigning...",
        "assigned": "Assigned",
        "assign": "Assign",
        "noAdvisorsFound": "No advisors found matching your search.",
        "coursesRegistrationDesc": "Select your courses for the current semester.",
        "courseFullError": "This course is fully booked.",
        "maxCreditsError": "Sorry, you reached the maximum credit load ({maxCredits} Cr.) for this semester.",
        "courseRegisteredSuccess": "Course registered successfully!",
        "courseRegisteredFailed": "Failed to register course.",
        "noCoursesAvailable": "No Courses Available",
        "registrationIsClosed": "Registration Is Closed",
        "searchByCourse": "Search by course title or code...",
        "courseFull": "Course is full",
        "pending": "Pending",
        "approved": "Approved",
        "seats": "Seats",
        "registrationInformation": "Registration Information",
        "academicTerm": "Academic Term",
        "startsOn": "Starts On",
        "endsOn": "Ends On",
        "courseRegistrationUpdates": "Stay tuned for updates regarding the registration period.",
        "error": "Error"
    }
});

updateJson('messages/ar.json', {
    "Sidebar": {
        "studentPanel": "لوحة الطالب"
    },
    "Student": {
        "courseName": "اسم المادة",
        "grade": "الدرجة",
        "studentInfoMissing": "بيانات الطالب مفقودة. يرجى تحديث الصفحة",
        "advisorAssignedSuccess": "تم تعيين د. {advisorName} كمرشد لك بنجاح.",
        "advisorAssignedFailed": "فشل في تعيين المرشد. يرجى المحاولة مرة أخرى.",
        "academicAdvisors": "المرشدون الأكاديميون",
        "assignAdvisorDesc": "قم بتعيين مرشد أكاديمي لتوجيهك في برنامجك.",
        "searchByNameOrDept": "البحث بالاسم أو القسم...",
        "assigning": "جاري التعيين...",
        "assigned": "تم التعيين",
        "assign": "تعيين",
        "noAdvisorsFound": "لم يتم العثور على مرشدين يطابقون بحثك.",
        "coursesRegistrationDesc": "اختر موادك للفصل الدراسي الحالي.",
        "courseFullError": "هذه المادة ممتلئة بالكامل.",
        "maxCreditsError": "عذراً، لقد وصلت للحد الأقصى للعبء الدراسي ({maxCredits} ساعة) لهذا الفصل.",
        "courseRegisteredSuccess": "تم تسجيل المادة بنجاح!",
        "courseRegisteredFailed": "فشل في تسجيل المادة.",
        "noCoursesAvailable": "لا توجد مواد متاحة",
        "registrationIsClosed": "التسجيل مغلق",
        "searchByCourse": "البحث باسم المادة أو الكود...",
        "courseFull": "المادة ممتلئة",
        "pending": "قيد الانتظار",
        "approved": "مقبول",
        "seats": "مقاعد",
        "registrationInformation": "معلومات التسجيل",
        "academicTerm": "الفصل الأكاديمي",
        "startsOn": "يبدأ في",
        "endsOn": "ينتهي في",
        "courseRegistrationUpdates": "ترقب التحديثات بشأن فترة التسجيل.",
        "error": "خطأ"
    }
});
