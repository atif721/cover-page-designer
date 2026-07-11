import deptLogo from "@/assets/dept.png";
import versityLogo from "@/assets/versity.png";

export type NameLabel = "Experiment Name" | "Report Title" | "Project Title" | "";

interface Teacher {
  name: string;
  designation: string;
}

interface Student {
  raw: string;
}

interface Props {
  type: string;
  nameLabel: NameLabel;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  studentName: string;
  studentId: string;
  section: string;
  semester: string;
  batch: string;
  teachers: Teacher[];
  projectTitle?: string;
}

interface PreviewCardProps extends Props {
  studentName: string;
  studentId: string;
  projectTitle: string;
}

function PreviewCard({
  type,
  nameLabel,
  reportName,
  reportNo,
  courseCode,
  courseTitle,
  submissionDate,
  studentName,
  studentId,
  section,
  semester,
  batch,
  teachers,
  projectTitle = "",
}: PreviewCardProps) {
  return (
    <div className="a4-page text-black font-serif bg-white shadow" style={{ width: "210mm", height: "297mm" }}>
      <div className="border-3 border-black rounded-2xl h-full w-full p-3 box-border relative">
        {/* Header Section */}
        <div className="flex justify-between items-start mb-4">
          <img src={deptLogo} alt="Dept Logo" className="w-24 h-24 object-contain" />
          <div className="text-center flex-1 px-4">
            <h1 className="text-3xl font-bold mb-1">Varendra University</h1>
            <p className="text-xl font-bold">Department of Computer Science and Engineering</p>
          </div>
          <img src={versityLogo} alt="University Logo" className="w-24 h-24 object-contain" />
        </div>

        {/* Report Number Box */}
        <div className="flex justify-center mb-8">
          <div className="border-2 border-black rounded-2xl px-10 py-2 text-xl font-semibold text-center">
            {type} No- {reportNo}
          </div>
        </div>

        {/* Course Details Box */}
        <div className="border-2 border-black rounded-2xl p-6 mb-10 space-y-4 text-lg">
          <div className="flex">
            <span className="w-40 font-medium">Course Code</span>
            <span className="mx-2">:</span>
            <span className="font-bold uppercase">{courseCode}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-medium">Course Title</span>
            <span className="mx-2">:</span>
            <span className="font-bold capitalize">{courseTitle}</span>
          </div>
          <div className="flex">
            <span className="w-40 font-medium">Submission Date</span>
            <span className="mx-2">:</span>
            <span className="font-bold">{submissionDate}</span>
          </div>
        </div>

        {/* Experiment/Report/Project Name Box — hidden when nameLabel is empty (e.g. Assignment).
            Hidden for Project type too — per-student project title renders below. */}
        {nameLabel && type !== "Project" && (
          <div className="border-2 border-black rounded-2xl mb-10 min-h-32 text-center flex flex-col justify-self-center">
            <p className="text-lg mt-2">{nameLabel}:</p>
            <p className="text-lg font-bold capitalize">{reportName}</p>
          </div>
        )}

        {/* Per-student Project Title — only for Project type */}
        {type === "Project" && (
          <div className="border-2 border-black rounded-2xl mb-10 min-h-32 text-center flex flex-col justify-center">
            <p className="text-lg mt-2">Project Title:</p>
            <p className="text-lg font-bold capitalize">{projectTitle || "—"}</p>
          </div>
        )}

        {/* Submitted By / To Box */}
        <div className="relative border-2 border-black rounded-2xl flex h-75 mb-10">
          <div className="absolute top-5" style={{ height: 2, background: "#000", width: "100%", margin: "16px 0" }} />
          {/* Submitted By */}
          <div className="w-100 border-r-2 border-black p-2 pr-0">
            <h3 className="text-center text-xl font-bold mb-6">Submitted By</h3>
            <div className="space-y-3 text-lg">
              <div className="flex">
                <span className="w-20">Name</span>
                <span className="mx-1">:</span>
                <span className="font-bold capitalize">{studentName}</span>
              </div>
              <div className="flex">
                <span className="w-20">Student ID</span>
                <span className="mx-1">:</span>
                <span className="font-bold">{studentId}</span>
              </div>
              <div className="flex">
                <span className="w-20">Section</span>
                <span className="mx-1">:</span>
                <span className="font-bold uppercase">{section}</span>
              </div>
              <div className="flex">
                <span className="w-20">Semester</span>
                <span className="mx-1">:</span>
                <span className="font-bold">{semester}</span>
              </div>
              <div className="flex">
                <span className="w-20">Batch</span>
                <span className="mx-1">:</span>
                <span className="font-bold">{batch}</span>
              </div>
            </div>
          </div>

          {/* Submitted To */}
          <div className="w-1/2 p-2 pl-1">
            <h3 className="text-center text-xl font-bold mb-6">Submitted To</h3>
            <div className="space-y-8 text-md">
              {teachers.map((teacher, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex">
                    <span className="w-7">{index + 1}.</span>
                    <span className="w-21">Name</span>
                    <span className="mx-2">:</span>
                    <span className="font-bold capitalize">{teacher.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-3"></span>
                    <span className="w-19">Designation</span>
                    <span className="mx-1">:</span>
                    <span className="font-bold">{teacher.designation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Signature Footer */}
      <div className="absolute bottom-12 right-12 text-center">
        <div className="w-64 border-t-2 border-black pt-2">
          <p className="text-lg font-medium">Signature of Teacher</p>
        </div>
      </div>
    </div>
  );
}

function parseStudent(raw: string): { name: string; id: string; projectTitle: string } {
  const parts = raw.split(",").map((s) => s.trim());
  const [namePart = "", idPart = "", ...rest] = parts;
  return { name: namePart, id: idPart, projectTitle: rest.join(", ") };
}

const PDFPreview = ({
  type,
  nameLabel,
  reportName,
  reportNo,
  courseCode,
  courseTitle,
  submissionDate,
  section,
  semester,
  batch,
  teachers,
  students,
}: Props & { students: Student[] }) => {
  const parsed = students.map((s) => ({ ...parseStudent(s.raw), raw: s.raw }));

  return (
    <div className="flex-1 flex flex-col items-start justify-start gap-6 p-2 sm:p-6 md:p-10 overflow-auto bg-gray-200">
      {parsed.length === 0 ?
        <p className="text-gray-500 text-sm">Add a student to see the preview.</p>
      : parsed.map((s, i) => (
          <div key={i} className="relative">
            <span className="absolute -top-5 left-2 text-xs font-semibold text-gray-600">
              Page {i + 1} of {parsed.length}
            </span>
            <PreviewCard
              type={type}
              nameLabel={nameLabel}
              reportName={reportName}
              reportNo={reportNo}
              courseCode={courseCode}
              courseTitle={courseTitle}
              submissionDate={submissionDate}
              studentName={s.name}
              studentId={s.id}
              section={section}
              semester={semester}
              batch={batch}
              teachers={teachers}
              projectTitle={s.projectTitle}
            />
          </div>
        ))
      }
    </div>
  );
};

export default PDFPreview;
