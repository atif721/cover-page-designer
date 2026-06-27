import { Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import deptLogo from "@/assets/dept.png";
import versityLogo from "@/assets/versity.png";

const s = StyleSheet.create({
  page: { padding: 30, fontFamily: "Times-Roman" },
  outerBorder: {
    border: "2pt solid black",
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
  uniName: { fontSize: 20, fontFamily: "Times-Bold", marginBottom: 4 },
  deptName: { fontSize: 13, fontFamily: "Times-Bold" },
  centeredBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 28,
    alignSelf: "center",
    marginBottom: 24,
  },
  boxText: { fontSize: 13, fontFamily: "Times-Bold" },
  detailBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  row: { flexDirection: "row", marginBottom: 6, fontSize: 12 },
  row2: { flexDirection: "row", marginBottom: 16, fontSize: 12 },
  labelWide: { width: 110, fontSize: 12 },
  labelNarrow: { width: 60, fontSize: 12 },
  colon: { marginHorizontal: 4, fontSize: 12 },
  value: { fontSize: 12, fontFamily: "Times-Bold", textTransform: "capitalize", flex: 1 },
  valuePlain: { fontSize: 12, fontFamily: "Times-Bold", flex: 1 },
  experimentBox: {
    border: "1.5pt solid black",
    borderRadius: 12,
    marginBottom: 24,
    minHeight: 90,
    padding: 10,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  experimentLabel: { fontSize: 12, marginBottom: 4 },
  experimentName: { fontSize: 12, fontFamily: "Times-Bold", textTransform: "capitalize" },
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
    fontSize: 13,
    fontFamily: "Times-Bold",
    textAlign: "center",
    marginBottom: 25,
  },
  teacherBlock: { marginBottom: 20 },
  teacherName: { fontSize: 11, fontFamily: "Times-Bold", textTransform: "capitalize", flex: 1 },
  teacherDesignation: { fontSize: 11, fontFamily: "Times-Bold", flex: 1 },
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

export type NameLabel = "Experiment Name" | "Report Title" | "Project Title" | "";

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

// A single cover-page sheet. Renders ONLY a <Page> — no <Document> wrapper.
// The caller (App.tsx) is responsible for wrapping one or more of these
// in a single <Document>. Putting a <Document> inside another <Document>
// is unsupported by @react-pdf/renderer and silently produces no output.
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
            <Text style={s.deptName}>Department of Computer Science and Engineering</Text>
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
            ["Submission Date", submissionDate, false],
          ].map(([label, val, upper]) => (
            <View style={s.row} key={label as string}>
              <Text style={s.labelWide}>{label as string}</Text>
              <Text style={s.colon}>:</Text>
              <Text style={upper ? s.value : s.valuePlain}>{val as string}</Text>
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
            {[
              ["Name", studentName, true],
              ["Student ID", studentId, false],
              ["Section", section, true],
              ["Semester", semester, false],
              ["Batch", batch, true],
            ].map(([label, val, upper]) => (
              <View style={s.row2} key={label as string}>
                <Text style={s.labelNarrow}>{label as string}</Text>
                <Text style={s.colon}>:</Text>
                <Text style={upper ? s.value : s.valuePlain}>{val as string}</Text>
              </View>
            ))}
          </View>

          {/* Submitted To */}
          <View style={s.splitRight}>
            <Text style={s.sectionTitle}>Submitted To</Text>
            {teachers.map((t, i) => (
              <View key={i} style={s.teacherBlock}>
                <View style={s.row}>
                  <Text style={{ width: 18, fontSize: 11 }}>{i + 1}.</Text>
                  <Text style={{ width: 55, fontSize: 11, paddingRight: 5 }}>Name</Text>
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
