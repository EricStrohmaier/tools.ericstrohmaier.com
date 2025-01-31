import EmailForm from "@/components/landingpage/EmailForm";
import { landingpageContent } from "@/config/landingpage";
// import BackgroundSVG from "@/public/landingpage/Vector4.svg";

export default function EmailSignUp({ isMarketplace = false }) {
  const content = landingpageContent;

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative isolate overflow-hidden bg-stone-200 px-6 py-24 sm:rounded-3xl sm:px-24 xl:py-32">
          {/* <Image
            src={BackgroundSVG}
            alt="Decorative SVG"
            fill
            quality={100}
            className="absolute top-0 left-0 w-full h-full z-[-1] object-cover opacity-80"
          /> */}
          <div className="relative flex flex-wrap justify-center items-center font-semibold text-3xl tracking-tight text-text-900 md:text-5xl">
            <span className="whitespace-nowrap">
              {content.emailSignUp.headline}
            </span>
            <span className="mx-2 relative whitespace-nowrap text-accent-400">
              {content.emailSignUp.highlightedText}
            </span>
            <span className="whitespace-nowrap">
              {content.emailSignUp.suffix}
            </span>
          </div>
          <p className="mx-auto mt-2 max-w-xl text-center text-lg leading-8 text-gray-600">
            {content.emailSignUp.subheadline}
          </p>
          <EmailForm />
        </div>
      </div>
    </div>
  );
}
