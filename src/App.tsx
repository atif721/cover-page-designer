import { useState } from "react";

import "./App.css";
import PDFPreview from "@/components/PDFPreview";
import ActionButtons from "@/components/form/ActionButtons";
import CourseFields from "@/components/form/CourseFields";
import MobileTabs from "@/components/form/MobileTabs";
import StudentsSection from "@/components/form/StudentsSection";
import TeachersSection from "@/components/form/TeachersSection";
import TypeSelector from "@/components/form/TypeSelector";
import { useCoverPageForm } from "@/hooks/useCoverPageForm";
import { formatDateForDisplay } from "./utils/formatDate";

type Tab = "form" | "preview";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const f = useCoverPageForm();

  return (
    <div className="flex h-screen flex-col bg-gray-100 md:flex-row">
      {/* Mobile tab switcher — hidden on md+ */}
      <MobileTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Left Side: Form */}
      <div
        className={`h-screen w-full overflow-y-auto border-gray-200 bg-white p-4 shadow-xl md:w-3/5 md:border-r md:p-8 ${
          activeTab === "form" ? "block" : "hidden md:block"
        }`}
      >
        <div className="mb-4 flex items-center justify-between md:mb-6">
          <h1 className="text-xl font-bold text-gray-800 md:text-2xl">
            Cover Page Generator
          </h1>
          <button
            onClick={f.handleReset}
            title="Clear all form data"
            className="rounded border border-red-200 px-2 py-1 text-xs text-red-600 transition hover:bg-red-50 hover:text-red-800"
          >
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <TypeSelector type={f.type} onChange={f.setType} />

          <CourseFields
            type={f.type}
            nameLabel={f.rawNameLabel}
            reportPlaceholder={f.reportPlaceholder}
            reportName={f.reportName}
            reportNo={f.reportNo}
            courseCode={f.courseCode}
            courseTitle={f.courseTitle}
            submissionDate={f.submissionDate}
            showTitleBox={f.showTitleBox}
            onToggleTitleBox={f.setShowTitleBox}
            setters={{
              setReportName: f.setReportName,
              setReportNo: f.setReportNo,
              setCourseCode: f.setCourseCode,
              setCourseTitle: f.setCourseTitle,
              setSubmissionDate: f.setSubmissionDate,
            }}
          />

          <StudentsSection
            students={f.students.items}
            parsedStudents={f.parsedStudents}
            isProject={f.isProject}
            section={f.section}
            semester={f.semester}
            batch={f.batch}
            onAdd={f.students.addStudent}
            onUpdate={f.students.updateStudent}
            onRemove={f.students.removeStudent}
            onToggleHidden={f.students.toggleStudentHidden}
            setters={{
              setSection: f.setSection,
              setSemester: f.setSemester,
              setBatch: f.setBatch,
            }}
          />

          <TeachersSection
            teachers={f.teachers.items}
            onAdd={f.teachers.addTeacher}
            onUpdate={f.teachers.updateTeacher}
            onRemove={f.teachers.removeTeacher}
          />

          <ActionButtons
            studentCount={f.visibleStudentCount}
            pdfUrl={f.pdfUrl}
            onGenerate={f.generatePdf}
            onDownload={f.downloadPdf}
          />
        </div>
      </div>

      <div
        className={`flex-1 ${activeTab === "preview" ? "block" : "hidden md:block"}`}
      >
        <PDFPreview
          type={f.type}
          nameLabel={f.nameLabel}
          reportName={f.reportName}
          reportNo={f.reportNo}
          courseCode={f.courseCode}
          courseTitle={f.courseTitle}
          submissionDate={formatDateForDisplay(f.submissionDate)}
          studentName=""
          studentId=""
          section={f.section}
          semester={f.semester}
          batch={f.batch}
          teachers={f.teachers.items}
          students={f.students.items}
        />
      </div>
    </div>
  );
}

export default App;
