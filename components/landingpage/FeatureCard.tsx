import React from "react";
// import svg from "@/public/landingpage/Vector2.png";

interface FeatureCardProps {
  title: string;
  description: string;
  className?: string;
  background?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  className,
  background,
}) => {
  return (
    <div className={`h-full relative flex flex-col px-1 ${className}`}>
      <div className="h-full flex flex-col grow justify-center text-white max-md:mt-7 relative">
        <div
          className={`flex flex-col px-9 py-16 rounded-xl max-md:px-5 ${background} relative overflow-hidden h-full`}
        >
          {/* SVG Background */}
          {/* <div className="absolute inset-0 z-50 h-full w-full">
            <Image
              src={svg}
              alt="Decorative SVG"
              fill
              quality={100}
              className="object-contain"
            />
          </div> */}
          <h3 className="mt-14 text-3xl font-medium uppercase max-md:mt-10 z-10 relative">
            {title.charAt(0)}
            <span className="lowercase">{title.slice(1)}</span>
          </h3>
          <p className="mt-4 text-lg leading-6 z-10 relative">{description}</p>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
