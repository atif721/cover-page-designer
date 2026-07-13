type Tab = "form" | "preview";

interface MobileTabsProps {
  activeTab: Tab;
  onChange: (next: Tab) => void;
}

function MobileTabs({ activeTab, onChange }: MobileTabsProps) {
  return (
    <div className="flex border-b border-gray-200 bg-white md:hidden">
      <button
        onClick={() => onChange("form")}
        className={`flex-1 py-3 text-sm font-semibold ${
          activeTab === "form"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500"
        }`}
      >
        Form
      </button>
      <button
        onClick={() => onChange("preview")}
        className={`flex-1 py-3 text-sm font-semibold ${
          activeTab === "preview"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-500"
        }`}
      >
        Preview
      </button>
    </div>
  );
}

export default MobileTabs;
