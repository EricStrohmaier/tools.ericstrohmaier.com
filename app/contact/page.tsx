import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { siteConfig } from "@/config/site";
import FeedbackForm from "@/components/app/FeedbackForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl min-h-[700px]">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Contact Us</CardTitle>
          <CardDescription className="text-muted-foreground">
            You can reach us directly at{" "}
            <a
              href={`mailto:${siteConfig.supportEmail}`}
              className="text-primary hover:underline"
            >
              {siteConfig.supportEmail}
            </a>{" "}
            or use the form below.
          </CardDescription>
        </CardHeader>
        <FeedbackForm />
      </Card>
    </div>
  );
}
