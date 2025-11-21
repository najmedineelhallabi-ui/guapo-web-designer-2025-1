import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Devis Gratuit | GUAPO Web Designer - Estimation Site Web",
  description: "Demandez votre devis gratuit pour la création de votre site web. Site vitrine, e-commerce, sur mesure. Réponse rapide sous 24-48h. Premier mois de maintenance offert !",
  keywords: [
    "devis site web",
    "estimation site internet",
    "prix site web",
    "devis gratuit",
    "tarif site web",
    "création site belgique",
    "prix web designer",
    "devis web designer",
    "estimation web",
    "prix création site",
    "tarif webdesigner belgique",
  ],
  openGraph: {
    title: "Devis Gratuit | GUAPO Web Designer",
    description: "Obtenez votre devis gratuit pour votre site web. Premier mois de maintenance offert !",
    url: "https://guapowebdesigner.com/devis",
    type: "website",
  },
  alternates: {
    canonical: "/devis",
  },
};

export default function DevisLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
