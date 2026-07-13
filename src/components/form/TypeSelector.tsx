import { REPORT_TYPES } from "@/constants";
import type { ReportType } from "@/types";

interface TypeSelectorProps {
  type: ReportType;
  onChange: (next: ReportType) => void;
}

function TypeSelector({ type, onChange }: TypeSelectorProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
      <label className="mb-2 block text-sm font-medium text-gray-700">
        Type
      </label>
      <div className="flex flex-wrap gap-2 md:gap-4">
        {REPORT_TYPES.map((t) => (
          <label
            key={t}
            className="flex cursor-pointer items-center gap-2 rounded border border-gray-300 bg-white px-3 py-2 text-sm transition hover:bg-gray-100"
          >
            <input
              type="radio"
              name="type"
              checked={type === t}
              onChange={() => onChange(t)}
              className="h-4 w-4 text-blue-600"
            />
            <span>{t}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

export default TypeSelector;
