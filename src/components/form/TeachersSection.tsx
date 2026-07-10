import type { Teacher } from "@/types";

interface TeachersSectionProps {
  teachers: Teacher[];
  onAdd: () => void;
  onUpdate: (index: number, field: keyof Teacher, value: string) => void;
  onRemove: (index: number) => void;
}

function TeachersSection({ teachers, onAdd, onUpdate, onRemove }: TeachersSectionProps) {
  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-gray-800">Submitted To</h2>
        <button
          onClick={onAdd}
          className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition">
          + Add Teacher
        </button>
      </div>
      <div className="space-y-4">
        {teachers.map((teacher, index) => (
          <div
            key={index}
            className="p-3 bg-gray-50 border border-gray-200 rounded-md relative group">
            <button
              onClick={() => onRemove(index)}
              disabled={teachers.length === 1}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs disabled:opacity-30 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100 transition">
              ×
            </button>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={teacher.name}
                  onChange={(e) => onUpdate(index, "name", e.target.value)}
                  className="w-full p-1 text-sm border border-gray-300 rounded outline-none bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase text-gray-500 mb-1">
                  Designation
                </label>
                <input
                  type="text"
                  value={teacher.designation}
                  onChange={(e) => onUpdate(index, "designation", e.target.value)}
                  className="w-full p-2 text-sm border border-gray-300 rounded outline-none bg-white"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeachersSection;
