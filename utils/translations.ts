type TranslationKeys = {
  invoice: string;
  invoiceNumber: string;
  billedTo: string;
  dateOfIssue: string;
  dueDate: string;
  from: string;
  description: string;
  unitCost: string;
  quantity: string;
  amount: string;
  subtotal: string;
  taxRate: string;
  taxAmount: string;
  shipping: string;
  invoiceTotal: string;
  paymentTerms: string;
  bankDetails: string;
};

const translations: Record<string, TranslationKeys> = {
  en: {
    invoice: "Invoice",
    invoiceNumber: "Invoice Number",
    billedTo: "Billed To",
    dateOfIssue: "Date of Issue",
    dueDate: "Due Date",
    from: "From",
    description: "Description",
    unitCost: "Unit Cost",
    quantity: "QTY",
    amount: "Amount",
    subtotal: "Subtotal",
    taxRate: "Tax Rate",
    taxAmount: "Tax Amount",
    shipping: "Shipping",
    invoiceTotal: "Invoice Total",
    paymentTerms: "Payment Terms",
    bankDetails: "Bank Details",
  },
  de: {
    invoice: "Rechnung",
    invoiceNumber: "Rechnungsnummer",
    billedTo: "Rechnungsempfänger",
    dateOfIssue: "Rechnungsdatum",
    dueDate: "Fälligkeitsdatum",
    from: "Von",
    description: "Beschreibung",
    unitCost: "Einzelpreis",
    quantity: "Menge",
    amount: "Betrag",
    subtotal: "Zwischensumme",
    taxRate: "Steuersatz",
    taxAmount: "Steuerbetrag",
    shipping: "Versand",
    invoiceTotal: "Gesamtbetrag",
    paymentTerms: "Zahlungsbedingungen",
    bankDetails: "Bankverbindung",
  },
  fr: {
    invoice: "Facture",
    invoiceNumber: "Numéro de facture",
    billedTo: "Facturer à",
    dateOfIssue: "Date d'émission",
    dueDate: "Date d'échéance",
    from: "De",
    description: "Description",
    unitCost: "Prix unitaire",
    quantity: "Qté",
    amount: "Montant",
    subtotal: "Sous-total",
    taxRate: "Taux de TVA",
    taxAmount: "Montant de TVA",
    shipping: "Frais de port",
    invoiceTotal: "Total",
    paymentTerms: "Conditions de paiement",
    bankDetails: "Coordonnées bancaires",
  },
  it: {
    invoice: "Fattura",
    invoiceNumber: "Numero fattura",
    billedTo: "Fatturato a",
    dateOfIssue: "Data di emissione",
    dueDate: "Scadenza",
    from: "Da",
    description: "Descrizione",
    unitCost: "Prezzo unitario",
    quantity: "Qtà",
    amount: "Importo",
    subtotal: "Subtotale",
    taxRate: "Aliquota IVA",
    taxAmount: "Importo IVA",
    shipping: "Spedizione",
    invoiceTotal: "Totale fattura",
    paymentTerms: "Termini di pagamento",
    bankDetails: "Coordinate bancarie",
  },
  es: {
    invoice: "Factura",
    invoiceNumber: "Número de factura",
    billedTo: "Facturado a",
    dateOfIssue: "Fecha de emisión",
    dueDate: "Fecha de vencimiento",
    from: "De",
    description: "Descripción",
    unitCost: "Precio unitario",
    quantity: "Cant.",
    amount: "Importe",
    subtotal: "Subtotal",
    taxRate: "Tipo impositivo",
    taxAmount: "Importe impuesto",
    shipping: "Envío",
    invoiceTotal: "Total factura",
    paymentTerms: "Condiciones de pago",
    bankDetails: "Datos bancarios",
  },
};

export function getTranslation(key: keyof TranslationKeys, language: string = "en"): string {
  return translations[language]?.[key] || translations.en[key];
}
