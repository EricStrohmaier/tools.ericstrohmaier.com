import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSEOTags } from "@/lib/seo";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export const metadata = getSEOTags({
  title: `Privacy Policy | ${siteConfig.name}`,
  canonicalUrlRelative: "/privacy-policy",
});

const privacyPolicy = `
# Privacy Policy

*Last Updated: February 3, 2025*

This Privacy Policy explains how our Invoice Generator ("we," "our," or "us") handles your data and privacy when you use our website.

### 1. Local Storage and Data Security

Our invoice generator operates entirely in your browser using local storage:

- All data (company settings, contacts, and invoices) is stored locally on your device
- Data is encrypted before being saved to local storage using AES-GCM encryption
- We do not collect, transmit, or store any of your data on our servers
- You have full control over your data - it stays on your device

### 2. Google Ads

We use Google AdSense on our website:

- Google may use cookies to serve ads based on your prior visits
- You can opt out of personalized advertising by visiting Google's Ad Settings
- We do not share any of your invoice or contact data with Google
- Google's use of advertising cookies is subject to Google's privacy policy

### 3. Analytics

We may use basic analytics to understand how our website is used:

- This includes anonymous data like page views and browser types
- No personal information or invoice data is included in analytics
- Analytics help us improve the user experience

### 4. Your Data Rights

Since all data is stored locally on your device:

- You can clear all data by clearing your browser's local storage
- No account deletion is needed as we don't store any data
- You have complete control over your information

### 5. Children's Privacy

Our service is not intended for users under 13 years of age.

### 6. Changes to Privacy Policy

We may update this policy occasionally. Changes will be reflected in the "Last Updated" date.

### 7. Contact

For questions about this privacy policy, contact us at:
Email: contact@ericstrohmaier.com

---

Thank you for using our Invoice Generator. We're committed to protecting your privacy by keeping your data local and encrypted.`;

const PrivacyPolicy = () => {
  return (
    <main className="max-w-4xl mx-auto">
      <div className="p-5">
        <Button variant="link" asChild>
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4" />
            Back
          </Link>
        </Button>
        <div className="prose prose-stone dark:prose-invert">
          <ReactMarkdown>{privacyPolicy}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default PrivacyPolicy;
