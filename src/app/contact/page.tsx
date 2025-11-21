"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Mail, Instagram, Menu, X, FileText } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";

export default function ContactPage() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Laser Lines Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="laser-line" style={{ left: '10%', animationDelay: '0s' }}></div>
        <div className="laser-line laser-line-secondary" style={{ left: '25%', animationDelay: '2s' }}></div>
        <div className="laser-line laser-line-accent" style={{ left: '40%', animationDelay: '4s' }}></div>
        <div className="laser-line" style={{ left: '55%', animationDelay: '1s' }}></div>
        <div className="laser-line laser-line-secondary" style={{ left: '70%', animationDelay: '3s' }}></div>
        <div className="laser-line laser-line-accent" style={{ left: '85%', animationDelay: '5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center">
            <Image 
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO Web Designer Logo"
              width={120}
              height={60}
              className="h-12 w-auto object-contain"
              priority
            />
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-8 items-center">
            <a href="/#accueil" className="hover:text-primary transition-colors">{t("nav.home")}</a>
            <a href="/#about" className="hover:text-secondary transition-colors">{t("nav.about")}</a>
            <a href="/#portfolio" className="hover:text-accent transition-colors">{t("nav.portfolio")}</a>
            <a href="/#services" className="hover:text-secondary transition-colors">{t("nav.services")}</a>
            <a 
              href="/devis" 
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent via-secondary to-primary text-white rounded-lg hover:scale-105 hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 font-semibold"
            >
              <FileText className="w-4 h-4" />
              Devis gratuit
            </a>
            <a href="/#contact" className="text-primary font-semibold transition-colors">{t("nav.contact")}</a>
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-primary/10 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-primary" />
            ) : (
              <Menu className="w-6 h-6 text-primary" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-md border-b border-border shadow-lg">
            <div className="flex flex-col gap-4 px-6 py-6">
              <a 
                href="/#accueil" 
                className="hover:text-primary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.home")}
              </a>
              <a 
                href="/#about" 
                className="hover:text-secondary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.about")}
              </a>
              <a 
                href="/#portfolio" 
                className="hover:text-accent transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.portfolio")}
              </a>
              <a 
                href="/#services" 
                className="hover:text-secondary transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.services")}
              </a>
              <a 
                href="/devis" 
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-accent via-secondary to-primary text-white rounded-lg hover:scale-105 transition-all font-semibold justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                <FileText className="w-4 h-4" />
                Devis gratuit
              </a>
              <a 
                href="/#contact" 
                className="text-primary font-semibold py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("nav.contact")}
              </a>
              <div className="pt-2 border-t border-border">
                <LanguageSwitcher />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Contact Section - DARK PURPLE */}
      <section className="pt-32 pb-20 px-6 bg-gradient-to-br from-background via-secondary/20 to-accent/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Mobile circles */}
          <div className="md:hidden absolute top-10 left-5 w-56 h-56 bg-primary/50 rounded-full blur-md animate-pulse"></div>
          <div className="md:hidden absolute bottom-10 right-5 w-64 h-64 bg-secondary/50 rounded-full blur-md animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-accent/50 rounded-full blur-md animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          
          {/* Tablet circles */}
          <div className="hidden md:block lg:hidden absolute top-10 left-10 w-64 h-64 bg-primary/50 rounded-full blur-2xl animate-pulse"></div>
          <div className="hidden md:block lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-secondary/50 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 bg-accent/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
          
          {/* Desktop circles */}
          <div className="hidden lg:block absolute top-10 left-1/4 w-72 h-72 bg-primary/50 rounded-full blur-2xl animate-pulse"></div>
          <div className="hidden lg:block absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/50 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/40 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Contactez-nous
            </h2>
            <h3 className="text-2xl font-semibold text-foreground mb-6">
              Transformons vos idées en réalité digitale
            </h3>
            <p className="text-lg text-foreground/90 mb-12 leading-relaxed max-w-2xl mx-auto">
              Un projet en tête ? N'hésitez pas à nous contacter pour en discuter. Nous serons ravis de vous accompagner dans la création de votre site web.
            </p>
          </div>
          
          {/* Contact Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <a 
              href="mailto:info@guapowebdesigner.com" 
              className="group p-8 bg-gradient-to-br from-primary/10 to-primary/5 backdrop-blur-sm border-2 border-primary/30 rounded-2xl hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all"
            >
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br from-primary to-secondary">
                <Mail className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Email</h3>
              <p className="text-primary font-semibold text-lg">info@guapowebdesigner.com</p>
            </a>

            <a 
              href="https://www.instagram.com/guapo_webdesigner/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group p-8 bg-gradient-to-br from-accent/10 to-accent/5 backdrop-blur-sm border-2 border-accent/30 rounded-2xl hover:shadow-2xl hover:shadow-accent/20 hover:scale-105 transition-all"
            >
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br from-accent to-secondary">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Instagram</h3>
              <p className="text-accent font-semibold text-lg">@guapo_webdesigner</p>
            </a>

            <a 
              href="/devis" 
              className="group p-8 bg-gradient-to-br from-secondary/10 to-secondary/5 backdrop-blur-sm border-2 border-secondary/30 rounded-2xl hover:shadow-2xl hover:shadow-secondary/20 hover:scale-105 transition-all"
            >
              <div className="w-16 h-16 rounded-xl mb-4 flex items-center justify-center shadow-lg bg-gradient-to-br from-secondary via-accent to-primary">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-foreground">Devis Gratuit</h3>
              <p className="text-secondary font-semibold text-lg">Obtenez une estimation</p>
            </a>
          </div>
        </div>
      </section>

      {/* Footer - DARK PURPLE */}
      <footer className="py-12 px-6 border-t border-border bg-card/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1: Brand */}
            <div>
              <h3 className="font-bold text-lg mb-3 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Guapo Web Designer
              </h3>
              <p className="text-foreground/80 text-sm leading-relaxed">
                Nous créons des designs colorés et joyeux qui donnent vie à vos projets digitaux.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="font-semibold text-base mb-3">Liens rapides</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/#portfolio" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Portfolio
                  </a>
                </li>
                <li>
                  <a href="/#services" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Services
                  </a>
                </li>
                <li>
                  <a href="/#contact" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Contact
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <h3 className="font-semibold text-base mb-3">Informations légales</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/politique-confidentialite" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales" className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Mentions légales
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Social */}
            <div>
              <h3 className="font-semibold text-base mb-3">Suivez-nous</h3>
              <a 
                href="https://www.instagram.com/guapo_webdesigner/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-foreground/80 hover:text-primary transition-colors text-sm flex items-center gap-2"
              >
                <Instagram className="w-4 h-4" />
                <span>Instagram</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-border text-center">
            <p className="text-foreground/80 text-sm">
              © 2025 <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}