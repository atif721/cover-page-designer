import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { CoverPagePDF } from "./CoverPagePDF";

import "./App.css";
import PDFPreview from "./PDFPreview";

interface Teacher {
  name: string;
  designation: string;
}

function App() {
  const [type, setType] = useState<"Lab Report" | "Assignment">("Lab Report");
  const [reportNo, setReportNo] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [experimentName, setExperimentName] = useState("");
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [section, setSection] = useState("");
  const [semester, setSemester] = useState("");
  const [batch, setBatch] = useState("");
  const [teachers, setTeachers] = useState<Teacher[]>([{ name: "", designation: "" }]);

  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

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

  const pdfProps = {
    type,
    reportNo,
    courseCode,
    courseTitle,
    submissionDate,
    experimentName,
    studentName,
    studentId,
    section,
    semester,
    batch,
    teachers,
  };

  const generatePDF = async () => {
    if (pdfUrl) URL.revokeObjectURL(pdfUrl);

    const blob = await pdf(<CoverPagePDF {...pdfProps} />).toBlob();
    const url = URL.createObjectURL(blob);

    window.open(url, "_blank");
    setPdfUrl(url);
  };

  const downloadPDF = () => {
    if (!pdfUrl) return;
    const a = document.createElement("a");
    a.href = pdfUrl;
    a.download = `${type}_${studentName || "CoverPage"}.pdf`;
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
            <div className="flex gap-4">
              {["Lab Report", "Assignment"].map((t) => (
                <label
                  key={t}
                  className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 transition">
                  <input
                    type="radio"
                    name="type"
                    checked={type === t}
                    onChange={() => setType(t as "Lab Report" | "Assignment")}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span className="text-sm">{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Report/Assignment No */}
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

          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {type === "Lab Report" ? "Experiment Name" : "Assignment Name"}
            </label>
            <input
              type="text"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder="Enter the name"
            />
          </div>

          {/* Student Details */}
          <div className="border-t pt-4 mt-4">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Student Details</h2>
            <div className="space-y-3">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                  <input
                    type="text"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
                  <input
                    type="text"
                    value={section}
                    onChange={(e) => setSection(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input
                    type="text"
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="5th Semester"
                  />
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                  <input
                    type="text"
                    value={batch}
                    onChange={(e) => setBatch(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    placeholder="34th"
                  />
                </div>
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
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs opacity-0 group-hover:opacity-100 transition">
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
            Generate PDF
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
        reportNo={reportNo}
        courseCode={courseCode}
        courseTitle={courseTitle}
        submissionDate={submissionDate}
        experimentName={experimentName}
        studentName={studentName}
        studentId={studentId}
        section={section}
        semester={semester}
        batch={batch}
        teachers={teachers}
      />
    </div>
  );
}

export default App;
