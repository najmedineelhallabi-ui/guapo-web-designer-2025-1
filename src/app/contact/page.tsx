"use client";

import { useState } from "react";
import Image from "next/image";
import { Sparkles, Mail, Instagram, ArrowRight } from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { toast } from "sonner";

export default function ContactPage() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const copyToClipboard = (text: string, type: "email" | "instagram") => {
    navigator.clipboard.writeText(text);
    toast.success(
      type === "email" ? t("contact.email.copied") : t("contact.instagram.copied")
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(t("contact.form.success"));
    setIsSubmitting(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
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
            <a href="/contact" className="text-[#6C63FF] font-semibold">{t("nav.contact")}</a>
            <LanguageSwitcher />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-20 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Sparkles className="w-10 h-10 text-[#6C63FF] animate-pulse" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#5A3BEF] to-[#00D1FF] bg-clip-text text-transparent">
                {t("contact.page.title")}
              </h1>
              <Sparkles className="w-10 h-10 text-[#4BE3C1] animate-pulse" style={{ animationDelay: "0.5s" }} />
            </div>
            <p className="text-xl text-foreground/80 max-w-2xl mx-auto">
              {t("contact.page.intro")}
            </p>
          </div>

          {/* Contact Boxes */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {/* Email Box */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#00D1FF]/50 shadow-2xl shadow-[#00D1FF]/30 hover:shadow-[#00D1FF]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00D1FF]/30 to-[#4BE3C1]/30 rounded-bl-full blur-2xl group-hover:blur-3xl transition-all"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#00D1FF] to-[#4BE3C1] flex items-center justify-center mb-6 shadow-lg shadow-[#00D1FF]/50 group-hover:rotate-6 transition-transform duration-300">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-[#00D1FF]">{t("contact.email.title")}</h3>
                
                <a 
                  href="mailto:info@guapowebdesigner.com"
                  className="text-lg mb-6 block hover:text-[#00D1FF] transition-colors break-all"
                >
                  {t("contact.email.address")}
                </a>
                
                <button
                  onClick={() => copyToClipboard(t("contact.email.address"), "email")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#00D1FF] to-[#4BE3C1] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D1FF]/40 hover:shadow-[#4BE3C1]/50"
                >
                  {t("contact.email.copy")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Instagram Box */}
            <div className="group relative p-8 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#4BE3C1]/50 shadow-2xl shadow-[#4BE3C1]/30 hover:shadow-[#4BE3C1]/50 hover:scale-105 hover:-translate-y-2 transition-all duration-500">
              <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              
              {/* Decorative corner */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#4BE3C1]/30 to-[#00D1FF]/30 rounded-bl-full blur-2xl group-hover:blur-3xl transition-all"></div>
              
              <div className="relative z-10">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#4BE3C1] to-[#00D1FF] flex items-center justify-center mb-6 shadow-lg shadow-[#4BE3C1]/50 group-hover:rotate-6 transition-transform duration-300">
                  <Instagram className="w-10 h-10 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-4 text-[#4BE3C1]">{t("contact.instagram.title")}</h3>
                
                <p className="text-lg mb-2">{t("contact.instagram.handle")}</p>
                <a 
                  href="https://www.instagram.com/guapo.webdesigner/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-foreground/60 hover:text-[#4BE3C1] transition-colors mb-6 block break-all"
                >
                  instagram.com/guapo.webdesigner
                </a>
                
                <button
                  onClick={() => copyToClipboard(t("contact.instagram.handle"), "instagram")}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#4BE3C1] to-[#00D1FF] text-white rounded-xl hover:scale-105 transition-all duration-300 shadow-lg shadow-[#4BE3C1]/40 hover:shadow-[#00D1FF]/50"
                >
                  {t("contact.instagram.copy")}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="group relative p-10 rounded-3xl bg-gradient-to-br from-background/90 to-background/60 backdrop-blur-sm border-2 border-[#6C63FF]/50 shadow-2xl shadow-[#6C63FF]/30 hover:shadow-[#6C63FF]/50 transition-all duration-500">
            <div className="absolute inset-0 rounded-3xl border-2 border-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
            
            {/* Decorative corners */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#6C63FF]/30 to-[#5A3BEF]/30 rounded-br-full blur-2xl"></div>
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-[#00D1FF]/30 to-[#4BE3C1]/30 rounded-tl-full blur-2xl"></div>
            
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-[#6C63FF] via-[#5A3BEF] to-[#00D1FF] bg-clip-text text-transparent">
                {t("contact.form.title")}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">{t("contact.form.name")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#6C63FF]/30 bg-background/50 backdrop-blur-sm focus:border-[#6C63FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t("contact.form.email")}</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#00D1FF]/30 bg-background/50 backdrop-blur-sm focus:border-[#00D1FF] focus:outline-none focus:ring-2 focus:ring-[#00D1FF]/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t("contact.form.phone")}</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#4BE3C1]/30 bg-background/50 backdrop-blur-sm focus:border-[#4BE3C1] focus:outline-none focus:ring-2 focus:ring-[#4BE3C1]/20 transition-all"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">{t("contact.form.message")}</label>
                  <textarea
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border-2 border-[#6C63FF]/30 bg-background/50 backdrop-blur-sm focus:border-[#6C63FF] focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 transition-all resize-none"
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-gradient-to-r from-[#00D1FF] to-[#4BE3C1] text-white rounded-xl font-semibold text-lg hover:scale-105 transition-all duration-300 shadow-lg shadow-[#00D1FF]/40 hover:shadow-[#4BE3C1]/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {isSubmitting ? t("contact.form.sending") : t("contact.form.submit")}
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-r from-[#6C63FF] via-[#5A3BEF] to-[#4B2FD9] border-t-4 border-white overflow-hidden">
        {/* Animated background circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-20 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#00D1FF]/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.5s" }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            {/* Column 1: Guapo Web Designer */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-2xl font-bold text-white">Guapo Web Designer</h3>
                <Sparkles className="w-6 h-6 text-[#4BE3C1] animate-pulse" />
              </div>
              <p className="text-white/80 leading-relaxed">
                {t("footer.description")}
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4">{t("footer.links")}</h4>
              <div className="space-y-2">
                <a href="/#portfolio" className="block text-white/80 hover:text-white hover:translate-x-2 transition-all">
                  {t("nav.portfolio")}
                </a>
                <a href="/#services" className="block text-white/80 hover:text-white hover:translate-x-2 transition-all">
                  {t("nav.services")}
                </a>
                <a href="/contact" className="block text-white/80 hover:text-white hover:translate-x-2 transition-all">
                  {t("nav.contact")}
                </a>
              </div>
            </div>

            {/* Column 3: Follow Us */}
            <div>
              <h4 className="text-xl font-bold text-white mb-4">{t("footer.social")}</h4>
              <a 
                href="https://www.instagram.com/guapo.webdesigner/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-all group"
              >
                <Instagram className="w-6 h-6 group-hover:scale-110 transition-transform" />
                <span className="group-hover:translate-x-1 transition-transform">{t("contact.instagram.title")}</span>
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/20 pt-8 text-center">
            <p className="text-white/90 font-medium">
              © {t("footer.copyright")} - {t("footer.rights")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}