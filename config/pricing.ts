const pricing = {
  // pricing section
  stripe: {
    id: "pricing",
    title: "Simple Pricing",
    heading: "Elevate Your Slack Presence",
    subheadline:
      "Choose the plan that fits your needs and boost your productivity",
    buttonText: "Get Started 🚀",
    plans: [
      {
        name: "Monthly Pro",
        description: "Flexible monthly subscription",
        price: 4.99,
        priceAnchor: "7.99",
        pricePer: "workspace/month",
        currency: "EUR",
        features: [
          { name: "Always appear online in Slack" },
          { name: "Modern, user-friendly dashboard" },
          { name: "Automatic status updates" },
          { name: "Support for one workspace" },
        ],
      },
      {
        name: "Annual Pro",
        description: "Save with yearly billing",
        price: 39.99,
        priceAnchor: "59.99",
        pricePer: "workspace/year",
        currency: "EUR",
        features: [
          { name: "All Monthly Pro features" },
          { name: "33% savings compared to monthly" },
          { name: "Priority customer support" },
          { name: "Early access to new features" },
        ],
      },
      {
        isFeatured: true,
        name: "Lifetime Access",
        description: "One-time payment for unlimited access",
        price: 59.99,
        priceAnchor: "99.99",
        pricePer: "workspace",
        currency: "EUR",
        features: [
          { name: "All Annual Pro features" },
          { name: "Never pay again" },
          { name: "Lifetime updates and support" },
          { name: "VIP customer service" },
        ],
      },
    ],
  },
};

export default pricing;
