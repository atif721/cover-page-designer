import { Document, Page, View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import deptLogo from "./assets/dept.png";
import versityLogo from "./assets/versity.png";

const s = StyleSheet.create({
  page: { padding: 30, fontFamily: "Times-Roman", border: "4pt solid black" },
  outerBorder: { border: "4pt solid black", flex: 1, padding: 24, position: "relative" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  logo: { width: 64, height: 64 },
  headerCenter: { flex: 1, alignItems: "center", paddingHorizontal: 8 },
  uniName: { fontSize: 18, fontFamily: "Times-Bold", marginBottom: 4 },
  deptName: { fontSize: 12 },
  centeredBox: { borderWidth: 2, borderColor: "black", padding: "8pt 24pt", alignSelf: "center", marginBottom: 20 },
  boxText: { fontSize: 13, fontFamily: "Times-Bold" },
  detailBox: { borderWidth: 2, borderColor: "black", padding: 12, marginBottom: 16 },
  row: { flexDirection: "row", marginBottom: 6 },
  label: { width: 110, fontSize: 11 },
  colon: { marginHorizontal: 4, fontSize: 11 },
  value: { fontSize: 11, fontFamily: "Times-Bold", textTransform: "uppercase" },
  splitBox: { borderWidth: 2, borderColor: "black", flexDirection: "row", marginBottom: 16, minHeight: 160 },
  splitLeft: { flex: 1, borderRightWidth: 2, borderColor: "black", padding: 12 },
  splitRight: { flex: 1, padding: 12 },
  sectionTitle: {
    fontSize: 13,
    fontFamily: "Times-Bold",
    textDecoration: "underline",
    textAlign: "center",
    marginBottom: 12,
  },
  teacherBlock: { marginBottom: 10 },
  signature: { position: "absolute", bottom: 24, right: 24, alignItems: "center" },
  signatureLine: { borderTopWidth: 1, borderColor: "black", width: 160, paddingTop: 4 },
  signatureText: { fontSize: 11, textAlign: "center" },
  experimentBox: {
    borderWidth: 2,
    borderColor: "black",
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
    minHeight: 60,
    justifyContent: "center",
  },
});

interface Teacher {
  name: string;
  designation: string;
}
interface Props {
  type: string;
  reportNo: string;
  courseCode: string;
  courseTitle: string;
  submissionDate: string;
  experimentName: string;
  studentName: string;
  studentId: string;
  section: string;
  semester: string;
  batch: string;
  teachers: Teacher[];
}

export function CoverPagePDF(props: Props) {
  const {
    type,
    reportNo,
    courseCode,
    courseTitle,
    submissionDate,
    experimentName,
    studentName,
    studentId,
    section,
    semester,
    batch,
    teachers,
  } = props;

  return (
    <Document>
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
              ["Course Code", courseCode],
              ["Course Title", courseTitle],
              ["Submission Date", submissionDate],
            ].map(([label, val]) => (
              <View style={s.row} key={label}>
                <Text style={s.label}>{label}</Text>
                <Text style={s.colon}>:</Text>
                <Text style={s.value}>{val}</Text>
              </View>
            ))}
          </View>

          {/* Experiment Name */}
          <View style={s.experimentBox}>
            <Text style={{ fontSize: 12, fontFamily: "Times-Bold", marginBottom: 4 }}>
              {type === "Lab Report" ? "Experiment Name:" : "Assignment Name:"}
            </Text>
            <Text style={{ fontSize: 13, fontFamily: "Times-Bold", textTransform: "uppercase" }}>{experimentName}</Text>
          </View>

          {/* Submitted By / To */}
          <View style={s.splitBox}>
            <View style={s.splitLeft}>
              <Text style={s.sectionTitle}>Submitted By</Text>
              {[
                ["Name", studentName],
                ["Student ID", studentId],
                ["Section", section],
                ["Semester", semester],
                ["Batch", batch],
              ].map(([label, val]) => (
                <View style={s.row} key={label}>
                  <Text style={[s.label, { width: 70 }]}>{label}</Text>
                  <Text style={s.colon}>:</Text>
                  <Text style={s.value}>{val}</Text>
                </View>
              ))}
            </View>
            <View style={s.splitRight}>
              <Text style={s.sectionTitle}>Submitted To</Text>
              {teachers.map((t, i) => (
                <View key={i} style={s.teacherBlock}>
                  <View style={s.row}>
                    <Text style={{ width: 16, fontSize: 11 }}>{i + 1}.</Text>
                    <Text style={[s.label, { width: 60 }]}>Name</Text>
                    <Text style={s.colon}>:</Text>
                    <Text style={s.value}>{t.name}</Text>
                  </View>
                  <View style={s.row}>
                    <Text style={{ width: 16 }} />
                    <Text style={[s.label, { width: 60, fontSize: 11 }]}>Designation</Text>
                    <Text style={s.colon}>:</Text>
                    <Text style={{ fontSize: 11 }}>{t.designation}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* Signature */}
          <View style={s.signature}>
            <View style={s.signatureLine}>
              <Text style={s.signatureText}>Signature of Teacher</Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );
}
