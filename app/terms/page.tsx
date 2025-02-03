import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSEOTags } from "@/lib/seo";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export const metadata = getSEOTags({
  title: `Terms of Service | ${siteConfig.name}`,
  canonicalUrlRelative: "/terms",
});

const termsOfService = `
# Terms of Service

*Last Updated: February 3, 2025*

Welcome to our Invoice Generator. By using this website, you agree to these Terms of Service. Please read them carefully.

### 1. Services

We provide a free invoice generation tool that:
- Allows creation and management of invoices
- Stores data locally in your browser
- Encrypts your data for security
- Generates PDF invoices

### 2. No Cost

Our invoice generator is provided free of charge. We may display advertisements to support the service.

### 3. Data Storage and Security

- All data is stored locally in your browser's storage
- Data is encrypted before storage using AES-GCM encryption
- We do not store or process any of your data on our servers
- You are responsible for backing up your data

### 4. Limitations

- We provide this service "as is" without any warranties
- We are not responsible for any loss of data
- We do not guarantee uninterrupted access to the service
- Features may change without notice

### 5. Acceptable Use

You agree to:
- Use the service for legal purposes only
- Not attempt to circumvent any security measures
- Not use the service to generate fraudulent invoices
- Not attempt to harm or disrupt the service

### 6. Intellectual Property

- The software, design, and branding remain our property
- You may not copy, modify, or redistribute the service
- Generated invoices belong to you

### 7. Third-Party Services

- We use Google AdSense for advertising
- Third-party services have their own terms and policies
- We are not responsible for third-party services

### 8. Changes to Terms

- We may update these terms at any time
- Changes will be effective immediately upon posting
- Continued use constitutes acceptance of changes

### 9. Disclaimer

THE SERVICE IS PROVIDED "AS IS" WITHOUT WARRANTY OF ANY KIND. WE DO NOT GUARANTEE THE ACCURACY, COMPLETENESS, OR USEFULNESS OF THE SERVICE.

### 10. Contact

For questions about these terms, contact:
Email: contact@ericstrohmaier.com

---

Thank you for using our Invoice Generator responsibly.`;

const TOS = () => {
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
          <ReactMarkdown>{termsOfService}</ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default TOS;
