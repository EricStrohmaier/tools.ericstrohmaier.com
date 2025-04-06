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
import InvoicePDF from "@/app/invoice-pdf";

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
  bankDetails: "",
  notes: "Payment is due within 15 days",
  language: "en",
  dateFormat: "MM/DD/YYYY",
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
${settings.email || ""}`.trim();
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
  const [subtotal, setSubtotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [tax, setTax] = useState(0);
  const [shippingFee, setShippingFee] = useState(0);
  const [total, setTotal] = useState(0);
  const [showPDF, setShowPDF] = useState(false);
  const [invoiceNumber, setInvoiceNumber] = useState("001");
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
    if (["name", "address", "email"].includes(field)) {
      const newDetails = `${newSettings.name}
${newSettings.address}
${newSettings.email || ""}`.trim();
      setCompanyDetails(newDetails);
    }
  };

  // Set initial company details from settings
  useEffect(() => {
    if (companySettings) {
      const details = `${companySettings.name}
${companySettings.address}
${companySettings.email || ""}`.trim();
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
    const newSubtotal = currentItems.reduce(
      (sum, item) => sum + (item.amount || 0),
      0
    );
    setSubtotal(newSubtotal);

    // Calculate tax
    const newTax = (newSubtotal * taxRate) / 100;
    setTax(newTax);

    // Calculate total
    const newTotal = newSubtotal + newTax + shippingFee;
    setTotal(newTotal);
  };

  const handleContactSelect = (contact: Contact) => {
    setSelectedContactId(contact.id);
    setSelectedContact(contact);
    setCurrency(contact.currency || "$");
    setBillTo(
      `${contact.name}${contact.companyName ? `\n${contact.companyName}` : ""}
${contact.address}
${contact.email || ""}`.trim()
    );
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-3 md:p-6 space-y-4 md:space-y-6">
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
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Language</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={companySettings?.language || "en"}
                  onChange={(e) =>
                    updateCompanySettings("language", e.target.value)
                  }
                >
                  <option value="en">English</option>
                  <option value="de">German</option>
                  <option value="fr">French</option>
                  <option value="it">Italian</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
              <div>
                <Label>Date Format</Label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={companySettings?.dateFormat || "MM/DD/YYYY"}
                  onChange={(e) =>
                    updateCompanySettings("dateFormat", e.target.value)
                  }
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  <option value="DD.MM.YYYY">DD.MM.YYYY</option>
                </select>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col mb-6">
        <h1 className="text-2xl font-semibold mb-2">Invoice Generator</h1>
        <p className="text-sm text-gray-600">
          A simple invoice generator. Your data stays in your browser - no
          servers, no tracking.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6">
        {/* Left Sidebar - Contacts */}
        <Card className="lg:col-span-1 order-2 lg:order-1">
          <CardContent className="p-4">
            <ContactsManager onSelectContact={handleContactSelect} />
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="lg:col-span-3 order-1 lg:order-2">
          <Tabs
            defaultValue="editor"
            className="w-full"
            onValueChange={setActiveTab}
          >
            <Card className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 mb-4 p-1">
              <div className="w-full sm:w-auto">
                <TabsList className="flex w-full sm:w-auto gap-2 md:gap-4 bg-muted rounded-lg p-1">
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
              <div className="flex flex-wrap gap-2 justify-center sm:justify-end w-full sm:w-auto">
                <Button
                  variant="outline"
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
                      subtotal={subtotal}
                      taxRate={taxRate}
                      tax={tax}
                      shippingFee={shippingFee}
                      total={total}
                      notes={companySettings.notes}
                      bankDetails={companySettings.bankDetails}
                      currency={currency}
                      settings={companySettings}
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
                      subtotal={subtotal}
                      taxRate={taxRate}
                      tax={tax}
                      shippingFee={shippingFee}
                      total={total}
                      notes={companySettings.notes}
                      bankDetails={companySettings.bankDetails}
                      currency={currency}
                      settings={companySettings}
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
              <Card className="max-w-[1400px] mx-auto">
                <CardContent className="space-y-6 p-4 md:p-6">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Invoice Number</Label>
                        <Input
                          placeholder="INV-001"
                          value={invoiceNumber}
                          onChange={(e) => {
                            let value = e.target.value;
                            if (!value) value = "001";
                            if (!value.startsWith("INV-"))
                              value = `INV-${value}`;
                            setInvoiceNumber(value);
                          }}
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
                              className="bg-gray-50"
                              onChange={(e) => {
                                const newDate = e.target.value;
                                setDueDate(newDate);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Items Table */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-12 gap-2 md:gap-4 font-medium text-sm md:text-base">
                      <div className="col-span-5 md:col-span-6">
                        Description
                      </div>
                      <div className="col-span-3 md:col-span-2 text-right">
                        Unit Cost{" "}
                      </div>
                      <div className="col-span-2 text-right">Quantity</div>
                      <div className="col-span-2 text-right">Amount</div>
                    </div>

                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className="grid grid-cols-12 gap-2 md:gap-4 items-center text-sm md:text-base"
                      >
                        <div className="col-span-5 md:col-span-6">
                          <Input
                            placeholder="Item description"
                            value={item.description}
                            maxLength={100}
                            onChange={(e) =>
                              updateItem(
                                index,
                                "description",
                                e.target.value.slice(0, 100)
                              )
                            }
                          />
                        </div>
                        <div className="col-span-3 md:col-span-2">
                          <Input
                            type="text"
                            inputMode="decimal"
                            className="text-right"
                            placeholder={`${currency}0.00`}
                            value={
                              item.unitCost === 0
                                ? ""
                                : item.unitCost.toLocaleString("en-US", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                            }
                            onChange={(e) => {
                              const value =
                                parseFloat(e.target.value.replace(/,/g, "")) ||
                                0;
                              if (value > 999999999.99) return;
                              updateItem(index, "unitCost", Math.max(0, value));
                            }}
                          />
                        </div>
                        <div className="col-span-2">
                          <Input
                            type="text"
                            inputMode="numeric"
                            className="text-right"
                            placeholder="0"
                            value={item.quantity || ""}
                            onChange={(e) => {
                              const value =
                                parseInt(
                                  e.target.value.replace(/[^0-9]/g, "")
                                ) || 0;
                              if (value > 999999) return;
                              updateItem(index, "quantity", Math.max(0, value));
                            }}
                          />
                        </div>
                        <div className="col-span-2 flex items-center gap-1">
                          <span
                            className="w-full text-right text-sm md:text-base truncate cursor-help"
                            title={`${currency} ${item.amount.toLocaleString(
                              "en-US",
                              {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }
                            )}`}
                          >
                            {currency}{" "}
                            {item.amount.toLocaleString("en-US", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </span>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem(index)}
                          >
                            <X className="h-3 w-3" />
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
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                    <div className="space-y-4 col-span-1"></div>
                    <div className="space-y-4 col-span-1 lg:justify-self-end w-full lg:w-80">
                      <div className="flex justify-between items-center">
                        <span>Subtotal:</span>
                        <span
                          className="text-right min-w-[120px] cursor-help"
                          title={`${currency} ${subtotal.toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }
                          )}`}
                        >
                          {currency}{" "}
                          {subtotal.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tax Rate:</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          className="w-32 text-right"
                          placeholder="0%"
                          value={taxRate || ""}
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            const newTaxRate = parseFloat(value) || 0;
                            if (newTaxRate > 100) return;
                            setTaxRate(newTaxRate);
                            const newTax = (subtotal * newTaxRate) / 100;
                            setTax(newTax);
                            setTotal(subtotal + newTax + shippingFee);
                          }}
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Tax Amount:</span>
                        <span
                          className="text-right min-w-[120px] cursor-help"
                          title={`${currency} ${tax.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                        >
                          {currency}{" "}
                          {tax.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Shipping:</span>
                        <Input
                          type="text"
                          inputMode="decimal"
                          className="w-32 text-right"
                          placeholder={`${currency}0.00`}
                          value={
                            shippingFee === 0
                              ? ""
                              : shippingFee.toLocaleString("en-US", {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                          }
                          onChange={(e) => {
                            const value = e.target.value.replace(
                              /[^0-9.]/g,
                              ""
                            );
                            const newShippingFee = parseFloat(value) || 0;
                            if (newShippingFee > 999999999.99) return;
                            setShippingFee(newShippingFee);
                            setTotal(subtotal + tax + newShippingFee);
                          }}
                        />
                      </div>
                      <Separator />
                      <div className="flex justify-between items-center">
                        <span className="font-bold">Total:</span>
                        <span
                          className="text-right min-w-[120px] font-bold cursor-help"
                          title={`${currency} ${total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}`}
                        >
                          {currency}{" "}
                          {total.toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
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
