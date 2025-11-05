import Image from "next/image";
import { ArrowRight, Code, Palette, Sparkles, Mail, Github, Linkedin, Twitter } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border-b border-border z-50 shadow-lg">
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
      <section id="accueil" className="pt-32 pb-20 px-6 bg-gradient-to-br from-primary/20 via-secondary/15 to-accent/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/20 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col items-center text-center gap-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/30 via-secondary/30 to-accent/30 text-sm border border-primary/40 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>Guapo Web Designer</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              If you can imagine it, I can <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">design it.</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl">
              Des sites web conçus pour améliorer votre visibilité et professionnaliser votre entreprise
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
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/30 bg-background/50 backdrop-blur-sm rounded-lg hover:bg-primary/10 transition-colors"
              >
                Me contacter
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 px-6 bg-gradient-to-br from-secondary/20 via-accent/15 to-primary/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 right-20 w-64 h-64 bg-secondary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Mes <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Services</span></h2>
            <p className="text-foreground/70 text-lg">Ce que je peux faire pour vous</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm p-8 rounded-xl border border-primary/30 hover:shadow-2xl hover:shadow-primary/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Design UI/UX</h3>
              <p className="text-foreground/70">
                Création d'interfaces utilisateur intuitives et attrayantes avec une expérience optimale.
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-sm p-8 rounded-xl border border-secondary/30 hover:shadow-2xl hover:shadow-secondary/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Code className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Développement Web</h3>
              <p className="text-foreground/70">
                Développement de sites web modernes avec React, Next.js et les dernières technologies.
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm p-8 rounded-xl border border-accent/30 hover:shadow-2xl hover:shadow-accent/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Design Responsive</h3>
              <p className="text-foreground/70">
                Sites web parfaitement adaptés à tous les écrans : mobile, tablette et desktop.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section id="portfolio" className="py-20 px-6 bg-gradient-to-br from-accent/20 via-primary/15 to-secondary/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-96 h-96 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-primary/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Port<span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">folio</span></h2>
            <p className="text-foreground/70 text-lg">Mes projets récents</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Fiscand Business */}
            <a href="https://www.fiscand.business" target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
              <div className="aspect-video bg-white backdrop-blur-sm rounded-xl mb-4 overflow-hidden border border-border shadow-lg flex items-center justify-center p-8">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Capture-d-ecran-2025-10-24-124300-1762369451856.png?width=8000&height=8000&resize=contain"
                  alt="Fiscand Business Logo"
                  width={400}
                  height={200}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Fiscand Business</h3>
              <p className="text-sm text-foreground/60">www.fiscand.business</p>
            </a>

            {/* Salary Business */}
            <a href="https://www.salarybusiness.be" target="_blank" rel="noopener noreferrer" className="group cursor-pointer">
              <div className="aspect-video bg-white backdrop-blur-sm rounded-xl mb-4 overflow-hidden border border-border shadow-lg flex items-center justify-center p-8">
                <Image 
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/LOGO-SALARYBUSINESS-1762369466889.jpg?width=8000&height=8000&resize=contain"
                  alt="Salary Business Logo"
                  width={400}
                  height={200}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-semibold mb-2 text-lg">Salary Business</h3>
              <p className="text-sm text-foreground/60">www.salarybusiness.be</p>
            </a>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-6 bg-gradient-to-br from-primary/25 via-secondary/20 to-accent/25 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/30 rounded-full blur-3xl"></div>
        </div>
        
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl font-bold mb-4">Travaillons <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Ensemble</span></h2>
          <p className="text-foreground/70 text-lg mb-8">
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
      <footer className="py-8 px-6 border-t border-border bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-foreground/70">
          <p>© 2025 <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}