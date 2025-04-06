import InvoiceGenerator from "@/components/broinginvoicehomepage";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple  Invoice Generator",
};
export default function Page() {
  return <InvoiceGenerator />;
}
