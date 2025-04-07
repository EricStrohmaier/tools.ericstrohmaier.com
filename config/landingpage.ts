import code from "@/public/landingpage/code.jpg";
import code2 from "@/public/landingpage/code2.jpg";
import avatarImage1 from "@/public/landingpage/avatars/avatar-1.png";
import avatarImage2 from "@/public/landingpage/avatars/avatar-2.png";
import avatarImage3 from "@/public/landingpage/avatars/avatar-3.png";
import avatarImage4 from "@/public/landingpage/avatars/avatar-4.png";
import avatarImage5 from "@/public/landingpage/avatars/avatar-5.png";
import backgroundImageMiddleCTA from "@/public/landingpage/bluebackgroundtree.jpg";
import abstractBackgroundImage from "@/public/landingpage/abstract-background.png";
import socialcareImg from "@/public/landingpage/socialcare.png";
import logo from "@/public/icon.png";
import { siteConfig } from "./site";

export const landingpageContent = {
  header: {
    company: {
      name: siteConfig.name,
      logo: logo,
      logoHref: "/",
    },
    button: {
      active: true,
      text: "Get Started",
      href: "/signin",
    },
    NavAndFooterLinks: [
      {
        active: true,
        text: "Tracker",
        href: "/tracker",
      },
      {
        active: false,
        text: "Setup",
        href: "#setup",
      },
      {
        active: false,
        text: "Features",
        href: "#features",
      },
    ],
  },
  // hero section
  hero: {
    preHeadline: "",
    headline: "How I Jump Start Projects",
    highlightedText: "",
    suffix: "",
    subheadline:
      "Kickstart your project with an easy-to-use template for rapid landing page validation and development.",
    socialCare: {
      active: true,
      image: socialcareImg,
      fatPrefix: "4k+ ",
      text: "members already joined",
    },
    // todo make a main cta object
    // that controlls all the cta sections
    // if email or link (example)
    cta: {
      actions: {
        email: {
          active: true,
          placeholder: "Enter your email for updates",
        },
        links: {
          howItWorks: {
            active: false,
            text: "Learn More",
            link: "#setup",
          },
        },
      },
      button: {
        text: "Get Started",
        link: "/signup",
      },
    },
  },

  // problem section 1st outline the problem
  imageSection: {
    id: "image-section",
    features: [
      {
        title: "Pre-built Components",
        description:
          "Utilize a library of pre-built components to speed up your development process.",
        image: "",
        background: "bg-stone-900",
      },
      {
        title: "Responsive Design",
        description:
          "Ensure your landing page looks great on all devices with responsive design principles.",
        image: code,
        background: "",
      },
      {
        title: "Customizable Templates",
        description:
          "Easily customize templates to match your brand and project requirements.",
        image: code2,
        background: "",
      },
      {
        title: "SEO Optimized",
        description:
          "Improve your search engine ranking with SEO best practices integrated into the boilerplate.",
        image: "",
        background: "bg-accent",
      },
    ],
  },

  // benefits of the product
  benefitsFeature: {
    id: "features",
    headline: "Why Choose This",
    highlightedText: "Boilerplate",
    suffix: "Setup",
    subheadline:
      "Experience the ease and efficiency of starting your project with our comprehensive boilerplate.",
    features: [
      {
        title: "Quick Setup",
        description:
          "Clone the repository, install dependencies, and start your server in minutes.",
        image: code,
      },
      {
        title: "Seamless Integration",
        description:
          "Easily integrate with Supabase for authentication, database management, and more.",
        image: code2,
      },
      {
        title: "Optimized for Development",
        description:
          "Pre-configured settings and tools to streamline your development process.",
        image: code,
      },
      {
        title: "Landing Page Validation",
        description:
          "Validate your landing page concepts quickly with built-in components and templates.",
        image: code2,
      },
    ],
  },

  // features/steps section
  featureSteps: {
    id: "setup",
    headline: "Get Started",
    highlightedText: "in 3 Simple Steps",
    suffix: "",
    subheadline:
      "Follow these steps to set up your Next.js and Supabase project effortlessly.",
    iconView: {
      active: false,
      steps: [
        {
          step: "Clone the Repository",
          summary: "Get the codebase locally.",
          description: "Use Git to clone the repository to your local machine.",
          iconKey: "clone",
        },
        {
          step: "Install Dependencies",
          summary: "Set up your project environment.",
          description:
            "Run `npm install` to install all necessary dependencies.",
          iconKey: "install",
        },
        {
          step: "Start the Development Server",
          summary: "Launch your project.",
          description:
            "Run `npm run dev` to start the development server and see your project in action.",
          iconKey: "start",
        },
      ],
    },
    imageView: {
      active: true,
      steps: [
        {
          // step is the title
          step: "Clone the Repository",
          description: "Use Git to clone the repository to your local machine.",
          image: abstractBackgroundImage,
        },
        {
          step: "Install Dependencies",
          summary: "Set up your project environment.",
          description:
            "Run `npm install` to install all necessary dependencies.",
          image: abstractBackgroundImage,
        },
        {
          step: "Start the Development Server",
          summary: "Launch your project.",
          description:
            "Run `npm run dev` to start the development server and see your project in action.",
          image: abstractBackgroundImage,
        },
      ],
    },
  },

  // middle cta
  middleCTA: {
    active: true,
    id: "get-started-today",
    headline: "Ready to Get Started?",
    subheadline:
      "Join our community and start building your Next.js and Supabase project today.",
    button: {
      className: "bg-accent",
      text: "Sign Up",
      href: "/signup",
    },
    textColor: "text-white",
    backgroundImage: backgroundImageMiddleCTA,
  },

  // Testimonials
  testimonials: {
    active: true,
    id: "testimonials",
    headline: "What People Say",
    highlightedText: "About Us",
    suffix: "",
    subheadline:
      "Hear what our users have to say about their experience with our boilerplate.",
    testimonials: [
      [
        {
          content:
            "TaxPal is so easy to use I can’t help but wonder if it’s really doing the things the government expects me to do.",
          author: {
            name: "Sheryl Berge",
            role: "CEO at Lynch LLC",
            image: avatarImage1,
          },
        },
        {
          content:
            "I’m trying to get a hold of someone in support, I’m in a lot of trouble right now and they are saying it has something to do with my books. Please get back to me right away.",
          author: {
            name: "Amy Hahn",
            role: "Director at Velocity Industries",
            image: avatarImage4,
          },
        },
      ],
      [
        {
          content:
            "The best part about TaxPal is every time I pay my employees, my bank balance doesn’t go down like it used to. Looking forward to spending this extra cash when I figure out why my card is being declined.",
          author: {
            name: "Leland Kiehn",
            role: "Founder of Kiehn and Sons",
            image: avatarImage5,
          },
        },
        {
          content:
            "There are so many things I had to do with my old software that I just don’t do at all with TaxPal. Suspicious but I can’t say I don’t love it.",
          author: {
            name: "Erin Powlowski",
            role: "COO at Armstrong Inc",
            image: avatarImage2,
          },
        },
      ],
      [
        {
          content:
            "I used to have to remit tax to the EU and with TaxPal I somehow don’t have to do that anymore. Nervous to travel there now though.",
          author: {
            name: "Peter Renolds",
            role: "Founder of West Inc",
            image: avatarImage3,
          },
        },
        {
          content:
            "This is the fourth email I’ve sent to your support team. I am literally being held in jail for tax fraud. Please answer your damn emails, this is important.",
          author: {
            name: "Amy Hahn",
            role: "Director at Velocity Industries",
            image: avatarImage4,
          },
        },
      ],
    ],
  },

  // partner companies section
  partnerCompanies: {
    active: false,
    id: "partner-companies",
    headline: "Trusted by leading",
    highlightedText: "financial institutions",
    suffix: "",
    subheadline:
      "We're proud to work with some of the most respected names in the industry.",
    companies: [
      { name: "Global Bank", logo: "/images/logos/global-bank.svg" },
      {
        name: "Secure Investments",
        logo: "/images/logos/secure-investments.svg",
      },
      { name: "Trust Financial", logo: "/images/logos/trust-financial.svg" },
      {
        name: "Fidelity Partners",
        logo: "/images/logos/fidelity-partners.svg",
      },
      {
        name: "Pinnacle Insurance",
        logo: "/images/logos/pinnacle-insurance.svg",
      },
    ],
  },

  // last Call to Action
  emailSignUp: {
    id: "email-sign-up",
    headline: "Stay Updated",
    highlightedText: "with Our Progress",
    suffix: "",
    subheadline:
      "Enter your email to receive the latest updates and features for our Next.js and Supabase boilerplate.",
    placeholder: "Enter your email",
    buttonText: "Subscribe",
  },

  demoVideo: {
    src: "/Salackactivity_demo_movie.mov",
    title: "",
  },

  fancyContent: {
    id: "appear-active",
    headline: "Appear Active on Slack",
    highlightedText: "",
    suffix: "",
    description: `
    Slack sets you to 'away' after 30 minutes of no activity, making you seem unavailable. Our App fixes that — keeping your status active and online every 5 minutes, even when you're not at your desk. Stay visible, stay engaged, and never worry about going offline again! Now, you can stay online and available all day. Take charge of your status and eliminate the hassle of appearing inactive!
    `,
  },
  footer: {
    links: {
      main: [{ name: "Support", href: "/contact" }],
      legal: [
        { name: "Terms of services", href: "/terms" },
        { name: "Privacy policy", href: "/privacy-policy" },
      ],
      products: [
        {
          name: "Time Tracker | with Chrome Extension",
          target: "_blank",
          href: `/tracker?ref=${siteConfig.domain}`,
        },
        {
          name: "Personal Website",
          target: "_blank",
          href: `https://ericstrohmaier.com/?ref=${siteConfig.domain}`,
        },
        {
          name: "Slackactivity",
          target: "_blank",
          href: `https://slackactivity.com/?ref=${siteConfig.domain}`,
        },
        {
          name: "Local Boards",
          target: "_blank",
          href: `https://local-boards.com/?ref=${siteConfig.domain}`,
        },
        {
          name: "Odd Pillow",
          target: "_blank",
          href: `https://oddpillow.com/?ref=${siteConfig.domain}`,
        },
      ],
    },
  },
};
