import Image from "next/image";
import { landingpageContent } from "@/config/landingpage";
import { Container } from "@/components/ui/container";

export function PartnerCompanies() {
  const content = landingpageContent.partnerCompanies;

  if (!content.active) {
    return null;
  }

  return (
    <section
      id={content.id}
      aria-label="Our partner companies"
      className="py-20 sm:py-32"
    >
      <Container>
        <div className="mx-auto max-w-5xl md:text-center">
          <h2 className="font-semibold text-3xl tracking-tight text-stone-900 sm:text-4xl">
            {content.headline}{" "}
            {content.highlightedText && (
              <span className="relative whitespace-nowrap text-accent-400">
                {content.highlightedText}
              </span>
            )}
            {content.suffix}
          </h2>
          {content.subheadline && (
            <p className="mt-4 text-lg tracking-tight text-stone-700">
              {content.subheadline}
            </p>
          )}
        </div>
        <div className="mx-auto mt-16 max-w-max">
          <ul
            role="list"
            className="grid grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-5 "
          >
            {content.companies.map((company) => (
              <li
                key={company.name}
                className="flex items-center justify-center"
              >
                <Image
                  src={company.logo}
                  alt={company.name}
                  width={158}
                  height={48}
                  className="object-contain"
                />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
