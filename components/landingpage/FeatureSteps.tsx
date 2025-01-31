"use client";

import React from "react";
import { Tab, TabGroup, TabList } from "@headlessui/react";
import clsx from "clsx";
import { FiGitBranch, FiPackage, FiPlay } from "react-icons/fi";

import { Container } from "@/components/ui/container";
import { landingpageContent } from "@/config/landingpage";
import { IconType } from "react-icons";
import Image, { StaticImageData } from "next/image";

const iconMap: { [key: string]: IconType } = {
  clone: FiGitBranch,
  install: FiPackage,
  start: FiPlay,
};

interface Feature {
  step: React.ReactNode;
  summary: string;
  description: string;
  iconKey?: string;
  image?: string | StaticImageData;
}

function IconFeature({
  feature,
  isActive,
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div"> & {
  feature: Feature;
  isActive: boolean;
}) {
  const Icon = feature.iconKey ? iconMap[feature.iconKey] : null;

  return (
    <div
      className={clsx(className, !isActive && "opacity-75 hover:opacity-100")}
      {...props}
    >
      <div
        className={clsx(
          "w-9 rounded-lg",
          isActive
            ? "bg-secondary text-text-900"
            : "bg-primary-700 text-text-100"
        )}
      >
        {Icon && <Icon className="h-9 w-9 mx-auto p-1" aria-hidden="true" />}
      </div>
      <h3
        className={clsx(
          "mt-6 text-sm font-medium",
          isActive ? "text-secondary" : "text-text-900"
        )}
      >
        {feature.step}
      </h3>
      <p className="mt-2 font-display text-xl text-text-900">
        {feature.summary}
      </p>
      <p className="mt-4 text-sm text-gray-600">{feature.description}</p>
    </div>
  );
}

function ImageFeature({ feature }: { feature: Feature }) {
  return (
    <li className="grid auto-rows-min grid-cols-1 items-center gap-8 px-3 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-1 xl:px-12">
      <div className="relative h-48 overflow-hidden rounded-2xl shadow-lg sm:h-60 lg:h-40">
        {feature.image &&
          (typeof feature.image === "string" ? (
            <img
              src={feature.image}
              alt={feature.step as string}
              className="object-cover w-full h-full"
            />
          ) : (
            <Image
              src={feature.image}
              alt={feature.step as string}
              fill
              className="object-cover w-full h-full"
            />
          ))}
      </div>
      <div>
        <h3 className="text-base font-medium tracking-tight text-slate-900">
          {feature.step}
        </h3>
        <p className="mt-2 text-sm text-slate-600">{feature.description}</p>
      </div>
    </li>
  );
}

function FeaturesMobile({
  content,
  isIconView,
}: {
  content: typeof landingpageContent;
  isIconView: boolean;
}) {
  const features = isIconView
    ? content.featureSteps.iconView.steps
    : content.featureSteps.imageView.steps;

  return (
    <div className="-mx-4 mt-20 flex flex-col gap-y-10 overflow-hidden px-4 sm:-mx-6 sm:px-6 lg:hidden">
      {features.map((feature) => (
        <div key={feature.step}>
          {isIconView ? (
            <IconFeature
              feature={feature as Feature}
              className="mx-auto max-w-2xl"
              isActive={true}
            />
          ) : (
            <ImageFeature feature={feature as Feature} />
          )}
          <div className="relative mt-10 pb-10">
            <div className="absolute -inset-x-4 bottom-0 top-8 sm:-inset-x-6" />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturesDesktop({
  content,
  isIconView,
}: {
  content: typeof landingpageContent;
  isIconView: boolean;
}) {
  const features = isIconView
    ? content.featureSteps.iconView.steps
    : content.featureSteps.imageView.steps;

  if (isIconView) {
    return (
      <TabGroup className="hidden lg:mt-20 lg:block">
        {({ selectedIndex }) => (
          <TabList className="grid grid-cols-3 gap-x-8">
            {features.map((feature, featureIndex) => (
              <IconFeature
                key={feature.step}
                feature={{
                  ...(feature as Feature),
                  step: (
                    <Tab className="focus:outline-none">
                      <span className="absolute inset-0" />
                      {feature.step}
                    </Tab>
                  ),
                }}
                isActive={featureIndex === selectedIndex}
                className="relative"
              />
            ))}
          </TabList>
        )}
      </TabGroup>
    );
  } else {
    return (
      <Container className="hidden lg:block lg:mt-20">
        <ol
          role="list"
          className="-mx-3 grid grid-cols-1 gap-y-10 lg:grid-cols-3 lg:text-center xl:-mx-12 xl:divide-x xl:divide-slate-400/20"
        >
          {features.map((feature) => (
            <ImageFeature key={feature.step} feature={feature as Feature} />
          ))}
        </ol>
      </Container>
    );
  }
}

export function FeatureSteps() {
  const content = landingpageContent;
  const isIconView = content.featureSteps.iconView.active;
  const isImageView = content.featureSteps.imageView.active;

  if (!isIconView && !isImageView) {
    return null;
  }

  return (
    <section
      id={content.featureSteps.id}
      aria-label={content.featureSteps.headline}
      className="pb-14 pt-20 sm:pb-20 sm:pt-32 lg:pb-32 bg-stone-50"
    >
      <Container>
        <div className="mx-auto max-w-3xl md:text-center">
          <div className="relative flex flex-wrap justify-center items-center font-semibold text-3xl tracking-tight text-text-900 md:text-5xl">
            <span className="whitespace-nowrap">
              {content.featureSteps.headline}
            </span>
            <span className="mx-2 relative whitespace-nowrap text-accent-400">
              {content.featureSteps.highlightedText}
            </span>
            <span className="whitespace-nowrap">
              {content.featureSteps.suffix}
            </span>
          </div>
          <p className="mt-4 text-lg tracking-tight text-gray-600">
            {content.featureSteps.subheadline}
          </p>
        </div>
        <FeaturesMobile content={content} isIconView={isIconView} />
        <FeaturesDesktop content={content} isIconView={isIconView} />
      </Container>
    </section>
  );
}
