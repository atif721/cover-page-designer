import type { ParsedStudent, Student } from "@/types";
import { BATCH } from "@/utils/batchCalculation";

interface StudentsSectionProps {
  students: Student[];
  parsedStudents: ParsedStudent[];
  isProject: boolean;
  section: string;
  semester: string;
  batch: string;
  onAdd: () => void;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
  setters: {
    setSection: (next: string) => void;
    setSemester: (next: string) => void;
    setBatch: (next: string) => void;
  };
}

function StudentsSection({
  students,
  parsedStudents,
  isProject,
  section,
  semester,
  batch,
  onAdd,
  onUpdate,
  onRemove,
  setters,
}: StudentsSectionProps) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Students</h2>
        <button
          onClick={onAdd}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white transition hover:bg-blue-700"
        >
          + Add Student
        </button>
      </div>
      <div className="space-y-3">
        {students.map((student, index) => {
          const parsed = parsedStudents[index];
          return (
            <div
              key={index}
              className="group relative rounded-md border border-gray-200 bg-gray-50 p-3"
            >
              <button
                onClick={() => onRemove(index)}
                disabled={students.length === 1}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
              >
                ×
              </button>
              <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
                {isProject
                  ? `Student ${index + 1} — Name, ID, Project is about...`
                  : `Student ${index + 1} — Name, ID`}
              </label>
              <input
                type="text"
                value={student.raw}
                onChange={(e) => onUpdate(index, e.target.value)}
                className="w-full rounded border border-gray-300 bg-white p-2 text-sm outline-none"
                placeholder={
                  isProject
                    ? "e.g. Abdullah Atif, 241311051, Smart Attendance System"
                    : "e.g. Abdullah Atif, 241311051"
                }
              />
              {student.raw && parsed && (
                <p className="mt-1 text-[11px] text-gray-500">
                  <span className="font-semibold">Name:</span>{" "}
                  {parsed.name || "—"} ·{" "}
                  <span className="font-semibold">ID:</span> {parsed.id || "—"}
                  {isProject && (
                    <>
                      {" · "}
                      <span className="font-semibold">Project:</span>{" "}
                      {parsed.projectTitle || "—"}
                    </>
                  )}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
            Section
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setters.setSection(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-2 text-sm outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
            Semester
          </label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setters.setSemester(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-2 text-sm outline-none"
            placeholder="5"
          />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
            Batch
          </label>
          <select
            value={batch}
            onChange={(e) => setters.setBatch(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white p-2 text-sm outline-none"
          >
            <option value="">Select Batch</option>
            {BATCH.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

export default StudentsSection;
