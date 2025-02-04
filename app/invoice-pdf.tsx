"use client";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";
import { InvoiceItem, CompanySettings } from "@/types/invoice";
import { formatDate } from "@/utils/dateFormat";
import { getTranslation } from "@/utils/translations";

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
  description: {
    flex: 2,
  },
  unitCost: {
    flex: 1,
    textAlign: "right",
  },
  qty: {
    flex: 1,
    textAlign: "right",
  },
  amount: {
    flex: 1,
    textAlign: "right",
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
    width: 100,
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
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
  },
  notes: {
    marginTop: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  bankDetails: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
  },
  currency: {
    position: "absolute",
    bottom: 30,
    right: 30,
  },
});

interface InvoicePDFProps {
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  companyDetails: string;
  billTo: string;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  tax: number;
  shippingFee: number;
  total: number;
  notes?: string;
  bankDetails?: string;
  currency: string;
  settings?: CompanySettings;
}

const InvoicePDF = ({
  invoiceNumber,
  issueDate,
  dueDate,
  companyDetails,
  billTo,
  items,
  subtotal,
  taxRate,
  tax,
  shippingFee,
  total,
  notes,
  bankDetails,
  currency,
  settings,
}: InvoicePDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>
        {getTranslation("invoice", settings?.language)}
      </Text>

      <View style={styles.headerGrid}>
        <View style={styles.headerCol}>
          <Text style={styles.label}>
            {getTranslation("invoiceNumber", settings?.language)}
          </Text>
          <Text style={styles.value}>{invoiceNumber}</Text>

          <Text style={styles.label}>
            {getTranslation("billedTo", settings?.language)}
          </Text>
          <Text style={styles.value}>{billTo}</Text>
        </View>

        <View style={styles.headerCol}>
          <Text style={styles.label}>
            {getTranslation("dateOfIssue", settings?.language)}
          </Text>
          <Text style={styles.value}>
            {formatDate(issueDate, settings?.dateFormat || "YYYY-MM-DD")}
          </Text>

          <Text style={styles.label}>
            {getTranslation("dueDate", settings?.language)}
          </Text>
          <Text style={styles.value}>
            {formatDate(dueDate, settings?.dateFormat || "YYYY-MM-DD")}
          </Text>
        </View>

        <View style={styles.headerCol}>
          <Text style={styles.label}>
            {getTranslation("from", settings?.language)}
          </Text>
          <Text style={styles.value}>{companyDetails}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <Text style={styles.description}>
            {getTranslation("description", settings?.language)}
          </Text>
          <Text style={styles.unitCost}>
            {getTranslation("unitCost", settings?.language)}
          </Text>
          <Text style={styles.qty}>
            {getTranslation("quantity", settings?.language)}
          </Text>
          <Text style={styles.amount}>
            {getTranslation("amount", settings?.language)}
          </Text>
        </View>

        {items
          .filter(
            (item) => item.description && item.quantity > 0 && item.amount > 0
          )
          .map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.unitCost}>{item.unitCost}</Text>
              <Text style={styles.qty}>{item.quantity}</Text>
              <Text style={styles.amount}>{item.amount}</Text>
            </View>
          ))}
      </View>

      <View style={styles.summarySection}>
        {subtotal > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {getTranslation("subtotal", settings?.language)}
            </Text>
            <Text style={styles.summaryValue}>
              {currency} {subtotal.toFixed(2)}
            </Text>
          </View>
        )}

        {taxRate > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {getTranslation("taxRate", settings?.language)}
            </Text>
            <Text style={styles.summaryValue}>{taxRate}%</Text>
          </View>
        )}

        {tax > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {getTranslation("taxAmount", settings?.language)}
            </Text>
            <Text style={styles.summaryValue}>
              {currency} {tax.toFixed(2)}
            </Text>
          </View>
        )}

        {shippingFee > 0 && (
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {getTranslation("shipping", settings?.language)}
            </Text>
            <Text style={styles.summaryValue}>
              {currency} {shippingFee.toFixed(2)}
            </Text>
          </View>
        )}

        <View style={[styles.summaryRow, styles.total]}>
          <Text style={[styles.summaryLabel, styles.totalLabel]}>
            {getTranslation("invoiceTotal", settings?.language)}
          </Text>
          <Text style={[styles.summaryValue, styles.totalValue]}>
            {currency} {total.toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        {notes && (
          <View style={styles.notes}>
            <Text style={styles.label}>
              {getTranslation("paymentTerms", settings?.language)}:
            </Text>
            <Text>{notes}</Text>
          </View>
        )}
        {bankDetails && (
          <View style={styles.bankDetails}>
            <Text style={styles.label}>
              {getTranslation("bankDetails", settings?.language)}:
            </Text>
            <Text>{bankDetails}</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export default InvoicePDF;
