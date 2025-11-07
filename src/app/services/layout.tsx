import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Services | Guapo Web Designer - Création de Sites Web Belgique",
  description: "Services de création de sites web en Belgique : sites vitrines, design responsive, identité visuelle. Guapo Designer pour tous vos projets digitaux.",
  keywords: [
    "guapo web",
    "guapo designer",
    "creation de sites",
    "sites web",
    "site vitrine",
    "webdesigner belgique",
    "services web design",
    "design responsive",
    "création site belgique"
  ],
  openGraph: {
    title: "Services Web Design | Guapo Designer Belgique",
    description: "Création de sites web professionnels, sites vitrines et design responsive en Belgique.",
    url: "https://guapowebdesigner.com/services",
  },
  alternates: {
    canonical: "/services",
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
