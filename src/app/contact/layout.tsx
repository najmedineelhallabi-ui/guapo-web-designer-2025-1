import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Guapo Web Designer - Contactez votre Webdesigner en Belgique",
  description: "Contactez Guapo Web Designer pour votre projet de site web ou site vitrine en Belgique. Email: info@guapowebdesigner.com",
  keywords: [
    "guapo web",
    "guapo designer",
    "contact webdesigner",
    "webdesigner belgique",
    "creation de sites",
    "devis site web",
    "contact guapo"
  ],
  openGraph: {
    title: "Contact | Guapo Web Designer Belgique",
    description: "Contactez-nous pour votre projet de site web en Belgique. Transformons vos idées en réalité digitale.",
    url: "https://guapowebdesigner.com/contact",
  },
  alternates: {
    canonical: "/contact",
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
