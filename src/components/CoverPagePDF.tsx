import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import deptLogo from "@/assets/dept.png";
import versityLogo from "@/assets/versity.png";
import { formatDateForDisplay } from "@/utils/formatDate";
import { renderWithSuffixPDF } from "@/utils/AddSuffix";
import "@/utils/registerFonts";

const s = StyleSheet.create({
  page: { padding: 30, fontFamily: "Roboto Condensed", fontWeight: 400 },
  outerBorder: {
    border: "1.5pt solid black",
    borderRadius: 12,
    flex: 1,
    padding: 6,
    position: "relative",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 5,
  },
  logo: { width: 72, height: 72, objectFit: "contain" },
  headerCenter: { flex: 1, alignItems: "center", paddingHorizontal: 12 },
  uniName: {
    fontSize: 26,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    marginBottom: 4,
  },
  deptName: { fontSize: 17, fontFamily: "Roboto Condensed", fontWeight: 700 },
  centeredBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 28,
    alignSelf: "center",
    marginBottom: 24,
  },
  boxText: { fontSize: 16, fontFamily: "Roboto Condensed", fontWeight: 700 },
  detailBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    marginBottom: 6,
    fontSize: 16,
    fontFamily: "Roboto Condensed",
  },
  row2: {
    flexDirection: "row",
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "Roboto Condensed",
  },
  labelWide: { width: 110, fontSize: 14 },
  labelNarrow: { width: 60, fontSize: 14 },
  colon: { marginHorizontal: 4, fontSize: 14 },
  value: {
    fontSize: 14,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    textTransform: "uppercase",
    flex: 1,
  },
  valuePlain: {
    fontSize: 14,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    flex: 1,
  },
  experimentBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    marginBottom: 24,
    minHeight: 90,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  experimentLabel: { fontSize: 14, marginBottom: 4 },
  experimentName: {
    fontSize: 14,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    textTransform: "capitalize",
  },
  splitBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    flexDirection: "row",
    marginBottom: 24,
    height: 200,
    position: "relative",
  },
  splitDivider: {
    position: "absolute",
    top: 25,
    left: -16,
    right: -16,
    height: 1.5,
    backgroundColor: "black",
    marginHorizontal: 16,
  },
  splitLeft: {
    width: "50%",
    borderRight: "1.5pt solid black",
    padding: 8,
    paddingRight: 4,
  },
  splitRight: { width: "50%", padding: 8, paddingLeft: 4 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: 25,
  },
  teacherBlock: { marginBottom: 20 },
  teacherName: {
    fontSize: 13,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    textTransform: "uppercase",
    flex: 1,
  },
  teacherDesignation: {
    fontSize: 12,
    fontFamily: "Roboto Condensed",
    fontWeight: 700,
    flex: 1,
  },
  signature: {
    position: "absolute",
    bottom: 24,
    right: 24,
    alignItems: "center",
  },
  signatureLine: {
    borderTop: "1.5pt solid black",
    width: 180,
    paddingTop: 6,
  },
  signatureText: { fontSize: 12, textAlign: "center" },
});
export type NameLabel =
  "Experiment Name" | "Report Title" | "Project Title" | "";

interface Teacher {
  name: string;
  designation: string;
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

export function CoverPage(props: Props) {
  const {
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
  } = props;

  return (
    <Page size="A4" style={s.page}>
      <View style={s.outerBorder}>
        {/* Header */}
        <View style={s.header}>
          <Image style={s.logo} src={deptLogo} />
          <View style={s.headerCenter}>
            <Text style={s.uniName}>Varendra University</Text>
            <Text style={s.deptName}>
              Department of Computer Science and Engineering
            </Text>
          </View>
          <Image style={s.logo} src={versityLogo} />
        </View>

        {/* Report No */}
        <View style={s.centeredBox}>
          <Text style={s.boxText}>
            {type} No- {reportNo}
          </Text>
        </View>

        {/* Course Details */}
        <View style={s.detailBox}>
          {[
            ["Course Code", courseCode, true],
            ["Course Title", courseTitle, true],
            ["Submission Date", formatDateForDisplay(submissionDate), false],
          ].map(([label, val, upper]) => (
            <View style={s.row} key={label as string}>
              <Text style={s.labelWide}>{label as string}</Text>
              <Text style={s.colon}>:</Text>
              <Text style={upper ? s.value : s.valuePlain}>
                {val as string}
              </Text>
            </View>
          ))}
        </View>

        {/* Experiment / Report / Project Name — hidden when nameLabel is empty (e.g. Assignment).
            For Project type, nameLabel is hidden too because each student has a per-student project title. */}
        {nameLabel && type !== "Project" && (
          <View style={s.experimentBox}>
            <Text style={s.experimentLabel}>{nameLabel}:</Text>
            <Text style={s.experimentName}>{reportName}</Text>
          </View>
        )}

        {/* Per-student Project Title — only for Project type */}
        {type === "Project" && (
          <View style={s.experimentBox}>
            <Text style={s.experimentLabel}>Project Title:</Text>
            <Text style={s.experimentName}>{projectTitle || "—"}</Text>
          </View>
        )}

        {/* Submitted By / To */}
        <View style={s.splitBox}>
          <View style={s.splitDivider} />
          {/* Submitted By */}
          <View style={s.splitLeft}>
            <Text style={s.sectionTitle}>Submitted By</Text>
            <View style={s.row2}>
              <Text style={s.labelNarrow}>Name</Text>
              <Text style={s.colon}>:</Text>
              <Text style={s.value}>{studentName}</Text>
            </View>
            <View style={s.row2}>
              <Text style={s.labelNarrow}>Student ID</Text>
              <Text style={s.colon}>:</Text>
              <Text style={s.valuePlain}>{studentId}</Text>
            </View>
            <View style={s.row2}>
              <Text style={s.labelNarrow}>Section</Text>
              <Text style={s.colon}>:</Text>
              <Text style={s.value}>{section}</Text>
            </View>
            <View style={s.row2}>
              <Text style={s.labelNarrow}>Semester</Text>
              <Text style={s.colon}>:</Text>
              <Text style={s.valuePlain}>
                {renderWithSuffixPDF(Number(semester))}
              </Text>
            </View>
            <View style={s.row2}>
              <Text style={s.labelNarrow}>Batch</Text>
              <Text style={s.colon}>:</Text>
              <Text style={s.valuePlain}>
                {renderWithSuffixPDF(Number(batch))}
              </Text>
            </View>
          </View>

          {/* Submitted To */}
          <View style={s.splitRight}>
            <Text style={s.sectionTitle}>Submitted To</Text>
            {teachers.map((t, i) => (
              <View key={i} style={s.teacherBlock}>
                <View style={s.row}>
                  <Text style={{ width: 18, fontSize: 12 }}>{i + 1}.</Text>
                  <Text style={{ width: 55, fontSize: 12, paddingRight: 5 }}>
                    Name
                  </Text>
                  <Text style={s.colon}>:</Text>
                  <Text style={s.teacherName}>{t.name}</Text>
                </View>
                <View style={s.row}>
                  <Text style={{ width: 18, fontSize: 11 }}> </Text>
                  <Text style={{ width: 55, fontSize: 11 }}>Designation</Text>
                  <Text style={s.colon}>:</Text>
                  <Text style={s.teacherDesignation}>{t.designation}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Signature */}
        <View style={s.signature} fixed>
          <View style={s.signatureLine}>
            <Text style={s.signatureText}>Signature of Teacher</Text>
          </View>
        </View>
      </View>
    </Page>
  );
}
