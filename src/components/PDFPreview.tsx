import deptLogo from "@/assets/dept.png";
import versityLogo from "@/assets/versity.png";
import { renderWithSuffix } from "@/utils/AddSuffix";

export type NameLabel =
  | "Experiment Name"
  | "Report Title"
  | "Project Title"
  | "Assignment Title"
  | "";

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
    <div
      className="a4-page bg-white font-serif text-black shadow"
      style={{ width: "210mm", height: "297mm" }}
    >
      <div className="relative box-border h-full w-full rounded-2xl border-3 border-black p-3">
        {/* Header Section */}
        <div className="mb-4 flex items-start justify-between">
          <img
            src={deptLogo}
            alt="Dept Logo"
            className="h-24 w-24 object-contain"
          />
          <div className="flex-1 px-4 text-center">
            <h1 className="mb-1 text-3xl font-bold">Varendra University</h1>
            <p className="text-xl font-bold">
              Department of Computer Science and Engineering
            </p>
          </div>
          <img
            src={versityLogo}
            alt="University Logo"
            className="h-24 w-24 object-contain"
          />
        </div>

        {/* Report Number Box */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-2xl border-2 border-black px-10 py-2 text-center text-xl font-semibold">
            {type} No- {reportNo}
          </div>
        </div>

        {/* Course Details Box */}
        <div className="mb-10 space-y-4 rounded-2xl border-2 border-black p-6 text-lg">
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
          <div className="mb-10 flex min-h-32 w-full flex-col justify-self-center rounded-2xl border-2 border-black text-center">
            <p className="mt-2 text-lg">{nameLabel}:</p>
            <p className="text-lg font-bold capitalize">{reportName}</p>
          </div>
        )}

        {/* Per-student Project Title — only for Project type */}
        {type === "Project" && (
          <div className="mb-10 flex min-h-32 flex-col justify-center rounded-2xl border-2 border-black text-center">
            <p className="mt-2 text-lg">Project Title:</p>
            <p className="text-lg font-bold capitalize">
              {projectTitle || "—"}
            </p>
          </div>
        )}

        {/* Submitted By / To Box */}
        <div className="relative mb-10 flex h-75 rounded-2xl border-2 border-black">
          <div
            className="absolute top-5"
            style={{
              height: 2,
              background: "#000",
              width: "100%",
              margin: "16px 0",
            }}
          />
          {/* Submitted By */}
          <div className="w-100 border-r-2 border-black p-2 pr-0">
            <h3 className="mb-6 text-center text-xl font-bold">Submitted By</h3>
            <div className="space-y-3 text-lg">
              <div className="flex">
                <span className="w-20">Name</span>
                <span className="mx-1">:</span>
                <span className="font-bold uppercase">{studentName}</span>
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
                <span className="font-bold">
                  {renderWithSuffix(Number(semester))}
                </span>
              </div>
              <div className="flex">
                <span className="w-20">Batch</span>
                <span className="mx-1">:</span>
                <span className="font-bold">
                  {renderWithSuffix(Number(batch))}
                </span>
              </div>
            </div>
          </div>

          {/* Submitted To */}
          <div className="w-1/2 p-2 pl-1">
            <h3 className="mb-6 text-center text-xl font-bold">Submitted To</h3>
            <div className="text-md space-y-8">
              {teachers.map((teacher, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex">
                    <span className="w-7">{index + 1}.</span>
                    <span className="w-19">Name</span>
                    <span className="mr-2">:</span>
                    <span className="font-bold uppercase">{teacher.name}</span>
                  </div>
                  <div className="flex">
                    <span className="w-3"></span>
                    <span className="w-23">Designation</span>
                    <span className="mr-1">:</span>
                    <span className="font-bold">
                      {teacher.designation}
                      <br />
                      Dept. of CSE, VU
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Signature Footer */}
      <div className="absolute right-12 bottom-12 text-center">
        <div className="w-64 border-t-2 border-black pt-2">
          <p className="text-lg font-medium">Signature of Teacher</p>
        </div>
      </div>
    </div>
  );
}

function parseStudent(raw: string): {
  name: string;
  id: string;
  projectTitle: string;
} {
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
    <div className="flex flex-1 flex-col items-start justify-start gap-6 overflow-auto bg-gray-200 p-2 sm:p-6 md:p-10">
      {parsed.length === 0 ? (
        <p className="text-sm text-gray-500">
          Add a student to see the preview.
        </p>
      ) : (
        parsed.map((s, i) => (
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
      )}
    </div>
  );
};

export default PDFPreview;
