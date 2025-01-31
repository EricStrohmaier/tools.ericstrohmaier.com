import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";
import { getSEOTags } from "@/lib/seo";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

export const metadata = getSEOTags({
  title: `About Us | ${siteConfig.name}`,
  canonicalUrlRelative: "/about",
});

// Use Markdown (images supported)
const aboutUs = `
# About Us

`;

const AboutUs = () => {
  return (
    <main className="max-w-4xl mx-auto w-full flex justify-center">
      <div className="p-5 w-full">
        <Button variant="link" asChild className="mb-4">
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>

        <div className="prose prose-stone dark:prose-invert mx-auto">
          <ReactMarkdown
            components={{
              img: ({ src, alt }) => (
                <div className="flex justify-center">
                  <img
                    src={src}
                    alt={alt}
                    className="w-[300px] h-auto object-cover rounded-lg"
                  />
                </div>
              ),
            }}
          >
            {aboutUs}
          </ReactMarkdown>
        </div>
      </div>
    </main>
  );
};

export default AboutUs;
