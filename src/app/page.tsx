"use client";

import Image from "next/image";
import {
  ArrowRight, Palette, Mail, Zap, Monitor, Tablet,
  Smartphone, Instagram, Menu, X, ShoppingCart, MessageCircle,
  Briefcase, FileText, UtensilsCrossed, ChevronDown, Layers, Star
} from "lucide-react";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useLanguage } from "@/contexts/language-context";
import { useState, useEffect } from "react";

export default function Home() {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* ============================================================
          NAV
          ============================================================ */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-5 flex items-center justify-between">
          <a href="#accueil">
            <Image
              src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
              alt="GUAPO"
              width={110} height={55}
              className="h-10 w-auto object-contain"
              priority
            />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {[
              { href: "#about", label: t("nav.about") },
              { href: "#portfolio", label: t("nav.portfolio") },
              { href: "#services", label: t("nav.services") },
              { href: "#contact", label: t("nav.contact") },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="hover-line text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                {label}
              </a>
            ))}
            <div className="w-px h-4 bg-gray-200" />
            <a href="/devis" className="btn-logo inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white">
              <FileText className="w-3.5 h-3.5" />
              {t("nav.quote")}
            </a>
            <LanguageSwitcher />
          </div>

          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-xl border border-gray-200 bg-white" aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg">
            <div className="flex flex-col px-6 py-6 gap-1">
              {[
                { href: "#about", label: t("nav.about") },
                { href: "#portfolio", label: t("nav.portfolio") },
                { href: "#services", label: t("nav.services") },
                { href: "#contact", label: t("nav.contact") },
              ].map(({ href, label }) => (
                <a key={href} href={href} className="py-3 text-sm text-gray-700 border-b border-gray-100 last:border-0 font-medium" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              ))}
              <div className="pt-4">
                <a href="/devis" className="btn-logo w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full text-sm font-semibold text-white" onClick={() => setMobileMenuOpen(false)}>
                  <FileText className="w-4 h-4" />{t("nav.quote")}
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ============================================================
          HERO — gradient logo full background
          ============================================================ */}
      <section id="accueil" className="relative min-h-screen flex items-center overflow-hidden">
        {/* Full gradient background */}
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #2A1B9E 0%, #3D2CC7 30%, #5B6FD6 60%, #4BBFE8 100%)" }} />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)",
            backgroundSize: "70px 70px"
          }}
        />

        {/* Glow blobs */}
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full blur-[120px] opacity-30" style={{ background: "#4BBFE8" }} />
        <div className="absolute bottom-0 -left-20 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20" style={{ background: "#2A1B9E" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[150px] opacity-10 bg-white" />

        {/* Bottom fade to white */}
        <div className="absolute bottom-0 inset-x-0 h-32" style={{ background: "linear-gradient(to top, white, transparent)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-10 pt-32 pb-32 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 text-white text-xs font-semibold uppercase tracking-wider mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-pulse" />
                Web Designer — Bruxelles
              </div>

              <h1 className="text-[clamp(2.6rem,7vw,5.5rem)] font-black leading-[0.95] tracking-tight mb-7 text-white">
                {t("hero.title")}<br />
                <span className="text-cyan-200 italic">{t("hero.title.highlight")}</span>
              </h1>

              <p className="text-lg text-white/70 max-w-lg leading-relaxed mb-10">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <a href="#portfolio" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#3D2CC7] font-bold rounded-full hover:bg-cyan-50 hover:shadow-2xl transition-all">
                  {t("hero.cta.projects")}
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="#contact" className="inline-flex items-center gap-3 px-8 py-4 border-2 border-white/30 text-white font-semibold rounded-full hover:bg-white/10 transition-all">
                  {t("hero.cta.contact")}
                </a>
              </div>
            </div>

            {/* Logo flottant côté droit */}
            <div className="hidden lg:flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-3xl opacity-40 bg-white scale-90" />
                <div className="relative w-80 h-80 rounded-3xl bg-white/15 backdrop-blur-md border border-white/30 flex items-center justify-center p-10 shadow-2xl">
                  <Image
                    src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                    alt="GUAPO"
                    width={280} height={280}
                    className="w-full h-full object-contain animate-float drop-shadow-2xl"
                  />
                </div>
                {/* Floating chips */}
                <div className="absolute -top-5 -right-5 px-4 py-2 bg-white rounded-full text-xs font-bold text-[#3D2CC7] shadow-xl">✦ Web Design</div>
                <div className="absolute -bottom-5 -left-5 px-4 py-2 rounded-full text-xs font-bold text-white shadow-xl" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }}>✦ Bruxelles</div>
              </div>
            </div>
          </div>
        </div>

        <a href="#about" className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 hover:text-white/70 transition-colors">
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
          <ChevronDown className="w-4 h-4 scroll-indicator" />
        </a>
      </section>

      {/* ============================================================
          MARQUEE
          ============================================================ */}
      <div className="border-y border-gray-100 py-5 bg-white overflow-hidden">
        <div className="marquee-track">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-12 px-8 whitespace-nowrap">
              {["Web Design", "E-commerce", "Branding", "Performance", "Responsive", "UI / UX", "SEO", "Mobile First", "Multilingue"].map((item) => (
                <span key={item} className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "linear-gradient(135deg,#3D2CC7,#4BBFE8)" }} />
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ============================================================
          ABOUT — blanc avec accents colorés
          ============================================================ */}
      <section id="about" className="py-32 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="accent-line" />
                <span className="section-number">01 — À Propos</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-900 mb-8">
                {t("about.title")}
              </h2>
              <p className="text-gray-600 leading-relaxed mb-5 text-base">{t("about.intro")}</p>
              <p className="text-gray-500 leading-relaxed text-sm mb-10">{t("about.p1")}</p>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { title: t("about.values.passion"), desc: t("about.values.passion.desc"), color: "#3D2CC7" },
                  { title: t("about.values.innovation"), desc: t("about.values.innovation.desc"), color: "#5B6FD6" },
                  { title: t("about.values.performance"), desc: t("about.values.performance.desc"), color: "#4BBFE8" },
                  { title: t("about.values.creativity"), desc: t("about.values.creativity.desc"), color: "#3D2CC7" },
                ].map(({ title, desc, color }) => (
                  <div key={title} className="p-5 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-lg transition-all group cursor-default" style={{ "--c": color } as React.CSSProperties}>
                    <div className="w-1.5 h-6 rounded-full mb-3 transition-all" style={{ background: color }} />
                    <div className="text-sm font-bold text-gray-900 mb-1">{title}</div>
                    <div className="text-xs text-gray-500 leading-relaxed">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logo côté droit */}
            <div className="relative flex items-center justify-center">
              {/* Gradient bg card */}
              <div className="relative w-[380px] h-[380px] rounded-3xl flex items-center justify-center p-12" style={{ background: "linear-gradient(135deg, #2A1B9E, #3D2CC7 40%, #4BBFE8)" }}>
                <div className="absolute inset-3 rounded-2xl bg-white/10 backdrop-blur-sm" />
                <Image
                  src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
                  alt="GUAPO Web Designer"
                  width={280} height={280}
                  className="relative z-10 w-full h-full object-contain animate-float drop-shadow-2xl"
                />
              </div>
              <div className="absolute -bottom-5 -right-5 px-5 py-3 bg-white rounded-2xl shadow-xl border border-gray-100">
                <div className="text-xs text-gray-400 font-medium mb-0.5">Basé à</div>
                <div className="text-sm font-black text-gray-900">Bruxelles 🇧🇪</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          PORTFOLIO — fond dégradé violet léger
          ============================================================ */}
      <section id="portfolio" className="py-32 px-6 lg:px-10 relative overflow-hidden" style={{ background: "linear-gradient(160deg, #1a0f7a 0%, #2A1B9E 35%, #3d5ab5 70%, #2fa8d4 100%)" }}>
        {/* Texture */}
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px"
          }}
        />
        <div className="absolute top-0 inset-x-0 h-px bg-white/10" />
        <div className="absolute bottom-0 inset-x-0 h-32" style={{ background: "linear-gradient(to top, white, transparent)" }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="w-9 h-0.5 bg-cyan-300 block" />
                <span className="text-cyan-300 text-xs font-bold uppercase tracking-[0.25em]">02 — Portfolio</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white">
                {t("portfolio.title.prefix")}
                <span className="text-cyan-200 italic"> {t("portfolio.title.highlight")}</span>
              </h2>
            </div>
            <p className="text-white/50 text-sm max-w-xs leading-relaxed md:text-right">{t("portfolio.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { href: "https://www.guapomenu.com", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain", name: "Guapo Menu", url: "guapomenu.com", tag: "App SaaS" },
              { href: "https://www.fiscand.business", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Capture-d-ecran-2025-10-24-124300-1762369451856.png?width=8000&height=8000&resize=contain", name: "Fisc & Business", url: "fiscand.business", tag: "Site Vitrine" },
              { href: "https://salarybusiness.be/", img: "https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/LOGO-SALARYBUSINESS-1762369466889.jpg?width=8000&height=8000&resize=contain", name: "Salary Business", url: "salarybusiness.be", tag: "Site Vitrine" },
            ].map(({ href, img, name, url, tag }) => (
              <a key={name} href={href} target="_blank" rel="noopener noreferrer"
                className="group block rounded-2xl overflow-hidden bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 hover:-translate-y-2 hover:shadow-2xl transition-all duration-300"
              >
                <div className="bg-white aspect-video flex items-center justify-center p-10 overflow-hidden">
                  <Image src={img} alt={name} width={400} height={225} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-xs text-white/45 mt-0.5">{url}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase tracking-wider font-bold px-3 py-1 rounded-full bg-cyan-400/20 text-cyan-200 border border-cyan-400/30">{tag}</span>
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:border-white transition-all">
                      <ArrowRight className="w-3.5 h-3.5 text-white group-hover:text-[#3D2CC7] transition-colors" />
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          SERVICES — blanc
          ============================================================ */}
      <section id="services" className="py-32 px-6 lg:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span className="accent-line" />
            <span className="section-number">03 — Services</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
            <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-gray-900">
              {t("services.title")} <span className="logo-gradient-text italic">{t("services.title.highlight")}</span>
            </h2>
            <p className="text-gray-500 leading-relaxed text-base pt-2">{t("services.subtitle")}</p>
          </div>

          {/* Liste capabilities */}
          <div className="border-t border-gray-100 mb-24">
            {[
              { number: "01", icon: <Monitor className="w-4 h-4" />, title: t("services.desktop.title"), desc: t("services.desktop.desc") },
              { number: "02", icon: <Smartphone className="w-4 h-4" />, title: t("services.mobile.title"), desc: t("services.mobile.desc") },
              { number: "03", icon: <Layers className="w-4 h-4" />, title: t("services.responsive.title"), desc: t("services.responsive.desc") },
              { number: "04", icon: <Palette className="w-4 h-4" />, title: t("services.branding.title"), desc: t("services.branding.desc") },
              { number: "05", icon: <Zap className="w-4 h-4" />, title: t("services.performance.title"), desc: t("services.performance.desc") },
              { number: "06", icon: <Tablet className="w-4 h-4" />, title: t("services.tablet.title"), desc: t("services.tablet.desc") },
            ].map(({ number, icon, title, desc }) => (
              <div key={title} className="group grid grid-cols-[2.5rem_1fr_auto] md:grid-cols-[3rem_1fr_2fr_auto] gap-6 items-center border-b border-gray-100 py-6 hover:bg-gradient-to-r hover:from-violet-50 hover:to-cyan-50 px-3 -mx-3 rounded-xl transition-all cursor-default">
                <span className="text-xs font-bold font-mono" style={{ color: "#4BBFE8" }}>{number}</span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-300 group-hover:text-[#3D2CC7] transition-colors">{icon}</span>
                  <span className="font-bold text-gray-800 group-hover:text-[#3D2CC7] transition-colors text-sm">{title}</span>
                </div>
                <p className="hidden md:block text-sm text-gray-400 leading-relaxed">{desc}</p>
                <ArrowRight className="w-4 h-4 text-gray-200 group-hover:text-[#4BBFE8] group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>

          {/* Votre projet */}
          <div className="flex items-center gap-3 mb-12">
            <span className="accent-line" />
            <span className="section-number">04 — Votre projet</span>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { href: "/devis", icon: <Briefcase className="w-5 h-5" />, title: t("services.website.showcase.title"), desc: t("services.website.showcase.desc"), cta: t("services.website.cta"), grad: "from-violet-600 to-blue-500" },
              { href: "/devis", icon: <ShoppingCart className="w-5 h-5" />, title: t("services.website.ecommerce.title"), desc: t("services.website.ecommerce.desc"), cta: t("services.website.cta"), grad: "from-blue-500 to-cyan-400" },
              { href: "#contact", icon: <MessageCircle className="w-5 h-5" />, title: t("services.website.discuss.title"), desc: t("services.website.discuss.desc"), cta: t("services.website.discuss.cta"), grad: "from-cyan-400 to-sky-400" },
            ].map(({ href, icon, title, desc, cta, grad }) => (
              <a key={title} href={href}
                className="card-shine group flex flex-col p-7 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl bg-white transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform shadow-lg`}>
                  {icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-grow">{desc}</p>
                <span className="text-xs font-bold flex items-center gap-1.5 group-hover:gap-3 transition-all logo-gradient-text">
                  {cta} <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </a>
            ))}

            {/* Guapo Menu */}
            <a href="https://www.guapomenu.com" target="_blank" rel="noopener noreferrer"
              className="card-shine group flex flex-col p-7 rounded-2xl border border-gray-100 hover:border-transparent hover:shadow-2xl bg-white transition-all hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-white border border-gray-100 shadow-md flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Image src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/ChatGPT-Image-21-dec.-2025-16_40_56-1766457790930.png?width=8000&height=8000&resize=contain" alt="Guapo Menu" width={44} height={44} className="w-9 h-9 object-contain" />
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">Guapo Menu</h3>
              <p className="text-xs text-gray-500 leading-relaxed mb-6 flex-grow">Menus digitaux, QR codes et gestion des commandes pour restaurants.</p>
              <span className="text-xs font-bold flex items-center gap-1.5 group-hover:gap-3 transition-all logo-gradient-text">
                Découvrir <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================
          CONTACT — gradient logo
          ============================================================ */}
      <section id="contact" className="py-32 px-6 lg:px-10 relative overflow-hidden" style={{ background: "linear-gradient(135deg, #2A1B9E 0%, #3D2CC7 40%, #4BBFE8 100%)" }}>
        <div className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
            backgroundSize: "70px 70px"
          }}
        />
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full blur-[100px] opacity-20 bg-cyan-300" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <span className="w-9 h-0.5 bg-cyan-300 block" />
            <span className="text-cyan-300 text-xs font-bold uppercase tracking-[0.25em]">05 — Contact</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-20 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-white mb-6">
                {t("contact.section.title")}
              </h2>
              <p className="text-white/60 leading-relaxed mb-12 max-w-md text-base">{t("contact.section.desc")}</p>
              <a href="/devis" className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-[#3D2CC7] font-bold rounded-full hover:bg-cyan-50 hover:shadow-2xl transition-all">
                {t("nav.quote")}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>

            <div className="space-y-4">
              {[
                { href: "mailto:info@guapowebdesigner.com", icon: <Mail className="w-5 h-5" />, label: t("contact.email.title"), value: "info@guapowebdesigner.com" },
                { href: "https://www.instagram.com/guapo_webdesigner/", icon: <Instagram className="w-5 h-5" />, label: t("contact.instagram.title"), value: "@guapo_webdesigner", external: true },
              ].map(({ href, icon, label, value, external }) => (
                <a key={label} href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="card-shine group flex items-center gap-5 p-6 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white hover:border-transparent hover:shadow-2xl transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center text-white group-hover:bg-gradient-to-br group-hover:from-[#3D2CC7] group-hover:to-[#4BBFE8] transition-all shrink-0">
                    {icon}
                  </div>
                  <div>
                    <div className="text-xs text-white/50 group-hover:text-gray-400 uppercase tracking-wider mb-0.5 transition-colors">{label}</div>
                    <div className="text-sm font-bold text-white group-hover:text-gray-900 transition-colors">{value}</div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-[#3D2CC7] ml-auto group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="py-10 px-6 lg:px-10 border-t border-gray-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Image
            src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=8000&height=8000&resize=contain"
            alt="GUAPO"
            width={100} height={45}
            className="h-8 w-auto object-contain"
          />
          <div className="flex items-center gap-8">
            {[
              { href: "/politique-confidentialite", label: t("footer.privacy") },
              { href: "/mentions-legales", label: t("footer.legal.terms") },
              { href: "https://www.instagram.com/guapo_webdesigner/", label: "Instagram", external: true },
            ].map(({ href, label, external }) => (
              <a key={label} href={href}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="text-xs text-gray-400 hover:text-gray-700 transition-colors uppercase tracking-wider font-medium"
              >
                {label}
              </a>
            ))}
          </div>
          <p className="text-xs text-gray-400 uppercase tracking-wider">© 2025 GUAPO</p>
        </div>
      </footer>
    </div>
  );
}
