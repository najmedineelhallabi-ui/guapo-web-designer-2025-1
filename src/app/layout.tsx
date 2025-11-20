import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";

import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";

export const metadata: Metadata = {
  title: "GUAPO Web Designer | Sites Web Modernes & Professionnels",
  description: "Création de sites web modernes, élégants et performants. Design UI/UX, développement responsive, identité visuelle. Services en Belgique - FR, NL, EN.",
  keywords: [
    "web designer",
    "webdesigner belgique",
    "création site web",
    "création site internet",
    "design web belgique",
    "développeur web belgique",
    "site vitrine",
    "site web sur mesure",
    "développement web",
    "agence web belgique",
    "UI/UX design",
    "design interface utilisateur",
    "site responsive",
    "site mobile friendly",
    "design responsive",
    "GUAPO",
    "webdesigner professionnel",
    "designer web freelance",
    "identité visuelle",
    "charte graphique",
    "création logo",
    "branding",
    "site multilingue",
    "site trilingue FR NL EN",
    "refonte site web",
    "optimisation site web",
    "performance web",
    "site web moderne",
    "site web élégant",
    "site web PME",
    "site web entrepreneur",
    "site web startup",
    "Next.js",
    "React",
    "TypeScript",
    "webdesign coloré",
    "design joyeux",
    "site internet Bruxelles",
    "webdesigner Bruxelles",
    "création site comptable",
    "site web fiduciaire"
  ],
  authors: [{ name: "GUAPO Web Designer" }],
  creator: "GUAPO Web Designer",
  publisher: "GUAPO Web Designer",
  metadataBase: new URL("https://guapowebdesigner.com"),
  alternates: {
    canonical: "/",
    languages: {
      "fr": "/",
      "nl": "/",
      "en": "/",
    },
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    alternateLocale: ["nl_BE", "en_US"],
    url: "https://guapowebdesigner.com",
    title: "GUAPO Web Designer | Sites Web Modernes & Professionnels",
    description: "Création de sites web modernes, élégants et performants. Design UI/UX, développement responsive, identité visuelle.",
    siteName: "GUAPO Web Designer",
    images: [
      {
        url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=1200&height=630&resize=contain",
        width: 1200,
        height: 630,
        alt: "GUAPO Web Designer Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GUAPO Web Designer | Sites Web Modernes & Professionnels",
    description: "Création de sites web modernes, élégants et performants. Design UI/UX, développement responsive, identité visuelle.",
    images: ["https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=1200&height=630&resize=contain"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <head>
        {/* Langues alternatives */}
        <link rel="alternate" hrefLang="fr" href="https://guapowebdesigner.com" />
        <link rel="alternate" hrefLang="nl" href="https://guapowebdesigner.com" />
        <link rel="alternate" hrefLang="en" href="https://guapowebdesigner.com" />
        <link rel="alternate" hrefLang="x-default" href="https://guapowebdesigner.com" />
        
        {/* Favicon - using PNG logo */}
        <link rel="icon" type="image/png" href="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=32&height=32&resize=contain" />
        
        {/* JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "name": "GUAPO Web Designer",
              "image": "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png",
              "description": "Création de sites web modernes, élégants et performants. Design UI/UX, développement responsive, identité visuelle.",
              "url": "https://guapowebdesigner.com",
              "email": "info@guapowebdesigner.com",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "BE"
              },
              "sameAs": [
                "https://www.instagram.com/guapo.webdesigner/"
              ],
              "priceRange": "€€",
              "areaServed": {
                "@type": "Country",
                "name": "Belgium"
              },
              "availableLanguage": ["French", "Dutch", "English"]
            })
          }}
        />
      </head>
      <body className="antialiased">
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <LanguageProvider>
          {children}
          <Toaster />
          <CookieConsentBanner />
        </LanguageProvider>
      
        <VisualEditsMessenger />
      </body>
    </html>
  );
}