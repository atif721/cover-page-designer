import { useState } from "react";
import { pdf, Document } from "@react-pdf/renderer";
import { CoverPage, type NameLabel } from "@/components/CoverPagePDF";

import "./App.css";
import PDFPreview from "@/components/PDFPreview";

type ReportType = "Lab Report" | "Assignment" | "Project";

interface Teacher {
  name: string;
  designation: string;
}

interface Student {
  raw: string;
}

function parseStudent(raw: string): { name: string; id: string } {
  const [namePart = "", idPart = ""] = raw.split(",").map((s) => s.trim());
  return { name: namePart, id: idPart };
}

function App() {
  const [type, setType] = useState<ReportType>("Lab Report");
  const [nameLabel, setNameLabel] = useState<NameLabel>("Experiment Name");
  const [reportName, setReportName] = useState("");
  const [reportNo, setReportNo] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [students, setStudents] = useState<Student[]>([{ raw: "" }]);
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([{ name: "", designation: "" }]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  // Type changes also reset the name-box label to a valid default for that type.
  const handleTypeChange = (next: ReportType) => {
    setType(next);
    if (next === "Lab Report") setNameLabel("Experiment Name");
    else if (next === "Project") setNameLabel("Project Title");
    else setNameLabel(""); // Assignment — name box is hidden
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

  const generatePDF = async () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    const parsedStudents = students.map((s) => parseStudent(s.raw));

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
    const firstName = parseStudent(students[0]?.raw ?? "").name || "CoverPage";
    const safeName = firstName.replace(/\s+/g, "_");
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${type.replace(/\s+/g, "_")}_${safeName}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Form */}
      <div className="w-1/3 p-8 overflow-y-auto h-screen bg-white shadow-xl border-r border-gray-200">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">Cover Page Generator</h1>

        <div className="space-y-4">
          {/* Type Selection */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
            <div className="flex flex-wrap gap-4">
              {(["Lab Report", "Assignment", "Project"] as ReportType[]).map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="type"
                    checked={type === t}
                    onChange={() => handleTypeChange(t)}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{t}</span>
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
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-2 gap-4">
            <div className="col-span-2">
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

          {/* Name box — hidden entirely for Assignment */}
          {type !== "Assignment" && (
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
              {type === "Lab Report" ?
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name of the report</label>
                  <div className="flex gap-4">
                    {(["Experiment Name", "Report Title"] as const).map((opt) => (
                      <label
                        key={opt}
                        className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded border border-gray-300 hover:bg-gray-100 transition">
                        <input
                          type="radio"
                          name="nameLabel"
                          checked={nameLabel === opt}
                          onChange={() => setNameLabel(opt)}
                          className="w-4 h-4 text-blue-600"
                        />
                        <span className="text-sm">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              : <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
                </div>
              }
              <div>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  placeholder={
                    type === "Lab Report" ?
                      nameLabel === "Experiment Name" ?
                        "e.g. Study of Sorting Algorithms"
                      : "e.g. Mid-term Performance Analysis"
                    : "e.g. Smart Attendance System"
                  }
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
              {students.map((student, index) => (
                <div key={index} className="p-3 bg-gray-50 border border-gray-200 rounded-md relative group">
                  <button
                    onClick={() => removeStudent(index)}
                    disabled={students.length === 1}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition">
                    ×
                  </button>
                  <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                    Student {index + 1} — Name, ID
                  </label>
                  <input
                    type="text"
                    value={student.raw}
                    onChange={(e) => updateStudent(index, e.target.value)}
                    className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                    placeholder="e.g. Abdullah Atif, 241311051"
                  />
                  {student.raw && (
                    <p className="text-[11px] text-gray-500 mt-1">
                      {(() => {
                        const p = parseStudent(student.raw);
                        return (
                          <>
                            <span className="font-semibold">Name:</span> {p.name || "—"} ·{" "}
                            <span className="font-semibold">ID:</span> {p.id || "—"}
                          </>
                        );
                      })()}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-3 mt-4">
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
                  <div className="grid grid-cols-2 gap-2">
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

          <button
            onClick={generatePDF}
            className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition mt-6">
            Generate PDF ({students.length} page{students.length === 1 ? "" : "s"})
          </button>

          {pdfUrl && (
            <button
              onClick={downloadPDF}
              className="w-full flex-1 py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition shadow-lg">
              ⬇ Download
            </button>
          )}
        </div>
      </div>

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
  );
}

export default App;
