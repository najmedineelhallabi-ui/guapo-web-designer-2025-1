"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Mail, Instagram, Copy, FileText } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

export default function ContactPage() {
  const { t } = useLanguage();

  const copyToClipboard = (text: string, type: "email" | "instagram") => {
    navigator.clipboard.writeText(text);
    toast.success(
      type === "email" ? "Email copié !" : "Handle Instagram copié !"
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#6C63FF]/10 via-[#00D1FF]/5 to-[#4BE3C1]/10 relative overflow-hidden">
      {/* Animated background circles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#6C63FF]/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-40 right-20 w-96 h-96 bg-[#00D1FF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#4BE3C1]/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-[#6C63FF]/10 via-[#00D1FF]/10 to-[#4BE3C1]/10 backdrop-blur-md border-b border-white/20 z-50 shadow-lg shadow-[#00D1FF]/10">
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
          <div className="hidden md:flex gap-8 items-center">
            <a href="/#accueil" className="hover:text-[#6C63FF] transition-colors">{t("nav.home")}</a>
            <a href="/#about" className="hover:text-[#00D1FF] transition-colors">{t("nav.about")}</a>
            <a href="/#portfolio" className="hover:text-[#4BE3C1] transition-colors">{t("nav.portfolio")}</a>
            <a href="/#services" className="hover:text-[#00D1FF] transition-colors">{t("nav.services")}</a>
            <a href="/#contact" className="text-[#6C63FF] font-semibold">{t("nav.contact")}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#5A3BEF] to-[#00D1FF] bg-clip-text text-transparent mb-6">
              Contactez-nous
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-6">
              Transformons vos idées en réalité digitale
            </h2>
            <p className="text-lg text-foreground/80 max-w-2xl mx-auto leading-relaxed">
              Un projet en tête ? N'hésitez pas à nous contacter pour en discuter. Nous serons ravis de vous accompagner dans la création de votre site web.
            </p>
          </div>

          {/* Contact Boxes */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Email Box */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#00D1FF]/50 shadow-2xl shadow-[#00D1FF]/30 hover:shadow-[#00D1FF]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D1FF]/30 to-[#4BE3C1]/30 rounded-bl-full blur-2xl group-hover:blur-3xl transition-all"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D1FF] to-[#4BE3C1] flex items-center justify-center mb-6 shadow-lg shadow-[#00D1FF]/50 group-hover:rotate-6 transition-transform duration-300 mx-auto">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-[#00D1FF]">Email</h3>
                
                <div className="mb-6">
                  <div className="text-4xl mb-3">✉️</div>
                  <a 
                    href="mailto:info@guapowebdesigner.com"
                    className="text-lg font-medium block hover:text-[#00D1FF] transition-colors"
                  >
                    info@guapowebdesigner.com
                  </a>
                </div>
                
                <button
                  onClick={() => copyToClipboard("info@guapowebdesigner.com", "email")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#4BE3C1] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D1FF]/40 hover:shadow-[#4BE3C1]/50 font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
              </div>
            </div>

            {/* Instagram Box */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#4BE3C1]/50 shadow-2xl shadow-[#4BE3C1]/30 hover:shadow-[#4BE3C1]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4BE3C1]/30 to-[#00D1FF]/30 rounded-bl-full blur-2xl group-hover:blur-3xl transition-all"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4BE3C1] to-[#00D1FF] flex items-center justify-center mb-6 shadow-lg shadow-[#4BE3C1]/50 group-hover:rotate-6 transition-transform duration-300 mx-auto">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-[#4BE3C1]">Instagram</h3>
                
                <div className="mb-6">
                  <div className="text-4xl mb-3">📸</div>
                  <a 
                    href="https://www.instagram.com/guapo_webdesigner/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-medium block hover:text-[#4BE3C1] transition-colors"
                  >
                    @guapo_webdesigner
                  </a>
                </div>
                
                <button
                  onClick={() => copyToClipboard("@guapo_webdesigner", "instagram")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4BE3C1] to-[#00D1FF] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#4BE3C1]/40 hover:shadow-[#00D1FF]/50 font-semibold"
                >
                  <Copy className="w-4 h-4" />
                  Copier
                </button>
              </div>
            </div>

            {/* Devis Box */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#6C63FF]/50 shadow-2xl shadow-[#6C63FF]/30 hover:shadow-[#6C63FF]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#6C63FF]/30 to-[#5A3BEF]/30 rounded-bl-full blur-2xl group-hover:blur-3xl transition-all"></div>
              
              <div className="relative z-10 text-center">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#6C63FF] to-[#5A3BEF] flex items-center justify-center mb-6 shadow-lg shadow-[#6C63FF]/50 group-hover:rotate-6 transition-transform duration-300 mx-auto">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-6 text-[#6C63FF]">Devis Gratuit</h3>
                
                <div className="mb-6">
                  <div className="text-4xl mb-3">📋</div>
                  <p className="text-lg font-medium">
                    Obtenez un devis personnalisé pour votre projet
                  </p>
                </div>
                
                <a
                  href="/devis"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#6C63FF] to-[#5A3BEF] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#6C63FF]/40 hover:shadow-[#5A3BEF]/50 font-semibold"
                >
                  <FileText className="w-4 h-4" />
                  Demander un devis
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-border bg-gradient-to-r from-[#6C63FF]/10 via-[#00D1FF]/10 to-[#4BE3C1]/10 backdrop-blur-sm mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
            {/* Column 1: Brand */}
            <div>
              <p className="text-foreground/70 text-sm">
                © 2025 <span className="bg-gradient-to-r from-[#6C63FF] via-[#00D1FF] to-[#4BE3C1] bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <ul className="space-y-2">
                <li>
                  <a href="/#portfolio" className="text-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Portfolio
                  </a>
                </li>
                <li>
                  <a href="/#services" className="text-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Services
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal */}
            <div>
              <ul className="space-y-2">
                <li>
                  <a href="/politique-confidentialite" className="text-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Politique de confidentialité
                  </a>
                </li>
                <li>
                  <a href="/mentions-legales" className="text-foreground/70 hover:text-primary transition-colors text-sm flex items-center gap-2">
                    <span>→</span> Mentions légales
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="text-center text-foreground/70 text-xs pt-6 border-t border-border">
            Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}