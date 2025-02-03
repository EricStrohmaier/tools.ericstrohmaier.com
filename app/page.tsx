"use client";
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Settings, Edit2, X } from "lucide-react";
import InvoicePDF from "./invoice-pdf";
import { ContactsManager } from "@/components/ContactsManager";
import { PDFDownloadButton } from "@/components/PDFDownloadButton";
import {
  Contact,
  InvoiceItem,
  Invoice,
  CompanySettings,
} from "@/types/invoice";
import { FaRegFilePdf } from "react-icons/fa";
import {
  secureLocalStorage,
  getFromSecureLocalStorage,
} from "@/utils/encryption";

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
  const [activeTab, setActiveTab] = useState("editor");

  // Update showPDF when tab changes
  useEffect(() => {
    if (activeTab === "preview") {
      setShowPDF(true);
    }
  }, [activeTab]);
  const [showCompanySettings, setShowCompanySettings] = useState(false);

  // Initialize state with data from localStorage if it exists
  const [companySettings, setCompanySettings] = useState<CompanySettings>(
    defaultCompanySettings
  );

  useEffect(() => {
    const loadCompanySettings = async () => {
      if (typeof window !== "undefined") {
        const settings = await getFromSecureLocalStorage<CompanySettings>(
          "companySettings"
        );
        if (settings) {
          setCompanySettings(settings);
          // Update company details when settings are loaded
          const details = `${settings.name}
${settings.address}
${settings.email || ""}
${settings.phone || ""}`.trim();
          setCompanyDetails(details);
        }
      }
    };
    loadCompanySettings();
  }, []);

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

  const [currency, setCurrency] = useState("$");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  // Update company settings and save to localStorage
  const updateCompanySettings = async (
    field: keyof CompanySettings,
    value: string
  ) => {
    const newSettings = { ...companySettings, [field]: value };
    setCompanySettings(newSettings);
    await secureLocalStorage("companySettings", newSettings);

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
    const loadInvoice = async () => {
      const invoice = await getFromSecureLocalStorage<Invoice>(
        "currentInvoice"
      );
      if (invoice) {
        setItems(invoice.items || []);
        setTotal(invoice.total || 0);
        setInvoiceNumber(invoice.invoiceNumber || "");
        setBillTo(invoice.billTo || "");
        setInvoiceDate(invoice.issueDate || "");
        setDueDate(invoice.dueDate || "");
        setSelectedContactId(invoice.selectedContactId || "");
      }
    };
    loadInvoice();
  }, []);

  // Save invoice data to localStorage
  useEffect(() => {
    const saveInvoice = async () => {
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
        currency,
      };
      await secureLocalStorage("currentInvoice", invoice);
    };
    saveInvoice();
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
    currency,
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
    setSelectedContact(contact);
    setCurrency(contact.currency || "$");
    setBillTo(
      `${contact.name}${contact.companyName ? `\n${contact.companyName}` : ""}
${contact.address}
${contact.email || ""}
${contact.phone || ""}`.trim()
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <Dialog open={showCompanySettings} onOpenChange={setShowCompanySettings}>
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Company Settings</DialogTitle>
            <DialogDescription>
              Your company details will be saved in local storage and used in
              all invoices, leave fields blank to not display in the invoice.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company Name</Label>
                <Input
                  value={companySettings?.name || ""}
                  onChange={(e) =>
                    updateCompanySettings("name", e.target.value)
                  }
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={companySettings?.email || ""}
                  onChange={(e) =>
                    updateCompanySettings("email", e.target.value)
                  }
                  placeholder="company@example.com"
                />
              </div>
            </div>
            <div>
              <Label>Address</Label>
              <textarea
                className="w-full min-h-24 p-2 border rounded-md"
                value={companySettings?.address || ""}
                onChange={(e) =>
                  updateCompanySettings("address", e.target.value)
                }
                placeholder="Company Address"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Phone</Label>
                <Input
                  value={companySettings?.phone || ""}
                  onChange={(e) =>
                    updateCompanySettings("phone", e.target.value)
                  }
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
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold mb-2">Boring Invoice</h1>
        <p className="text-sm text-gray-600">
          A simple invoice generator. Your data stays in your browser - no
          servers, no tracking.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Left Sidebar - Contacts */}
        <Card className="col-span-1">
          <CardContent className="p-4">
            <ContactsManager onSelectContact={handleContactSelect} />
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="col-span-3">
          <Tabs
            defaultValue="editor"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <Card className="flex items-center justify-between gap-4 mb-4 p-1">
              <div>
                <TabsList className="flex gap-4 bg-muted rounded-lg p-1">
                  <TabsTrigger
                    value="editor"
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editor
                  </TabsTrigger>
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2 data-[state=active]:bg-background"
                  >
                    <FaRegFilePdf className="w-4 h-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => setShowCompanySettings(true)}
                >
                  <Settings className="w-4 h-4" />
                  Your Profile
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
                      currency={currency}
                    />
                  }
                  fileName={`invoice-${invoiceNumber || "draft"}.pdf`}
                />
              </div>
            </Card>

            <TabsContent value="preview" className="mt-0">
              {showPDF ? (
                <div
                  className="border rounded-lg p-4 bg-white"
                  style={{ height: "800px" }}
                >
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
                      currency={currency}
                    />
                  </PDFViewer>
                </div>
              ) : (
                <div
                  className="flex items-center justify-center"
                  style={{ height: "800px" }}
                >
                  <div className="text-center">
                    <div className="text-muted-foreground mb-4">
                      Loading PDF preview...
                    </div>
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={() => setShowPDF(true)}
                      disabled
                    >
                      Preparing Preview
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="editor">
              <Card>
                <CardContent className="space-y-6 p-4">
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
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
                              onChange={(e) => {
                                const newDate = e.target.value;
                                setInvoiceDate(newDate);
                                // Calculate due date (15 days from invoice date)
                                const dueDate = new Date(newDate);
                                dueDate.setDate(dueDate.getDate() + 15);
                                setDueDate(dueDate.toISOString().split("T")[0]);
                              }}
                            />
                          </div>
                        </div>
                        <div>
                          <Label>Due Date</Label>
                          <div className="relative">
                            <Input
                              type="date"
                              value={dueDate}
                              readOnly
                              className="bg-gray-50"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-4 font-medium">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2">Unit Cost </div>
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
                            placeholder={`${currency}0.00`}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "unitCost",
                                parseFloat(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "quantity",
                                parseInt(e.target.value)
                              )
                            }
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-2">
                          <span className="w-full text-right">
                            {currency}
                            {item.amount.toFixed(2)}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={addItem}
                    >
                      Add Item
                    </Button>
                  </div>

                  {/* Summary Section */}
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4"></div>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>
                          {currency}
                          {total.toFixed(2)}
                        </span>
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
                          placeholder={`${currency}0.00`}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping:</span>
                        <Input
                          type="number"
                          className="w-32 text-right"
                          placeholder={`${currency}0.00`}
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Total:</span>
                        <span>
                          {currency}
                          {total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;
