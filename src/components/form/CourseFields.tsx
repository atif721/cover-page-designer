import type { NameLabel, ReportType } from "@/types";

interface CourseFieldsProps {
  type: ReportType;
  nameLabel: NameLabel;
  reportPlaceholder: string;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  setters: {
    setReportName: (next: string) => void;
    setReportNo: (next: string) => void;
    setCourseCode: (next: string) => void;
    setCourseTitle: (next: string) => void;
    setSubmissionDate: (next: string) => void;
  };
}

function CourseFields({
  type,
  nameLabel,
  reportPlaceholder,
  reportName,
  reportNo,
  courseCode,
  courseTitle,
  submissionDate,
  setters,
}: CourseFieldsProps) {
  return (
    <>
      {/* Report/Assignment/Project No */}
      <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
        <label className="block text-sm font-medium text-gray-700 mb-1">{type} No.</label>
        <input
          type="text"
          value={reportNo}
          onChange={(e) => setters.setReportNo(e.target.value)}
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
            onChange={(e) => setters.setCourseTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            placeholder="Computer Graphics Lab"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setters.setCourseCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            placeholder="CSE 3102"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Submission Date</label>
          <input
            type="date"
            value={submissionDate}
            onChange={(e) => setters.setSubmissionDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
          />
        </div>
      </div>

      {/* Shared name box — hidden for Assignment and Project.
          For Project, each student supplies their own project title
          in the Students section. */}
      {type !== "Assignment" && type !== "Project" && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{nameLabel}</label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setters.setReportName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              placeholder={reportPlaceholder}
            />
          </div>
        </div>
      )}
    </>
  );
}

export default CourseFields;
