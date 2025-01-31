"use client";

import { landingpageContent } from "@/config/landingpage";

import { Container } from "@/components/ui/container";
import { Gradient } from "@/components/ui/gradient";

export function FancyContent() {
  const content = landingpageContent;

  return (
    <section
      id={content.fancyContent.id}
      aria-label={content.fancyContent.headline}
    >
      <Gradient className="relative">
        <div className="absolute inset-2 rounded-3xl bg-white/80" />
        <Container>
          <div className="relative pb-16 pt-20 text-center sm:py-24 max-w-3xl mx-auto">
            <hgroup>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-900 mb-4">
                {content.fancyContent.headline}
                <span className="text-accent-400">
                  {content.fancyContent.highlightedText}
                </span>
                {content.fancyContent.suffix}
              </h2>
              <p className="text-lg text-text-700 mb-8">
                {content.fancyContent.description}
              </p>
            </hgroup>
          </div>
        </Container>
      </Gradient>
    </section>
  );
}
