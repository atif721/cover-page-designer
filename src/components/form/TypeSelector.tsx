import { REPORT_TYPES } from "@/constants";
import type { ReportType } from "@/types";

interface TypeSelectorProps {
  type: ReportType;
  onChange: (next: ReportType) => void;
}

function TypeSelector({ type, onChange }: TypeSelectorProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {REPORT_TYPES.map((t) => (
          <label
            key={t}
            className="flex items-center gap-2 cursor-pointer bg-white px-3 py-2 rounded border border-gray-300 hover:bg-gray-100 transition text-sm">
            <input
              type="radio"
              name="type"
              checked={type === t}
              onChange={() => onChange(t)}
              className="w-4 h-4 text-blue-600"
            />
            <span>{t}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default TypeSelector;
