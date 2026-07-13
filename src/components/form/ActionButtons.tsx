interface ActionButtonsProps {
  studentCount: number;
  pdfUrl: string | null;
  onGenerate: () => void;
  onDownload: () => void;
}

function ActionButtons({
  studentCount,
  pdfUrl,
  onGenerate,
  onDownload,
}: ActionButtonsProps) {
  return (
    <div className="mt-6 space-y-2">
      <button
        onClick={onGenerate}
        className="w-full rounded-md bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-700"
      >
        Generate PDF ({studentCount} page{studentCount === 1 ? "" : "s"})
      </button>

      {pdfUrl && (
        <button
          onClick={onDownload}
          className="w-full rounded-md bg-green-600 py-3 font-bold text-white shadow-lg transition hover:bg-green-700"
        >
          ⬇ Download
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
