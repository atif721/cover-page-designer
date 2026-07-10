import type { ParsedStudent, Student } from "@/types";

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
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Students</h2>
        <button
          onClick={onAdd}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
          + Add Student
        </button>
      </div>
      <div className="space-y-3">
        {students.map((student, index) => {
          const parsed = parsedStudents[index];
          return (
            <div
              key={index}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md relative group">
              <button
                onClick={() => onRemove(index)}
                disabled={students.length === 1}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition">
                ×
              </button>
              <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                {isProject
                  ? `Student ${index + 1} — Name, ID, Project is about...`
                  : `Student ${index + 1} — Name, ID`}
              </label>
              <input
                type="text"
                value={student.raw}
                onChange={(e) => onUpdate(index, e.target.value)}
                className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                placeholder={
                  isProject
                    ? "e.g. Abdullah Atif, 241311051, Smart Attendance System"
                    : "e.g. Abdullah Atif, 241311051"
                }
              />
              {student.raw && parsed && (
                <p className="text-[11px] text-gray-500 mt-1">
                  <span className="font-semibold">Name:</span> {parsed.name || "—"} ·{" "}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
            Section
          </label>
          <input
            type="text"
            value={section}
            onChange={(e) => setters.setSection(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
            Semester
          </label>
          <input
            type="text"
            value={semester}
            onChange={(e) => setters.setSemester(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
            placeholder="5th Semester"
          />
        </div>
        <div>
          <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
            Batch
          </label>
          <input
            type="text"
            value={batch}
            onChange={(e) => setters.setBatch(e.target.value)}
            className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
            placeholder="34th"
          />
        </div>
      </div>
    </div>
  );
}

export default StudentsSection;
