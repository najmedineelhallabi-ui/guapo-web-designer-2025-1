"use client";

import { Heart, Sparkles, Zap, Palette } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function AboutPage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const values = [
    {
      icon: Heart,
      title: "Passion",
      description: "Chaque projet est une nouvelle aventure créative",
      color: "#6C63FF"
    },
    {
      icon: Sparkles,
      title: "Innovation",
      description: "Toujours à l'avant-garde des tendances",
      color: "#5A3BEF"
    },
    {
      icon: Zap,
      title: "Performance",
      description: "Des sites rapides et optimisés",
      color: "#00D1FF"
    },
    {
      icon: Palette,
      title: "Créativité",
      description: "Des designs uniques et mémorables",
      color: "#4BE3C1"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1a2e] to-[#0a0a0f] text-white relative overflow-hidden">
      {/* Laser Lines Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-96 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-30 blur-sm"></div>
        <div className="absolute top-40 right-20 w-80 h-0.5 bg-gradient-to-r from-transparent via-[#0FFF50] to-transparent opacity-25 blur-sm rotate-12"></div>
        <div className="absolute bottom-32 left-1/4 w-72 h-0.5 bg-gradient-to-r from-transparent via-[#00FF00] to-transparent opacity-20 blur-sm -rotate-6"></div>
        <div className="absolute top-1/2 right-1/3 w-64 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent opacity-25 blur-sm rotate-45"></div>
      </div>

      {/* Blur Circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Mobile circles */}
        <div className="md:hidden absolute top-20 left-5 w-64 h-64 bg-[#6C63FF]/30 rounded-full blur-md"></div>
        <div className="md:hidden absolute bottom-10 right-5 w-56 h-56 bg-[#4BE3C1]/30 rounded-full blur-md"></div>
        <div className="md:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-[#5A3BEF]/25 rounded-full blur-md"></div>
        
        {/* Tablet circles */}
        <div className="hidden md:block lg:hidden absolute top-20 left-10 w-80 h-80 bg-[#6C63FF]/20 rounded-full blur-2xl"></div>
        <div className="hidden md:block lg:hidden absolute bottom-10 right-10 w-72 h-72 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
        <div className="hidden md:block lg:hidden absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#5A3BEF]/15 rounded-full blur-2xl"></div>
        
        {/* Desktop circles */}
        <div className="hidden lg:block absolute top-20 left-20 w-96 h-96 bg-[#6C63FF]/20 rounded-full blur-2xl"></div>
        <div className="hidden lg:block absolute bottom-20 right-20 w-80 h-80 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>
        <div className="hidden lg:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#5A3BEF]/15 rounded-full blur-2xl"></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gradient-to-r from-[#6C63FF]/10 via-[#4BE3C1]/10 to-[#00D1FF]/10 backdrop-blur-md border-b border-white/10 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#4BE3C1] to-[#00D1FF] bg-clip-text text-transparent">GUAPO</div>
          <div className="hidden md:flex gap-8">
            <a href="/" className="hover:text-[#4BE3C1] transition-colors">Accueil</a>
            <a href="/about" className="text-[#4BE3C1] font-semibold">À propos</a>
            <a href="/#services" className="hover:text-[#00D1FF] transition-colors">Services</a>
            <a href="/#portfolio" className="hover:text-[#6C63FF] transition-colors">Portfolio</a>
            <a href="/#contact" className="hover:text-[#4BE3C1] transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      <div className="relative z-10 pt-32 pb-20 px-6">
        {/* Hero Title */}
        <div 
          className={`text-center mb-20 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <Sparkles className="w-8 h-8 text-[#4BE3C1] animate-pulse" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#6C63FF] via-[#4BE3C1] to-[#00D1FF] bg-clip-text text-transparent">
              À propos de Guapo
            </h1>
            <Sparkles className="w-8 h-8 text-[#00D1FF] animate-pulse" />
          </div>
        </div>

        {/* Values Grid */}
        <div className="max-w-7xl mx-auto mb-32">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className={`group relative transition-all duration-700 ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                  }`}
                  style={{ transitionDelay: `${index * 150}ms` }}
                >
                  <div className="relative p-8 rounded-2xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border-2 border-[#4BE3C1]/30 shadow-[0_0_30px_rgba(75,227,193,0.3)] hover:shadow-[0_0_50px_rgba(75,227,193,0.5)] hover:scale-105 hover:rotate-1 transition-all duration-300">
                    {/* Gradient Square Icon */}
                    <div 
                      className="w-16 h-16 rounded-xl mb-6 flex items-center justify-center shadow-lg relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${value.color} 0%, #4BE3C1 100%)`,
                        boxShadow: `0 0 20px ${value.color}40`
                      }}
                    >
                      <Icon className="w-8 h-8 text-white relative z-10" />
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-bold mb-3 text-white">{value.title}</h3>
                    <p className="text-gray-300 leading-relaxed">{value.description}</p>

                    {/* White border glow effect */}
                    <div className="absolute inset-0 rounded-2xl border border-white/20 pointer-events-none"></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Description Block */}
        <div className="max-w-7xl mx-auto">
          <div 
            className={`relative grid md:grid-cols-2 gap-12 items-center p-12 rounded-3xl bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm border-2 border-white/20 shadow-[0_0_40px_rgba(75,227,193,0.2)] transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ transitionDelay: "600ms" }}
          >
            {/* Background decorative elements */}
            <div className="absolute top-10 right-10 w-32 h-32 bg-[#6C63FF]/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-[#4BE3C1]/20 rounded-full blur-2xl"></div>

            {/* Text Content */}
            <div className="relative z-10 space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                Bienvenue chez <span className="text-[#4BE3C1] font-semibold">Guapo Web Designer</span>, 
                votre partenaire créatif pour transformer vos idées en réalités digitales exceptionnelles.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Avec une passion pour le design moderne et une expertise technique pointue, 
                je crée des sites web qui ne se contentent pas d'être beaux, mais qui performent, 
                convertissent et marquent les esprits.
              </p>
              <p className="text-gray-300 leading-relaxed">
                Mon approche combine <span className="text-[#00D1FF] font-semibold">créativité audacieuse</span>, 
                <span className="text-[#6C63FF] font-semibold"> innovation technologique</span> et 
                <span className="text-[#4BE3C1] font-semibold"> excellence professionnelle</span> pour 
                donner vie à des projets web qui dépassent vos attentes.
              </p>
            </div>

            {/* Logo/Image */}
            <div className="relative z-10 flex items-center justify-center">
              <div className="relative">
                {/* Decorative frame */}
                <div className="absolute -inset-8 bg-gradient-to-br from-[#6C63FF]/30 via-[#4BE3C1]/30 to-[#00D1FF]/30 rounded-3xl blur-xl"></div>
                <div className="absolute -inset-4 border-2 border-white/20 rounded-2xl"></div>
                <div className="absolute -inset-2 border border-[#4BE3C1]/40 rounded-xl"></div>
                
                {/* Logo container */}
                <div className="relative w-64 h-64 bg-gradient-to-br from-[#6C63FF] via-[#5A3BEF] to-[#4B2FD9] rounded-2xl shadow-[0_0_60px_rgba(108,99,255,0.6)] flex items-center justify-center border-4 border-white/30">
                  <div className="text-center">
                    <div className="text-6xl font-black text-white mb-2 tracking-wider">GUAPO</div>
                    <div className="text-sm font-light text-[#4BE3C1] tracking-widest">WEB DESIGNER</div>
                  </div>
                  
                  {/* Sparkle decorations */}
                  <Sparkles className="absolute top-4 right-4 w-6 h-6 text-[#4BE3C1] animate-pulse" />
                  <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-[#00D1FF] animate-pulse" style={{ animationDelay: "0.5s" }} />
                </div>

                {/* Laser lines around logo */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-[#39FF14] to-transparent blur-sm"></div>
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-48 h-0.5 bg-gradient-to-r from-transparent via-[#0FFF50] to-transparent blur-sm"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div 
          className={`max-w-4xl mx-auto mt-20 text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
          }`}
          style={{ transitionDelay: "800ms" }}
        >
          <p className="text-xl text-gray-300 mb-8">
            Prêt à donner vie à votre projet web ?
          </p>
          <a 
            href="/#contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#6C63FF] via-[#5A3BEF] to-[#4BE3C1] text-white rounded-xl hover:shadow-[0_0_40px_rgba(108,99,255,0.6)] transition-all hover:scale-105 font-semibold text-lg border-2 border-white/30"
          >
            <Sparkles className="w-5 h-5" />
            Discutons de votre projet
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto text-center text-gray-400">
          <p>© 2025 <span className="bg-gradient-to-r from-[#6C63FF] via-[#4BE3C1] to-[#00D1FF] bg-clip-text text-transparent font-semibold">GUAPO</span> Web Designer. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  );
}