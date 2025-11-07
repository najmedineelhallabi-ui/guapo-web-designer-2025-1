import { Metadata } from "next";

export const metadata: Metadata = {
  title: "À Propos | Guapo Web Designer - Webdesigner Belgique",
  description: "Découvrez Guapo Designer, votre webdesigner professionnel en Belgique. Passion, innovation et créativité pour la création de sites web et sites vitrines modernes.",
  keywords: [
    "guapo web",
    "guapo designer",
    "guapo web designer",
    "web designer",
    "webdesigner belgique",
    "à propos guapo",
    "agence web belgique",
    "designer professionnel"
  ],
  openGraph: {
    title: "À Propos | Guapo Web Designer",
    description: "Découvrez Guapo Designer, votre webdesigner professionnel en Belgique spécialisé en création de sites web.",
    url: "https://guapowebdesigner.com/about",
  },
  alternates: {
    canonical: "/about",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
