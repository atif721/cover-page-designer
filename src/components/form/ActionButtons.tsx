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
    <div className="space-y-2 mt-6">
      <button
        onClick={onGenerate}
        className="w-full py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition">
        Generate PDF ({studentCount} page{studentCount === 1 ? "" : "s"})
      </button>

      {pdfUrl && (
        <button
          onClick={onDownload}
          className="w-full py-3 bg-green-600 text-white font-bold rounded-md hover:bg-green-700 transition shadow-lg">
          ⬇ Download
        </button>
      )}
    </div>
  );
}

export default ActionButtons;
