import EmailSignUp from "@/components/landingpage/emailsignup";
import { FeatureSteps } from "@/components/landingpage/FeatureSteps";
import { Hero } from "@/components/landingpage/Hero";
import { MiddleCallToAction } from "@/components/landingpage/MiddleCallToAction";
import { Testimonials } from "@/components/landingpage/Testimonials";

export default async function page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { show: boolean };
}) {
  return (
    <div className="text-text">
      <Hero />
      <FeatureSteps />
      <MiddleCallToAction />
      <Testimonials />
      <EmailSignUp />
    </div>
  );
}
