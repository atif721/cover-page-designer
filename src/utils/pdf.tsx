import { pdf, Document } from "@react-pdf/renderer";
import { CoverPage } from "@/components/CoverPagePDF";
import type { NameLabel, ParsedStudent, ReportType, Teacher } from "@/types";

export interface CoverPageBlobInput {
  type: ReportType;
  nameLabel: NameLabel;
  reportName: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  parsedStudents: ParsedStudent[];
  section: string;
  semester: string;
  batch: string;
  teachers: Teacher[];
}

export async function buildCoverPageBlob(
  input: CoverPageBlobInput,
): Promise<Blob> {
  return pdf(
    <Document>
      {input.parsedStudents.map((s, i) => (
        <CoverPage
          key={i}
          type={input.type}
          nameLabel={input.nameLabel}
          reportName={input.reportName}
          reportNo={input.reportNo}
          courseCode={input.courseCode}
          courseTitle={input.courseTitle}
          submissionDate={input.submissionDate}
          studentName={s.name}
          studentId={s.id}
          section={input.section}
          semester={input.semester}
          batch={input.batch}
          teachers={input.teachers}
          projectTitle={s.projectTitle}
        />
      ))}
    </Document>,
  ).toBlob();
}
