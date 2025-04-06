"use client";

import { TimeEntry, Project } from "@/app/actions";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const formatDuration = (seconds?: number): string => {
  if (!seconds) return "0h 0m";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours}h ${minutes}m`;
};

const styles = StyleSheet.create({
  page: {
    padding: 50,
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#333333",
  },
  title: {
    fontSize: 24,
    marginBottom: 30,
    color: "#1a1a1a",
  },
  headerGrid: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 40,
  },
  headerCol: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "#666666",
    marginBottom: 5,
    textTransform: "uppercase",
  },
  value: {
    fontSize: 12,
    marginBottom: 15,
  },
  table: {
    marginTop: 30,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    paddingBottom: 5,
    marginBottom: 10,
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },
  projectCell: {
    flex: 2,
    paddingRight: 10,
  },
  descriptionCell: {
    flex: 3,
    paddingRight: 10,
  },
  dateCell: {
    width: "20%",
    paddingRight: 10,
  },
  durationCell: {
    width: "15%",
    textAlign: "right",
    paddingRight: 10,
  },
  summarySection: {
    marginTop: 30,
    alignItems: "flex-end",
  },
  summaryRow: {
    flexDirection: "row",
    paddingVertical: 5,
  },
  summaryLabel: {
    width: 100,
    textAlign: "right",
    paddingRight: 10,
    color: "#666666",
  },
  summaryValue: {
    width: 80,
    textAlign: "right",
  },
  total: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  totalValue: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    marginTop: "auto",
    paddingTop: 30,
    paddingHorizontal: 0,
    fontSize: 10,
    color: "#666666",
    textAlign: "center",
  },
});

interface TimeTrackingPDFProps {
  timeEntries: TimeEntry[];
  projects: Record<string, Project>;
  dateRange: DateRange | undefined;
  projectName?: string;
  userName?: string;
}

const TimeTrackingPDF = ({
  timeEntries,
  projects,
  dateRange,
  projectName,
  userName,
}: TimeTrackingPDFProps) => {
  // Calculate total hours
  const totalSeconds = timeEntries.reduce(
    (total, entry) => total + (entry.duration || 0),
    0
  );
  const totalHours = (totalSeconds / 3600).toFixed(2);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Time Tracking Report</Text>

        <View style={styles.headerGrid}>
          <View style={styles.headerCol}>
            <Text style={styles.label}>Generated On</Text>
            <Text style={styles.value}>
              {format(new Date(), "MMMM dd, yyyy")}
            </Text>

            {userName && (
              <>
                <Text style={styles.label}>User</Text>
                <Text style={styles.value}>{userName}</Text>
              </>
            )}
          </View>

          <View style={styles.headerCol}>
            {dateRange?.from && (
              <>
                <Text style={styles.label}>Date Range</Text>
                <Text style={styles.value}>
                  {format(dateRange.from, "MMM dd, yyyy")}
                  {dateRange.to && ` - ${format(dateRange.to, "MMM dd, yyyy")}`}
                </Text>
              </>
            )}

            {projectName && (
              <>
                <Text style={styles.label}>Project</Text>
                <Text style={styles.value}>{projectName}</Text>
              </>
            )}
          </View>

          <View style={styles.headerCol}>
            <Text style={styles.label}>Total Hours</Text>
            <Text style={styles.value}>{totalHours}</Text>
          </View>
        </View>

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.projectCell}>Project</Text>
            <Text style={styles.descriptionCell}>Description</Text>
            <Text style={styles.dateCell}>Date</Text>
            <Text style={styles.durationCell}>Duration</Text>
          </View>

          {timeEntries.map((entry, index) => {
            const project = projects[entry.project_id];
            return (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.projectCell}>
                  {project?.name || "Unknown Project"}
                </Text>
                <Text style={styles.descriptionCell}>
                  {entry.description || "No description"}
                </Text>
                <Text style={styles.dateCell}>
                  {format(new Date(entry.start_time), "MMM dd, yyyy")}
                </Text>
                <Text style={styles.durationCell}>
                  {formatDuration(entry.duration)}
                </Text>
              </View>
            );
          })}
        </View>

        <View style={styles.summarySection}>
          <View style={[styles.summaryRow, styles.total]}>
            <Text style={[styles.summaryLabel, styles.totalLabel]}>
              Total Hours
            </Text>
            <Text style={[styles.summaryValue, styles.totalValue]}>
              {totalHours}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Generated with Invoice Template App</Text>
        </View>
      </Page>
    </Document>
  );
};

export default TimeTrackingPDF;
