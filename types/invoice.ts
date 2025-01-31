export interface Contact {
  id: string;
  name: string;
  companyName?: string;
  address: string;
  email?: string;
  phone?: string;
}

export interface CompanySettings {
  name: string;
  address: string;
  email?: string;
  phone?: string;
  bankDetails?: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  unitCost: number;
  quantity: number;
  amount: number;
}

export interface Invoice {
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
  selectedContactId?: string;
  notes?: string;
  bankDetails?: string;
}
