import ImageCard from "./ImageCard";
import FeatureCard from "./FeatureCard";
import { landingpageContent } from "@/config/landingpage";

export default function ImageSection() {
  const { features } = landingpageContent.imageSection;

  return (
    <div className="w-full flex justify-center items-center flex-col bg-stone-50">
      {[0, 2].map((startIndex) => (
        <section
          key={startIndex}
          className={`w-full max-w-[1159px] max-md:max-w-full ${
            startIndex === 0 ? "mt-20 max-md:mt-10 z-50" : "mt-7"
          }`}
        >
          <div className="flex gap-5 max-md:flex-col">
            {features
              .slice(startIndex, startIndex + 2)
              .map((feature, index) => {
                const isImageCard = !!feature.image;
                return isImageCard ? (
                  <ImageCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    imageSrc={feature.image}
                    className="w-[63%] max-md:ml-0 max-md:w-full"
                  />
                ) : (
                  <FeatureCard
                    key={index}
                    title={feature.title}
                    description={feature.description}
                    background={feature.background}
                    className={`w-[37%] max-md:ml-0 max-md:w-full `}
                  />
                );
              })}
          </div>
        </section>
      ))}
    </div>
  );
}
