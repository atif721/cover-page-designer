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

type Tab = "form" | "preview";

function App() {
  const [activeTab, setActiveTab] = useState<Tab>("form");
  const f = useCoverPageForm();

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile tab switcher — hidden on md+ */}
      <MobileTabs activeTab={activeTab} onChange={setActiveTab} />

      {/* Left Side: Form */}
      <div
        className={`w-full md:w-1/3 p-4 md:p-8 overflow-y-auto h-screen bg-white shadow-xl md:border-r border-gray-200 ${
          activeTab === "form" ? "block" : "hidden md:block"
        }`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cover Page Generator</h1>
          <button
            onClick={f.handleReset}
            title="Clear all form data"
            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition">
            Reset
          </button>
        </div>

        <div className="space-y-4">
          <TypeSelector type={f.type} onChange={f.setType} />

          <CourseFields
            type={f.type}
            nameLabel={f.nameLabel}
            reportPlaceholder={f.reportPlaceholder}
            reportName={f.reportName}
            reportNo={f.reportNo}
            courseCode={f.courseCode}
            courseTitle={f.courseTitle}
            submissionDate={f.submissionDate}
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
            studentCount={f.students.items.length}
            pdfUrl={f.pdfUrl}
            onGenerate={f.generatePdf}
            onDownload={f.downloadPdf}
          />
        </div>
      </div>

      <div className={`flex-1 ${activeTab === "preview" ? "block" : "hidden md:block"}`}>
        <PDFPreview
          type={f.type}
          nameLabel={f.nameLabel}
          reportName={f.reportName}
          reportNo={f.reportNo}
          courseCode={f.courseCode}
          courseTitle={f.courseTitle}
          submissionDate={f.submissionDate}
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
