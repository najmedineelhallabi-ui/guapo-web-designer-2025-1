"use client";

import Image from "next/image";
import { ArrowRight, Code, Palette, Sparkles, Mail, Github, Linkedin, Twitter, Heart, Zap } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 backdrop-blur-md border-b border-border z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#accueil" className="flex items-center">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO Web Designer Logo"
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </a>
          <div className="hidden md:flex gap-8 items-center">
            <a href="#accueil" className="hover:text-primary transition-colors">{t("nav.home")}</a>
            <a href="#about" className="hover:text-secondary transition-colors">{t("nav.about")}</a>
            <a href="#services" className="hover:text-secondary transition-colors">{t("nav.services")}</a>
            <a href="#portfolio" className="hover:text-accent transition-colors">{t("nav.portfolio")}</a>
            <a href="#contact" className="hover:text-primary transition-colors">{t("nav.contact")}</a>
            <LanguageSwitcher />
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
              <span>{t("hero.badge")}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl">
              {t("hero.title")} <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">{t("hero.title.highlight")}</span>
            </h1>
            <p className="text-xl text-foreground/80 max-w-2xl">
              {t("hero.subtitle")}
            </p>
            <div className="flex gap-4 mt-4">
              <a 
                href="#portfolio" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity shadow-lg shadow-primary/25"
              >
                {t("hero.cta.projects")}
                <ArrowRight className="w-4 h-4" />
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/30 bg-background/50 backdrop-blur-sm rounded-lg hover:bg-primary/10 transition-colors"
              >
                {t("hero.cta.contact")}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* À propos Section */}
      <section id="about" className="py-20 px-6 bg-gradient-to-br from-accent/20 via-primary/15 to-secondary/20 relative overflow-hidden">
        {/* Decorative background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-20 w-96 h-96 bg-primary/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/20 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          {/* Title */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                {t("about.title")}
              </h2>
              <Sparkles className="w-8 h-8 text-accent animate-pulse" />
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm border-2 border-primary/30 shadow-lg hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary to-secondary">
                <Heart className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("about.values.passion")}</h3>
              <p className="text-foreground/70 leading-relaxed">{t("about.values.passion.desc")}</p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-sm border-2 border-secondary/30 shadow-lg hover:shadow-2xl hover:shadow-secondary/20 hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br from-secondary to-accent">
                <Sparkles className="w-8 h-8 text-secondary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("about.values.innovation")}</h3>
              <p className="text-foreground/70 leading-relaxed">{t("about.values.innovation.desc")}</p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm border-2 border-accent/30 shadow-lg hover:shadow-2xl hover:shadow-accent/20 hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br from-accent to-primary">
                <Zap className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("about.values.performance")}</h3>
              <p className="text-foreground/70 leading-relaxed">{t("about.values.performance.desc")}</p>
            </div>

            <div className="group relative p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/10 backdrop-blur-sm border-2 border-accent/30 shadow-lg hover:shadow-2xl hover:shadow-accent/20 hover:scale-105 hover:rotate-1 transition-all duration-300">
              <div className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary via-secondary to-accent">
                <Palette className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{t("about.values.creativity")}</h3>
              <p className="text-foreground/70 leading-relaxed">{t("about.values.creativity.desc")}</p>
            </div>
          </div>

          {/* Description Block */}
          <div className="grid md:grid-cols-2 gap-12 items-center p-12 rounded-3xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-sm border-2 border-border shadow-2xl relative">
            {/* Background decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-accent/20 rounded-full blur-2xl"></div>

            {/* Text Content */}
            <div className="relative z-10 space-y-6">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t("about.heading")}
              </h3>
              <p className="text-lg text-foreground/80 leading-relaxed">
                {t("about.intro")}
              </p>
              <p className="text-foreground/70 leading-relaxed">
                {t("about.p1")}
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 border border-primary/30 text-sm">
                  {t("about.badge.design")}
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-secondary/20 to-accent/20 border border-accent/30 text-sm">
                  {t("about.badge.performance")}
                </div>
                <div className="px-4 py-2 rounded-full bg-gradient-to-r from-accent/20 to-primary/20 border border-primary/30 text-sm">
                  {t("about.badge.tech")}
                </div>
              </div>
            </div>

            {/* Logo */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-8 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-4 border-2 border-border rounded-2xl"></div>
                <div className="absolute -inset-2 border border-primary/40 rounded-xl"></div>
                
                {/* Logo Image */}
                <div className="relative w-64 h-64 bg-gradient-to-br from-background to-background/50 rounded-2xl shadow-2xl shadow-primary/30 flex items-center justify-center border-4 border-border p-4">
                  <Image 
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                    alt="GUAPO Web Designer"
                    width={240}
                    height={240}
                    className="w-full h-full object-contain"
                  />
                  
                  {/* Sparkle decorations */}
                  <Sparkles className="absolute top-4 right-4 w-6 h-6 text-accent animate-pulse" />
                  <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-secondary animate-pulse" style={{ animationDelay: "0.5s" }} />
                </div>
              </div>
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
            <h2 className="text-4xl font-bold mb-4">{t("services.title")} <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">{t("services.title.highlight")}</span></h2>
            <p className="text-foreground/70 text-lg">{t("services.subtitle")}</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-primary/20 to-primary/5 backdrop-blur-sm p-8 rounded-xl border border-primary/30 hover:shadow-2xl hover:shadow-primary/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Palette className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("services.design.title")}</h3>
              <p className="text-foreground/70">
                {t("services.design.desc")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-secondary/20 to-secondary/5 backdrop-blur-sm p-8 rounded-xl border border-secondary/30 hover:shadow-2xl hover:shadow-secondary/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Code className="w-6 h-6 text-secondary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("services.dev.title")}</h3>
              <p className="text-foreground/70">
                {t("services.dev.desc")}
              </p>
            </div>

            <div className="bg-gradient-to-br from-accent/20 to-accent/5 backdrop-blur-sm p-8 rounded-xl border border-accent/30 hover:shadow-2xl hover:shadow-accent/20 transition-all hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-lg flex items-center justify-center mb-4 shadow-lg">
                <Sparkles className="w-6 h-6 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{t("services.responsive.title")}</h3>
              <p className="text-foreground/70">
                {t("services.responsive.desc")}
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
            <h2 className="text-4xl font-bold mb-4">{t("portfolio.title.prefix")}<span className="bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">{t("portfolio.title.highlight")}</span></h2>
            <p className="text-foreground/70 text-lg">{t("portfolio.subtitle")}</p>
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
          <h2 className="text-4xl font-bold mb-4">{t("contact.title")} <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">{t("contact.title.highlight")}</span></h2>
          <p className="text-foreground/70 text-lg mb-8">
            {t("contact.subtitle")}
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
          <p>© 2025 <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. {t("footer.rights")}</p>
        </div>
      </footer>
    </div>
  );
}