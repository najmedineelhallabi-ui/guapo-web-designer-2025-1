import Image from "next/image";
import { ArrowRight, Code, Palette, Sparkles, Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-sm border-b border-border z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">GUAPO</div>
          <div className="hidden md:flex gap-8">
            <a href="#accueil" className="hover:text-primary transition-colors">Accueil</a>
            <a href="#services" className="hover:text-secondary transition-colors">Services</a>
            <a href="#portfolio" className="hover:text-accent transition-colors">Portfolio</a>
            <a href="#contact" className="hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="accueil" className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 text-sm border border-primary/20">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Web Designer Créatif</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              Designer d'Expériences Digitales <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Exceptionnelles</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl">
              Je transforme vos idées en sites web modernes, élégants et performants. 
              Spécialisé en design UI/UX et développement front-end.
            </p>
            <div className="flex gap-4 mt-4">
              <a 
                href="#portfolio" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                Voir mes projets
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/30 rounded-lg hover:bg-primary/5 transition-colors"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Mes <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span></h2>
            <p className="text-muted-foreground text-lg">Ce que je peux faire pour vous</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-background p-8 rounded-xl border border-primary/20 hover:shadow-lg hover:shadow-primary/10 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Design UI/UX</h3>
              <p className="text-muted-foreground">
                Création d'interfaces utilisateur intuitives et attrayantes avec une expérience optimale.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border border-secondary/20 hover:shadow-lg hover:shadow-secondary/10 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Développement Web</h3>
              <p className="text-muted-foreground">
                Développement de sites web modernes avec React, Next.js et les dernières technologies.
              </p>
            </div>

            <div className="bg-background p-8 rounded-xl border border-accent/20 hover:shadow-lg hover:shadow-accent/10 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Design Responsive</h3>
              <p className="text-muted-foreground">
                Sites web parfaitement adaptés à tous les écrans : mobile, tablette et desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Port<span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">folio</span></h2>
            <p className="text-muted-foreground text-lg">Quelques-uns de mes projets récents</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, color: 'from-primary to-secondary' },
              { id: 2, color: 'from-secondary to-accent' },
              { id: 3, color: 'from-accent to-primary' },
              { id: 4, color: 'from-primary via-accent to-secondary' },
              { id: 5, color: 'from-secondary via-primary to-accent' },
              { id: 6, color: 'from-accent via-secondary to-primary' }
            ].map((item) => (
              <div key={item.id} className="group cursor-pointer">
                <div className="aspect-video bg-muted rounded-xl mb-4 overflow-hidden border border-border shadow-lg">
                  <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center group-hover:scale-105 transition-transform opacity-30 group-hover:opacity-50`}>
                    <span className="text-4xl font-bold text-white/50">Projet {item.id}</span>
                  </div>
                </div>
                <h3 className="font-semibold mb-2">Projet Portfolio {item.id}</h3>
                <p className="text-sm text-muted-foreground">Design & Développement Web</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-muted/50 via-primary/5 to-secondary/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Travaillons <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ensemble</span></h2>
          <p className="text-muted-foreground text-lg mb-8">
            Vous avez un projet en tête ? Contactez-moi et discutons de vos besoins.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="mailto:contact@guapo-design.com" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
            >
              <Mail className="w-4 h-4" />
              contact@guapo-design.com
            </a>
          </div>

          <div className="flex gap-6 justify-center">
            <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border border-primary/20 flex items-center justify-center hover:scale-110 transition-transform text-primary-foreground shadow-lg shadow-primary/20">
              <Github className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-accent border border-secondary/20 flex items-center justify-center hover:scale-110 transition-transform text-secondary-foreground shadow-lg shadow-secondary/20">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-primary border border-accent/20 flex items-center justify-center hover:scale-110 transition-transform text-accent-foreground shadow-lg shadow-accent/20">
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto text-center text-muted-foreground">
          <p>© 2025 <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}