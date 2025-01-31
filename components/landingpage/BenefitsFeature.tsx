"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import clsx from "clsx";

import { Container } from "@/components/ui/container";
import { landingpageContent } from "@/config/landingpage";

export function BenefitsFeature({ isMarketplace = false }) {
  const content = landingpageContent;

  let [tabOrientation, setTabOrientation] = useState<"horizontal" | "vertical">(
    "horizontal"
  );

  useEffect(() => {
    let lgMediaQuery = window.matchMedia("(min-width: 1024px)");

    function onMediaQueryChange({ matches }: { matches: boolean }) {
      setTabOrientation(matches ? "vertical" : "horizontal");
    }

    onMediaQueryChange(lgMediaQuery);
    lgMediaQuery.addEventListener("change", onMediaQueryChange);

    return () => {
      lgMediaQuery.removeEventListener("change", onMediaQueryChange);
    };
  }, []);

  return (
    <section
      id={content.benefitsFeature.id}
      aria-label={content.benefitsFeature.headline}
      className="relative overflow-hidden pb-28 pt-20 sm:py-32"
    >
      {/* <div className="absolute inset-0 bg-black/40 z-10" />
      <Image
        className="absolute inset-0 object-cover w-full h-full max-w-none blur-sm"
        src={backgroundImage}
        alt="Sunset sky background"
        unoptimized
      /> */}
      <div className="absolute inset-0 bg-gradient-to-l from-lightBlue to-stone-50 opacity-70 -z-10"></div>

      <Container className="relative z-20">
        <div className="max-w-2xl md:mx-auto md:text-center xl:max-w-none">
          <div className="relative flex flex-wrap justify-center items-center font-semibold text-3xl tracking-tight text-text-900 md:text-5xl">
            <span className="block">{content.benefitsFeature.headline}</span>
            <span className="mt-2 ml-2 text-accent-400 whitespace-nowrap">
              {content.benefitsFeature.highlightedText}
            </span>
            <span className="mt-2 ml-2">{content.benefitsFeature.suffix}</span>
          </div>

          <p className="mt-6 text-lg tracking-tight text-gray-600">
            {content.benefitsFeature.subheadline}
          </p>
        </div>
        <TabGroup
          className="mt-16 grid grid-cols-1 items-center gap-y-2 pt-10 sm:gap-y-6 md:mt-20 lg:grid-cols-12 lg:pt-0"
          vertical={tabOrientation === "vertical"}
        >
          {({ selectedIndex }) => (
            <>
              <div className="-mx-4 flex overflow-x-auto pb-4 sm:mx-0 sm:overflow-visible sm:pb-0 lg:col-span-5">
                <TabList className="relative z-10 flex gap-x-4 whitespace-nowrap px-4 sm:mx-auto sm:px-0 lg:mx-0 lg:block lg:gap-x-0 lg:gap-y-1 lg:whitespace-normal">
                  {content.benefitsFeature.features.map(
                    (feature, featureIndex) => (
                      <div
                        key={feature.title}
                        className={clsx(
                          "group relative rounded-full px-4 py-1 lg:rounded-l-xl lg:rounded-r-none lg:p-6",
                          selectedIndex === featureIndex
                            ? "bg-black/10 lg:bg-black/10 lg:ring-1 lg:ring-inset lg:ring-black/10"
                            : "hover:bg-black/10 lg:hover:bg-black/5"
                        )}
                      >
                        <h3>
                          <Tab
                            className={clsx(
                              "font-display text-lg focus:outline-none",
                              selectedIndex === featureIndex
                                ? "text-accent-500"
                                : "text-text"
                            )}
                          >
                            <span className="absolute inset-0 rounded-full lg:rounded-l-xl lg:rounded-r-none" />
                            {feature.title}
                          </Tab>
                        </h3>
                        <p
                          className={clsx(
                            "mt-2 hidden text-sm lg:block",
                            selectedIndex === featureIndex
                              ? "text-text"
                              : "text-text"
                          )}
                        >
                          {feature.description}
                        </p>
                      </div>
                    )
                  )}
                </TabList>
              </div>
              <TabPanels className="lg:col-span-7">
                {content.benefitsFeature.features.map((feature) => (
                  <TabPanel key={feature.title} unmount={false}>
                    <div className="relative sm:px-6 lg:hidden">
                      <div className="absolute -inset-x-4 bottom-[-4.25rem] top-[-6.5rem] bg-black/10 ring-1 ring-inset ring-black/10 sm:inset-x-0 sm:rounded-t-xl" />
                      <p className="relative mx-auto max-w-2xl text-base text-text-800 sm:text-center">
                        {feature.description}
                      </p>
                    </div>
                    <div className="mt-10 w-[45rem] md:h-[560px] h-[300px] overflow-hidden rounded-xl bg-background-50 shadow-xl shadow-primary-900/20 sm:w-auto lg:mt-0 lg:w-[67.8125rem] aspect-w-16 aspect-h-9">
                      {" "}
                      {/* Set the aspect ratio */}
                      <Image
                        className="object-left-top object-contain"
                        src={feature.image}
                        alt=""
                        priority
                        sizes="(min-width: 1024px) 67.8125rem, (min-width: 640px) 100vw, 45rem"
                      />
                    </div>
                  </TabPanel>
                ))}
              </TabPanels>
            </>
          )}
        </TabGroup>
      </Container>
    </section>
  );
}
