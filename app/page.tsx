"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "lucide-react";
import InvoicePDF from "./invoice-pdf";
import { ContactsManager } from "@/components/ContactsManager";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import {
  Contact,
  InvoiceItem,
  Invoice,
  CompanySettings,
} from "@/types/invoice";

// Dynamically import PDFViewer with no SSR
const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <div>Loading PDF preview...</div>,
  }
);

const defaultCompanySettings: CompanySettings = {
  name: "",
  address: "",
  email: "",
  phone: "",
  bankDetails: "",
  notes: "Payment is due within 15 days",
};

const InvoiceGenerator = () => {
  // Initialize state with data from localStorage if it exists
  const initialCompanySettings = (() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("companySettings");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Error parsing company settings:", e);
        }
      }
    }
    return defaultCompanySettings;
  })();

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: crypto.randomUUID(),
      description: "",
      unitCost: 0,
      quantity: 0,
      amount: 0,
    },
  ]);
  const [total, setTotal] = useState(0);
  const [showPDF, setShowPDF] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [companyDetails, setCompanyDetails] = useState("");
  const [billTo, setBillTo] = useState("");
  const [invoiceDate, setInvoiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [selectedContactId, setSelectedContactId] = useState<string>("");
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
    initialCompanySettings
  );

  // Update company settings and save to localStorage
  const updateCompanySettings = (
    field: keyof CompanySettings,
    value: string
  ) => {
    const newSettings = { ...companySettings, [field]: value };
    setCompanySettings(newSettings);
    localStorage.setItem("companySettings", JSON.stringify(newSettings));

    // Update company details if relevant fields change
    if (["name", "address", "email", "phone"].includes(field)) {
      const newDetails = `${newSettings.name}
${newSettings.address}
${newSettings.email || ""}
${newSettings.phone || ""}`.trim();
      setCompanyDetails(newDetails);
    }
  };

  // Set initial company details from settings
  useEffect(() => {
    if (companySettings) {
      const details = `${companySettings.name}
${companySettings.address}
${companySettings.email || ""}
${companySettings.phone || ""}`.trim();
      setCompanyDetails(details);
    }
  }, []);

  // Load saved invoice data from localStorage
  useEffect(() => {
    const savedInvoice = localStorage.getItem("currentInvoice");
    if (savedInvoice) {
      const invoice: Invoice = JSON.parse(savedInvoice);
      setItems(invoice.items || []);
      setTotal(invoice.total || 0);
      setInvoiceNumber(invoice.invoiceNumber || "");
      setBillTo(invoice.billTo || "");
      setInvoiceDate(invoice.issueDate || "");
      setDueDate(invoice.dueDate || "");
      setSelectedContactId(invoice.selectedContactId || "");
    }
  }, []);

  // Save invoice data to localStorage
  useEffect(() => {
    const invoice: Invoice = {
      invoiceNumber,
      issueDate: invoiceDate,
      dueDate,
      companyDetails,
      billTo,
      items,
      subtotal: total,
      taxRate: 0,
      tax: 0,
      shippingFee: 0,
      total,
      selectedContactId,
      notes: companySettings.notes,
      bankDetails: companySettings.bankDetails,
    };
    localStorage.setItem("currentInvoice", JSON.stringify(invoice));
  }, [
    items,
    total,
    invoiceNumber,
    companyDetails,
    billTo,
    invoiceDate,
    dueDate,
    selectedContactId,
    companySettings,
  ]);

  const addItem = () => {
    setItems([
      ...items,
      {
        id: crypto.randomUUID(),
        description: "",
        unitCost: 0,
        quantity: 0,
        amount: 0,
      },
    ]);
  };

  const removeItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    calculateTotal(newItems);
  };

  const updateItem = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };

    if (field === "unitCost" || field === "quantity") {
      newItems[index].amount =
        newItems[index].unitCost * newItems[index].quantity;
    }

    setItems(newItems);
    calculateTotal(newItems);
  };

  const calculateTotal = (currentItems: InvoiceItem[]) => {
    const subtotal = currentItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setTotal(subtotal);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setBillTo(
      `${contact.name}${contact.companyName ? `\n${contact.companyName}` : ""}
${contact.address}
${contact.email || ""}
${contact.phone || ""}`.trim()
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Contacts</CardTitle>
          <CardDescription>
            Manage your contacts for quick invoice generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ContactsManager onSelectContact={handleContactSelect} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Company Settings</CardTitle>
          <CardDescription>
            Your company details will be saved and used in all invoices
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Company Name</Label>
              <Input
                value={companySettings?.name || ""}
                onChange={(e) => updateCompanySettings("name", e.target.value)}
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={companySettings?.email || ""}
                onChange={(e) => updateCompanySettings("email", e.target.value)}
                placeholder="company@example.com"
              />
            </div>
          </div>
          <div>
            <Label>Address</Label>
            <textarea
              className="w-full min-h-24 p-2 border rounded-md"
              value={companySettings?.address || ""}
              onChange={(e) => updateCompanySettings("address", e.target.value)}
              placeholder="Company Address"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Phone</Label>
              <Input
                value={companySettings?.phone || ""}
                onChange={(e) => updateCompanySettings("phone", e.target.value)}
                placeholder="Phone Number"
              />
            </div>
          </div>
          <div>
            <Label>Default Payment Terms</Label>
            <textarea
              className="w-full min-h-24 p-2 border rounded-md"
              value={companySettings?.notes || ""}
              onChange={(e) => updateCompanySettings("notes", e.target.value)}
              placeholder="Payment Terms"
            />
          </div>
          <div>
            <Label>Bank Details</Label>
            <textarea
              className="w-full min-h-24 p-2 border rounded-md"
              value={companySettings?.bankDetails || ""}
              onChange={(e) =>
                updateCompanySettings("bankDetails", e.target.value)
              }
              placeholder="Bank Account Details"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Generator</CardTitle>
          <CardDescription>
            Create and download your invoice as PDF
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Invoice Number</Label>
                <Input
                  placeholder="INV-001"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                />
              </div>
              <div>
                <Label>Bill To</Label>
                <textarea
                  className="w-full min-h-24 p-2 border rounded-md"
                  placeholder="Client billing information"
                  value={billTo}
                  onChange={(e) => setBillTo(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Invoice Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={invoiceDate}
                      onChange={(e) => setInvoiceDate(e.target.value)}
                    />
                    <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <Label>Due Date</Label>
                  <div className="relative">
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                    />
                    <Calendar className="absolute right-2 top-2.5 h-4 w-4 text-gray-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="space-y-4">
            <div className="grid grid-cols-12 gap-4 font-medium">
              <div className="col-span-6">Description</div>
              <div className="col-span-2">Unit Cost</div>
              <div className="col-span-2">Quantity</div>
              <div className="col-span-2">Amount</div>
            </div>

            {items.map((item, index) => (
              <div
                key={item.id}
                className="grid grid-cols-12 gap-4 items-center"
              >
                <div className="col-span-6">
                  <Input
                    placeholder="Item description"
                    value={item.description}
                    onChange={(e) =>
                      updateItem(index, "description", e.target.value)
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.unitCost}
                    onChange={(e) =>
                      updateItem(index, "unitCost", parseFloat(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2">
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(index, "quantity", parseInt(e.target.value))
                    }
                  />
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <span className="w-full text-right">
                    ${item.amount.toFixed(2)}
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeItem(index)}
                  >
                    ×
                  </Button>
                </div>
              </div>
            ))}

            <Button variant="outline" className="w-full" onClick={addItem}>
              Add Item
            </Button>
          </div>

          {/* Summary Section */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label>Notes / Payment Terms</Label>
                <textarea
                  className="w-full min-h-24 p-2 border rounded-md"
                  placeholder="Payment is due within 15 days"
                  value={companySettings.notes}
                  onChange={(e) =>
                    updateCompanySettings("notes", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Bank Account Details</Label>
                <textarea
                  className="w-full min-h-24 p-2 border rounded-md"
                  placeholder="Your bank account information"
                  value={companySettings.bankDetails}
                  onChange={(e) =>
                    updateCompanySettings("bankDetails", e.target.value)
                  }
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Tax Rate:</span>
                <Input
                  type="number"
                  className="w-32 text-right"
                  placeholder="0%"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Discount:</span>
                <Input
                  type="number"
                  className="w-32 text-right"
                  placeholder="$0.00"
                />
              </div>
              <div className="flex justify-between items-center">
                <span>Shipping:</span>
                <Input
                  type="number"
                  className="w-32 text-right"
                  placeholder="$0.00"
                />
              </div>
              <Separator />
              <div className="flex justify-between font-bold">
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              className="w-full bg-green-500 hover:bg-green-600 text-white"
              onClick={() => setShowPDF(true)}
            >
              Preview Invoice
            </Button>

            <PDFDownloadButton
              document={
                <InvoicePDF
                  invoiceNumber={invoiceNumber}
                  issueDate={invoiceDate}
                  dueDate={dueDate}
                  companyDetails={companyDetails}
                  billTo={billTo}
                  items={items}
                  subtotal={total}
                  taxRate={0}
                  tax={0}
                  shippingFee={0}
                  total={total}
                  notes={companySettings.notes}
                  bankDetails={companySettings.bankDetails}
                />
              }
              fileName={`invoice-${invoiceNumber || "draft"}.pdf`}
            />
          </div>

          {showPDF && (
            <div className="border rounded-lg p-4 bg-white" style={{ height: "800px" }}>
              <PDFViewer width="100%" height="100%">
                <InvoicePDF
                  invoiceNumber={invoiceNumber}
                  issueDate={invoiceDate}
                  dueDate={dueDate}
                  companyDetails={companyDetails}
                  billTo={billTo}
                  items={items}
                  subtotal={total}
                  taxRate={0}
                  tax={0}
                  shippingFee={0}
                  total={total}
                  notes={companySettings.notes}
                  bankDetails={companySettings.bankDetails}
                />
              </PDFViewer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceGenerator;
