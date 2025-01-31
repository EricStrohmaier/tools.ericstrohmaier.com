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

*Last Updated: September 29, 2024*

Slacktivity ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share your personal information when you use our website (https://slackactivity.com) and services.

### 1. Information We Collect

We collect the following types of information from users:

**Personal Information**  
When you sign up or interact with our services, we collect personal information that may include your:
- Name
- Email address
- Payment details (handled through secure third-party processors)

**Non-Personal Information**  
We may collect non-personal information to improve your experience on our site. This may include:
- Cookies and similar technologies
- Usage data (e.g., pages visited, clicks, and browsing habits)

### 2. How We Use Your Information

We use your personal information to:
- Provide and maintain our services (e.g., automating your Slack status updates)
- Process payments for your subscription
- Communicate with you regarding updates, billing, or support
- Improve our services and user experience
- Comply with legal requirements

We use non-personal information to:
- Enhance and optimize the user experience on our site
- Analyze site performance and user interaction for improvements

### 3. Cookies

Slacktivity uses cookies and similar tracking technologies to enhance your browsing experience. Cookies help us remember your preferences and understand how you interact with our site. You can control or disable cookies in your browser settings, though this may affect the functionality of the site.

### 4. Third-Party Service Providers

We use third-party service providers to process payments (e.g., Stripe) and for email communication. These providers have access to your personal information but are obligated to use it only for specific purposes related to our services.

### 5. Data Security

We take the security of your data seriously and implement industry-standard security measures to protect it. However, no method of transmission over the internet or method of electronic storage is 100% secure, and we cannot guarantee its absolute security.

### 6. Data Retention

We retain your personal data for as long as it is necessary to provide you with our services and for legitimate business purposes. If you wish to delete your account or request that we no longer use your information, please contact us at office@slackactivity.com.

### 7. Your Rights

You have the following rights regarding your personal information:
- **Access**: Request a copy of the data we hold about you.
- **Correction**: Request corrections to your personal data.
- **Deletion**: Request the deletion of your data under certain conditions.
- **Objection**: Object to how we process your data.

To exercise any of these rights, please contact us at office@slackactivity.com.

### 8. Children's Privacy

Slacktivity is not intended for use by individuals under the age of 16, and we do not knowingly collect personal information from children.

### 9. Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any significant changes by email or through our website. The updated Privacy Policy will be effective as of the "Last Updated" date above.

### 10. Contact Us

If you have any questions or concerns about this Privacy Policy or how we handle your personal information, please contact us at:

Email: office@slackactivity.com.

---

Thank you for trusting Slacktivity. We are committed to protecting your privacy and ensuring transparency in how your data is used.
`;

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
