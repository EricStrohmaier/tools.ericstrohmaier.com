export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_ROOT_DOMAIN;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
