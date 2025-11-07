import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/contexts/language-context";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";

import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
export const metadata: Metadata = {
  title: "Guapo Web Designer | Création de Sites Web en Belgique | Webdesigner Professionnel",
  description: "Guapo Web Designer - Agence de création de sites web en Belgique. Webdesigner professionnel spécialisé en sites vitrines, sites web modernes et design UI/UX. Guapo Designer pour tous vos projets digitaux.",
  keywords: [
    "guapo web",
    "guapo designer",
    "guapo web designer",
    "web designer",
    "webdesigner belgique",
    "creation de sites",
    "sites web",
    "site vitrine",
    "création site web belgique",
    "design web belgique",
    "développement web",
    "UI/UX design",
    "site responsive",
    "GUAPO",
    "webdesigner professionnel",
    "identité visuelle",
    "agence web belgique",
    "designer web professionnel"
  ],
  authors: [{ name: "Guapo Web Designer" }],
  creator: "Guapo Web Designer",
  publisher: "Guapo Web Designer",
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
    title: "Guapo Web Designer | Création de Sites Web en Belgique | Webdesigner Professionnel",
    description: "Guapo Web Designer - Webdesigner professionnel en Belgique. Création de sites web, sites vitrines et design UI/UX moderne. Guapo Designer pour votre projet digital.",
    siteName: "Guapo Web Designer",
    images: [
      {
        url: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=1200&height=630&resize=contain",
        width: 1200,
        height: 630,
        alt: "Guapo Web Designer - Logo Webdesigner Belgique",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guapo Web Designer | Création de Sites Web en Belgique",
    description: "Guapo Web Designer - Webdesigner professionnel en Belgique. Création de sites web, sites vitrines et design UI/UX moderne.",
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
        <ErrorReporter />
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
        </LanguageProvider>
      
        <VisualEditsMessenger />
      </body>
    </html>
  );
}