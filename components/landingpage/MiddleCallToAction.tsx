import Image from "next/image";

import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { landingpageContent } from "@/config/landingpage";
import Link from "next/link";

export function MiddleCallToAction() {
  const content = landingpageContent;

  if (!content.middleCTA) return null;
  if (content.middleCTA.active === false) return null;

  return (
    <section
      id={content.middleCTA.id}
      className="relative overflow-hidden py-32"
    >
      <Image
        className="absolute left-1/2 top-1/2 max-w-none -translate-x-1/2 -translate-y-1/2"
        src={content.middleCTA.backgroundImage}
        alt=""
        width={2347}
        height={1244}
        unoptimized
      />
      <Container className={`relative ${content.middleCTA.textColor}`}>
        <div className="mx-auto max-w-lg text-center">
          <h2 className="font-semibold text-3xl tracking-tight sm:text-5xl">
            {content.middleCTA.headline}
          </h2>
          <p className="mt-4 text-lg tracking-tight">
            {content.middleCTA.subheadline}
          </p>
          <Button
            asChild
            size="lg"
            className={`mt-8 ${content.middleCTA.button.className}`}
          >
            <Link href={content.middleCTA.button.href}>
              {content.middleCTA.button.text}
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
