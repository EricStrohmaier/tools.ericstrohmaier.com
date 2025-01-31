import { Container } from "@/components/ui/container";
import { landingpageContent } from "@/config/landingpage";

export const DemoVideo = () => {
  return (
    <section className="pb-16">
      <Container>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-text mb-4">
            {landingpageContent.demoVideo.title}
          </h2>

          <div className="aspect-w-16 aspect-h-9">
            <video
              className="w-full h-full rounded-lg shadow-lg border-2 border-gray-300"
              controls
              autoPlay
              muted
              loop
              preload="metadata"
            >
              <source src={landingpageContent.demoVideo.src} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </Container>
    </section>
  );
};
