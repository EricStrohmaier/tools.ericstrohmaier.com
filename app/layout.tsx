import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

import { Header } from "@/components/landingpage/header";
import { createClient } from "@/utils/supabase/server";
import { Provider } from "@/components/Provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/landingpage/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "",
  description: "",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="en">
      <head>
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="8aa1afc7-b3eb-460c-ab50-fd386289cdaa"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-2706727138311810"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`h-full ${inter.className}`}>
        <Provider>
          <div className="flex flex-col w-full h-full bg-background">
            <Header user={user as any} />
            <main className="flex-auto">{children}</main>
          </div>
          <Footer />
          <Toaster richColors theme="light" closeButton />
        </Provider>
      </body>
    </html>
  );
}
