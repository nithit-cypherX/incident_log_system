// File: src/features/incident/components/IncidentReportPDF.tsx
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { Incident } from "../../../types/common.types";
import { formatDate } from "../../../lib/utils";

// 1. Define Styles (NO BORDER SHORTHANDS to prevent crashes)
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Helvetica",
    backgroundColor: "#FFFFFF",
    color: "#212529",
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingBottom: 10,
    // Explicit Bottom Border
    borderBottomWidth: 2,
    borderBottomColor: "#111111",
    borderBottomStyle: "solid",
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DC3545",
  },
  reportTitle: {
    fontSize: 18,
    color: "#333333",
    marginTop: 5,
  },
  metadata: {
    fontSize: 10,
    color: "#666666",
    marginTop: 5,
  },
  // --- Sections ---
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333333",
    backgroundColor: "#F3F4F6",
    padding: 5,
  },
  row: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    width: 100,
    fontSize: 10,
    fontWeight: "bold",
    color: "#555555",
  },
  value: {
    flex: 1,
    fontSize: 10,
    color: "#000000",
  },
  // --- TABLE (Explicitly define every side) ---
  table: {
    display: "flex",
    width: "auto",
    marginTop: 5,
    // Outer Border: Top, Right, Bottom, Left
    borderTopWidth: 1,
    borderTopColor: "#bfbfbf",
    borderTopStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#bfbfbf",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "#bfbfbf",
    borderLeftStyle: "solid",
  },
  tableRow: {
    flexDirection: "row",
    minHeight: 20,
    alignItems: "center",
    // Row Divider: Bottom only
    borderBottomWidth: 1,
    borderBottomColor: "#bfbfbf",
    borderBottomStyle: "solid",
  },
  tableRowLast: {
    flexDirection: "row",
    minHeight: 20,
    alignItems: "center",
    // No bottom border for last row
    borderBottomWidth: 0,
  },
  // --- Header Cells ---
  tableColHeader: {
    width: "33%",
    backgroundColor: "#E5E7EB",
    padding: 5,
    // Divider: Left only
    borderLeftWidth: 1,
    borderLeftColor: "#bfbfbf",
    borderLeftStyle: "solid",
  },
  tableColHeaderFirst: {
    width: "33%",
    backgroundColor: "#E5E7EB",
    padding: 5,
    // First column has no left border (uses table border)
    borderLeftWidth: 0,
  },
  // --- Data Cells ---
  tableCol: {
    width: "33%",
    padding: 5,
    // Divider: Left only
    borderLeftWidth: 1,
    borderLeftColor: "#bfbfbf",
    borderLeftStyle: "solid",
  },
  tableColFirst: {
    width: "33%",
    padding: 5,
    // First column has no left border
    borderLeftWidth: 0,
  },
  tableCellHeader: {
    fontSize: 10,
    fontWeight: "bold",
  },
  tableCell: {
    fontSize: 10,
  },
  // --- IMAGES ---
  imageSection: {
    marginTop: 10,
  },
  imageContainer: {
    marginBottom: 15,
    alignItems: "center",
  },
  image: {
    width: 400,
    height: 300,
    objectFit: "contain",
    // Image Border: All sides explicit
    borderTopWidth: 1,
    borderTopColor: "#dddddd",
    borderTopStyle: "solid",
    borderRightWidth: 1,
    borderRightColor: "#dddddd",
    borderRightStyle: "solid",
    borderBottomWidth: 1,
    borderBottomColor: "#dddddd",
    borderBottomStyle: "solid",
    borderLeftWidth: 1,
    borderLeftColor: "#dddddd",
    borderLeftStyle: "solid",
  },
  imageCaption: {
    fontSize: 9,
    color: "#666666",
    marginTop: 5,
    fontStyle: "italic",
  },
  // --- Footer ---
  footer: {
    position: "absolute",
    bottom: 30,
    left: 40,
    right: 40,
    fontSize: 9,
    textAlign: "center",
    color: "#999999",
    paddingTop: 10,
    // Footer Border: Top only
    borderTopWidth: 1,
    borderTopColor: "#bfbfbf",
    borderTopStyle: "solid",
  },
});

type Props = {
  incident: Incident | null;
};

const getImageUrl = (path: string) => {
  return `http://localhost:3000/${path}`;
};

const IncidentReportPDF = ({ incident }: Props) => {
  // Guard Clause to prevent crash on empty data
  if (!incident) {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <Text>Loading data...</Text>
        </Page>
      </Document>
    );
  }

  const incidentImages = incident.assigned_attachments.filter((att) =>
    att.mime_type.startsWith("image/")
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandTitle}>FirePersona 5</Text>
            <Text style={styles.reportTitle}>Incident Report</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.metadata}>Code: {incident.incident_code}</Text>
            <Text style={styles.metadata}>
              Generated: {new Date().toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* OVERVIEW */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Title:</Text>
            <Text style={styles.value}>{incident.title}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Type:</Text>
            <Text style={styles.value}>
              {incident.incident_type.toUpperCase()}
            </Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{incident.status.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Priority:</Text>
            <Text style={styles.value}>{incident.priority.toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Reported At:</Text>
            <Text style={styles.value}>{formatDate(incident.reported_at)}</Text>
          </View>
        </View>

        {/* DETAILS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location & Details</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Address:</Text>
            <Text style={styles.value}>
              {incident.address}, {incident.city}, {incident.state}{" "}
              {incident.zip_code}
            </Text>
          </View>
          {incident.latitude && incident.longitude && (
            <View style={styles.row}>
              <Text style={styles.label}>Coordinates:</Text>
              <Text style={styles.value}>
                {incident.latitude}, {incident.longitude}
              </Text>
            </View>
          )}
          <View style={{ marginTop: 8 }}>
            <Text style={styles.label}>Description:</Text>
            <Text style={{ ...styles.value, marginTop: 4, lineHeight: 1.4 }}>
              {incident.description || "No description provided."}
            </Text>
          </View>
        </View>

        {/* PERSONNEL TABLE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Personnel</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeaderFirst}>
                <Text style={styles.tableCellHeader}>Name</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Role</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>User ID</Text>
              </View>
            </View>
            {/* Data Rows */}
            {incident.assigned_personnel.length > 0 ? (
              incident.assigned_personnel.map((p, i) => {
                const isLast = i === incident.assigned_personnel.length - 1;
                return (
                  <View key={i} style={isLast ? styles.tableRowLast : styles.tableRow}>
                    <View style={styles.tableColFirst}>
                      <Text style={styles.tableCell}>{p.user_name}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{p.role_on_incident}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>#{p.user_id}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.tableRowLast}>
                <View style={{ ...styles.tableColFirst, width: "100%" }}>
                  <Text style={styles.tableCell}>No personnel assigned.</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* EQUIPMENT TABLE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Assigned Equipment</Text>
          <View style={styles.table}>
            {/* Header Row */}
            <View style={styles.tableRow}>
              <View style={styles.tableColHeaderFirst}>
                <Text style={styles.tableCellHeader}>Asset ID</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Type</Text>
              </View>
              <View style={styles.tableColHeader}>
                <Text style={styles.tableCellHeader}>Status</Text>
              </View>
            </View>
            {/* Data Rows */}
            {incident.assigned_equipment.length > 0 ? (
              incident.assigned_equipment.map((e, i) => {
                const isLast = i === incident.assigned_equipment.length - 1;
                return (
                  <View key={i} style={isLast ? styles.tableRowLast : styles.tableRow}>
                    <View style={styles.tableColFirst}>
                      <Text style={styles.tableCell}>{e.asset_id}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{e.type}</Text>
                    </View>
                    <View style={styles.tableCol}>
                      <Text style={styles.tableCell}>{e.status}</Text>
                    </View>
                  </View>
                );
              })
            ) : (
              <View style={styles.tableRowLast}>
                <View style={{ ...styles.tableColFirst, width: "100%" }}>
                  <Text style={styles.tableCell}>No equipment assigned.</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* ATTACHMENTS LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Attachments Record</Text>
          {incident.assigned_attachments.length > 0 ? (
            incident.assigned_attachments.map((att, i) => (
              <View key={i} style={styles.row}>
                <Text style={{ ...styles.label, width: 20 }}>•</Text>
                <Text style={styles.value}>
                  {att.original_file_name} ({att.mime_type})
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ fontSize: 10, color: "#666666" }}>
              No files attached to this record.
            </Text>
          )}
        </View>

        {/* PHOTO EVIDENCE */}
        {incidentImages.length > 0 && (
          <View style={styles.section} break>
            <Text style={styles.sectionTitle}>Photo Evidence</Text>
            <View style={styles.imageSection}>
              {incidentImages.map((img, i) => (
                <View key={i} style={styles.imageContainer}>
                  <Image
                    style={styles.image}
                    src={getImageUrl(img.file_path_relative)}
                  />
                  <Text style={styles.imageCaption}>
                    Figure {i + 1}: {img.original_file_name}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* FOOTER */}
        <Text style={styles.footer}>
          Confidential Record • Generated by FirePersona 5 System • Do Not
          Distribute Without Authorization
        </Text>
      </Page>
    </Document>
  );
};

export default IncidentReportPDF;