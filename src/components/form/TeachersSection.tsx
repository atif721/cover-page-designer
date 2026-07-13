import { DESIGNATIONS } from "@/constants";
import type { Teacher } from "@/types";

interface TeachersSectionProps {
  teachers: Teacher[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Teacher, value: string) => void;
  onRemove: (index: number) => void;
}

function TeachersSection({
  teachers,
  onAdd,
  onUpdate,
  onRemove,
}: TeachersSectionProps) {
  return (
    <div className="mt-4 border-t pt-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">Submitted To</h2>
        <button
          onClick={onAdd}
          className="rounded bg-blue-600 px-2 py-1 text-xs text-white transition hover:bg-blue-700"
        >
          + Add Teacher
        </button>
      </div>
      <div className="space-y-4">
        {teachers.map((teacher, index) => (
          <div
            key={index}
            className="group relative rounded-md border border-gray-200 bg-gray-50 p-3"
          >
            <button
              onClick={() => onRemove(index)}
              disabled={teachers.length === 1}
              className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-xs text-white opacity-0 transition group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-30"
            >
              ×
            </button>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
                  Name
                </label>
                <input
                  type="text"
                  value={teacher.name}
                  onChange={(e) => onUpdate(index, "name", e.target.value)}
                  className="w-full rounded border border-gray-300 bg-white p-1 text-sm outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-[10px] font-bold text-gray-500 uppercase">
                  Designation
                </label>
                <select
                  value={teacher.designation}
                  onChange={(e) =>
                    onUpdate(index, "designation", e.target.value)
                  }
                  className="w-full rounded border border-gray-300 bg-white p-1 text-sm outline-none"
                >
                  <option value="">Select Designation</option>
                  {DESIGNATIONS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeachersSection;
