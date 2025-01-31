import { Container } from "@/components/ui/container";
import HeroCTA from "./herocta";
import { landingpageContent } from "@/config/landingpage";
import Image from "next/image";
// import svg from "@/public/landingpage/Vector5.svg";

export function Hero({ isMarketplace = false }) {
  const content = landingpageContent;

  return (
    <div className="relative overflow-hidden h-full flex flex-col justify-between">
      {/* SVG Image */}
      {/* <div className="absolute bottom-0 left-0 w-full h-[90%] z-[-1]">
        <Image
          src={svg}
          alt="Decorative SVG"
          fill
          quality={100}
          className="object-cover opacity-80"
        />
      </div> */}

      {/* Main Content Container */}
      <Container className="relative flex flex-col justify-center items-center pb-16 pt-12 text-center lg:pt-40 min-h-[700px] h-full">
        <h1 className="text-xl text-center text-gray-600">
          {content.hero.preHeadline}
        </h1>
        <h1 className="mx-auto md:max-w-8xl w-full text-5xl md:text-8xl max-md:leading-10 font-medium tracking-tight text-text">
          {content.hero.headline}
          <div className="relative whitespace-nowrap text-accent-400">
            <span className=" relative">{content.hero.highlightedText}</span>
          </div>{" "}
          {content.hero.suffix}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg tracking-tight text-gray-600">
          {content.hero.subheadline}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <HeroCTA content={content} />
        </div>
        {content.hero.socialCare.active && (
          <div className="flex gap-5 justify-center items-center mt-12 text-base md:text-xl text-black max-md:flex-wrap max-md:mt-10">
            <Image
              loading="lazy"
              src={content.hero.socialCare.image}
              alt={content.hero.socialCare.text}
              className="shrink-0 md:w-[172px] w-[100px] max-md:w-[80px] aspect-[2.94]"
            />
            <p className="my-auto text-gray-600">
              <span className="font-medium">
                {content.hero.socialCare.fatPrefix}
              </span>{" "}
              {content.hero.socialCare.text}
            </p>
          </div>
        )}
      </Container>
    </div>
  );
}
