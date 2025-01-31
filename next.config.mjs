/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Disable canvas and encoding modules
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;

    // Handle PDF.js worker
    config.resolve.alias["pdfjs-dist/build/pdf.worker.entry"] = false;

    return config;
  },
  transpilePackages: ["@react-pdf/renderer"],
};

export default nextConfig;
