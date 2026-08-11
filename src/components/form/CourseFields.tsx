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
  showTitleBox: boolean;
  onToggleTitleBox: (next: boolean) => void;
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
  showTitleBox,
  onToggleTitleBox,
  setters,
}: CourseFieldsProps) {
  const isProject = type === "Project";

  return (
    <>
      {/* Report/Assignment/Project No */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <label className="mb-1 block text-sm font-medium text-gray-700">
          {type} No.
        </label>
        <input
          type="text"
          value={reportNo}
          onChange={(e) => setters.setReportNo(e.target.value)}
          className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="e.g. 01"
        />
      </div>

      {/* Course Details */}
      <div className="grid grid-cols-1 gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Course Title
          </label>
          <input
            type="text"
            value={courseTitle}
            onChange={(e) => setters.setCourseTitle(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Computer Graphics Lab"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Course Code
          </label>
          <input
            type="text"
            value={courseCode}
            onChange={(e) => setters.setCourseCode(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="CSE 3102"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Submission Date
          </label>
          <input
            type="date"
            value={submissionDate}
            onChange={(e) => setters.setSubmissionDate(e.target.value)}
            className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Shared name box — always hidden for Project (each student supplies
          their own project title in the Students section). For Experiment,
          Lab Report, and Assignment it's shown by default but removable. */}
      {!isProject && showTitleBox && (
        <div className="group relative space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <button
            onClick={() => onToggleTitleBox(false)}
            className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100"
            title={`Remove ${nameLabel} box`}
          >
            ×
          </button>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              {nameLabel}
            </label>
            <input
              type="text"
              value={reportName}
              onChange={(e) => setters.setReportName(e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white p-2 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={reportPlaceholder}
            />
          </div>
        </div>
      )}

      {!isProject && !showTitleBox && (
        <button
          onClick={() => onToggleTitleBox(true)}
          className="w-full rounded-lg border border-dashed border-gray-300 bg-gray-50 p-3 text-sm text-gray-500 transition hover:border-blue-400 hover:text-blue-600"
        >
          + Add {nameLabel}
        </button>
      )}
    </>
  );
}

export default CourseFields;
