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

*Last Updated: September 29, 2024*

Welcome to Slacktivity. By accessing or using our website (https://slackactivity.com), you agree to the following Terms & Services. Please read them carefully.

### 1. Services  
Slacktivity offers a platform to automate and manage Slack status updates based on user-defined schedules. Our service involves integration with Slack workspaces to enhance productivity by optimizing status management.

### 2. Payments  
Slacktivity charges a fee of €20 per workspace for the services provided. Payment is required upon setup of each workspace, and it covers automated status management and related features. By completing the payment, you agree to these terms.

### 3. User Data  
We collect personal information such as your name, email address, and payment details to manage your account and process payments. For more information, please refer to our [Privacy Policy](https://slackactivity.com/privacy-policy).

### 4. Non-Personal Data  
We may collect non-personal data such as cookies to improve your experience on our site. These cookies are used to provide better service and can be managed through your browser settings.

### 5. User Responsibilities  
Users are responsible for providing accurate information during account setup and workspace integration. Slacktivity is not responsible for any issues arising from incorrect user data.

### 6. Governing Law  
These Terms & Services are governed by the laws of Austria.

### 7. Updates to the Terms  
We may update these Terms from time to time. Users will be notified of any changes via email. Continued use of the site after updates constitutes acceptance of the revised terms.

### 8. Contact Information  
If you have any questions or concerns regarding these Terms, please contact us at: office@slackactivity.com.

---

Thank you for using Slacktivity. We hope our service helps boost your productivity!
`;

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
