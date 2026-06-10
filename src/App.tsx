import { useState, useEffect } from "react";
import { pdf, Document } from "@react-pdf/renderer";
import { CoverPage, type NameLabel } from "@/components/CoverPagePDF";

import "./App.css";
import PDFPreview from "@/components/PDFPreview";

type ReportType = "Lab Report" | "Assignment" | "Project" | "Experiment";

interface Teacher {
  name: string;
  designation: string;
}

interface Student {
  raw: string;
}

const STORAGE_KEY = "coverPageDesigner:v1";

// Per-type label for the shared "name" box (hidden for Assignment).
// Project gets an empty label here because each student supplies a per-student
// project title in their own input row.
const NAME_LABEL_FOR_TYPE: Record<ReportType, NameLabel> = {
  Experiment: "Experiment Name",
  "Lab Report": "Report Title",
  Project: "Project Title",
  Assignment: "",
};

interface PersistedState {
  type: ReportType;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  students: Student[];
  section: string;
  semester: string;
  batch: string;
  teachers: Teacher[];
}

function parseStudent(raw: string, isProject: boolean): { name: string; id: string; projectTitle: string } {
  // Format: "Name, ID[, Project is about...]"
  // Split into at most 3 parts so a project title with commas survives intact.
  const parts = raw.split(",").map((s) => s.trim());
  const [namePart = "", idPart = "", ...rest] = parts;
  return {
    name: namePart,
    id: idPart,
    projectTitle: isProject ? rest.join(", ") : "",
  };
}

function loadState(): PersistedState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    // Light validation — bail if shape is wrong
    if (!parsed || !Array.isArray(parsed.students) || !Array.isArray(parsed.teachers)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function App() {
  const persisted = loadState();

  const [type, setType] = useState<ReportType>(persisted?.type ?? "Lab Report");
  const [reportName, setReportName] = useState(persisted?.reportName ?? "");
  const [reportNo, setReportNo] = useState(persisted?.reportNo ?? "");
  const [courseCode, setCourseCode] = useState(persisted?.courseCode ?? "");
  const [courseTitle, setCourseTitle] = useState(persisted?.courseTitle ?? "");
  const [submissionDate, setSubmissionDate] = useState(persisted?.submissionDate ?? "");
  const [students, setStudents] = useState<Student[]>(persisted?.students ?? [{ raw: "" }]);
  const [section, setSection] = useState(persisted?.section ?? "");
  const [semester, setSemester] = useState(persisted?.semester ?? "");
  const [batch, setBatch] = useState(persisted?.batch ?? "");
  const [teachers, setTeachers] = useState<Teacher[]>(persisted?.teachers ?? [{ name: "", designation: "" }]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form");

  // Derived: which label to show in the shared name box (or hide for Assignment).
  const nameLabel: NameLabel = NAME_LABEL_FOR_TYPE[type];

  // Persist to localStorage on any change.
  useEffect(() => {
    const state: PersistedState = {
      type,
      reportName,
      reportNo,
      courseCode,
      courseTitle,
      submissionDate,
      students,
      section,
      semester,
      batch,
      teachers,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // quota / private-mode — silently ignore
    }
  }, [
    type,
    reportName,
    reportNo,
    courseCode,
    courseTitle,
    submissionDate,
    students,
    section,
    semester,
    batch,
    teachers,
  ]);

  const handleTypeChange = (next: ReportType) => {
    setType(next);
    // No nameLabel state to update — it's derived from `type` now.
  };

  const addStudent = () => {
    setStudents([...students, { raw: "" }]);
  };

  const updateStudent = (index: number, value: string) => {
    const next = [...students];
    next[index] = { raw: value };
    setStudents(next);
  };

  const removeStudent = (index: number) => {
    if (students.length > 1) {
      setStudents(students.filter((_, i) => i !== index));
    }
  };

  const addTeacher = () => {
    setTeachers([...teachers, { name: "", designation: "" }]);
  };

  const updateTeacher = (index: number, field: keyof Teacher, value: string) => {
    const newTeachers = [...teachers];
    newTeachers[index][field] = value;
    setTeachers(newTeachers);
  };

  const removeTeacher = (index: number) => {
    if (teachers.length > 1) {
      setTeachers(teachers.filter((_, i) => i !== index));
    }
  };

  const handleReset = () => {
    if (!confirm("Clear all form data?")) return;
    localStorage.removeItem(STORAGE_KEY);
    setType("Lab Report");
    setReportName("");
    setReportNo("");
    setCourseCode("");
    setCourseTitle("");
    setSubmissionDate("");
    setStudents([{ raw: "" }]);
    setSection("");
    setSemester("");
    setBatch("");
    setTeachers([{ name: "", designation: "" }]);
  };

  const generatePDF = async () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    const isProject = type === "Project";
    const parsedStudents = students.map((s) => parseStudent(s.raw, isProject));

    const blob = await pdf(
      <Document>
        {parsedStudents.map((s, i) => (
          <CoverPage
            key={i}
            type={type}
            nameLabel={nameLabel}
            reportName={reportName}
            reportNo={reportNo}
            courseCode={courseCode}
            courseTitle={courseTitle}
            submissionDate={submissionDate}
            studentName={s.name}
            studentId={s.id}
            section={section}
            semester={semester}
            batch={batch}
            teachers={teachers}
            projectTitle={s.projectTitle}
          />
        ))}
      </Document>,
    ).toBlob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
    setPdfUrl(url);
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const firstName = parseStudent(students[0]?.raw ?? "", type === "Project").name || "CoverPage";
    const safeName = firstName.replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${type.replace(/\s+/g, "_")}_${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const isProject = type === "Project";
  const reportPlaceholder =
    isProject ? "e.g. (leave empty — set per student)"
    : type === "Experiment" ? "e.g. Study of Sorting Algorithms"
    : type === "Lab Report" ? "e.g. Mid-term Performance Analysis"
    : "e.g. (not used for Assignment)";

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Mobile tab switcher — hidden on md+ */}
      <div className="md:hidden flex border-b border-gray-200 bg-white">
        <button
          onClick={() => setActiveTab("form")}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "form" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}>
          Form
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex-1 py-3 text-sm font-semibold ${
            activeTab === "preview" ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500"
          }`}>
          Preview
        </button>
      </div>

      {/* Left Side: Form */}
      <div
        className={`w-full md:w-1/3 p-4 md:p-8 overflow-y-auto h-screen bg-white shadow-xl md:border-r border-gray-200 ${
          activeTab === "form" ? "block" : "hidden md:block"
        }`}>
        <div className="flex justify-between items-center mb-4 md:mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800">Cover Page Generator</h1>
          <button
            onClick={handleReset}
            title="Clear all form data"
            className="text-xs text-red-600 hover:text-red-800 px-2 py-1 border border-red-200 rounded hover:bg-red-50 transition">
            Reset
          </button>
        </div>

        <div className="space-y-4">
          {/* Type Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex flex-wrap gap-2 md:gap-4">
              {(["Lab Report", "Experiment", "Assignment", "Project"] as ReportType[]).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 transition text-sm">
                  <input
                    type="radio"
                    name="type"
                    checked={type === t}
                    onChange={() => handleTypeChange(t)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report/Assignment/Project No */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">{type} No.</label>
            <input
              type="text"
              value={reportNo}
              onChange={(e) => setReportNo(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="e.g. 01"
            />
          </div>

          {/* Course Details */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Title</label>
              <input
                type="text"
                value={courseTitle}
                onChange={(e) => setCourseTitle(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder="Computer Graphics Lab"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
              <input
                type="text"
                value={courseCode}
                onChange={(e) => setCourseCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                placeholder="CSE 3102"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
              <input
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          {/* Shared name box — hidden for Assignment and Project.
              For Project, each student supplies their own project title in the Students section. */}
          {type !== "Assignment" && type !== "Project" && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{nameLabel}</label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  placeholder={reportPlaceholder}
                />
              </div>
            </div>
          )}

          {/* Student Details (multi-student) */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Students</h2>
              <button
                onClick={addStudent}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
                + Add Student
              </button>
            </div>
            <div className="space-y-3">
              {students.map((student, index) => {
                const parsed = parseStudent(student.raw, isProject);
                return (
                  <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-md relative group">
                    <button
                      onClick={() => removeStudent(index)}
                      disabled={students.length === 1}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition">
                      ×
                    </button>
                    <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                      {isProject ?
                        `Student ${index + 1} — Name, ID, Project is about...`
                      : `Student ${index + 1} — Name, ID`}
                    </label>
                    <input
                      type="text"
                      value={student.raw}
                      onChange={(e) => updateStudent(index, e.target.value)}
                      className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                      placeholder={
                        isProject ?
                          "e.g. Abdullah Atif, 241311051, Smart Attendance System"
                        : "e.g. Abdullah Atif, 241311051"
                      }
                    />
                    {student.raw && (
                      <p className="text-[11px] text-gray-500 mt-1">
                        <span className="font-semibold">Name:</span> {parsed.name || "—"} ·{" "}
                        <span className="font-semibold">ID:</span> {parsed.id || "—"}
                        {isProject && (
                          <>
                            {" · "}
                            <span className="font-semibold">Project:</span> {parsed.projectTitle || "—"}
                          </>
                        )}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Section</label>
                <input
                  type="text"
                  value={section}
                  onChange={(e) => setSection(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Semester</label>
                <input
                  type="text"
                  value={semester}
                  onChange={(e) => setSemester(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                  placeholder="5th Semester"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Batch</label>
                <input
                  type="text"
                  value={batch}
                  onChange={(e) => setBatch(e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                  placeholder="34th"
                />
              </div>
            </div>
          </div>

          {/* Teacher Details */}
          <div className="border-t pt-4 mt-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-semibold text-gray-800">Submitted To</h2>
              <button
                onClick={addTeacher}
                className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
                + Add Teacher
              </button>
            </div>
            <div className="space-y-4">
              {teachers.map((teacher, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-md relative group">
                  <button
                    onClick={() => removeTeacher(index)}
                    disabled={teachers.length === 1}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition">
                    ×
                  </button>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Name</label>
                      <input
                        type="text"
                        value={teacher.name}
                        onChange={(e) => updateTeacher(index, "name", e.target.value)}
                        className="w-full p-1 text-sm border border-gray-300 rounded outline-none bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">Designation</label>
                      <input
                        type="text"
                        value={teacher.designation}
                        onChange={(e) => updateTeacher(index, "designation", e.target.value)}
                        className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2 mt-6">
            <button
              onClick={generatePDF}
              className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition">
              Generate PDF ({students.length} page{students.length === 1 ? "" : "s"})
            </button>

            {pdfUrl && (
              <button
                onClick={downloadPDF}
                className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition shadow-lg">
                ⬇ Download
              </button>
            )}
          </div>
        </div>
      </div>

      <div className={`flex-1 ${activeTab === "preview" ? "block" : "hidden md:block"}`}>
        <PDFPreview
          type={type}
          nameLabel={nameLabel}
          reportName={reportName}
          reportNo={reportNo}
          courseCode={courseCode}
          courseTitle={courseTitle}
          submissionDate={submissionDate}
          studentName=""
          studentId=""
          section={section}
          semester={semester}
          batch={batch}
          teachers={teachers}
          students={students}
        />
      </div>
    </div>
  );
}

export default App;
