'use client';

import { useState, useEffect } from 'react';
import { X, Cookie, Shield } from 'lucide-react';
import Link from 'next/link';

export const CookieConsentBanner = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom duration-500">
      <div className="max-w-6xl mx-auto bg-card/95 backdrop-blur-xl border-2 border-primary/30 rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">Respect de votre vie privée</h3>
                <p className="text-sm text-foreground/70">Nous utilisons des cookies</p>
              </div>
            </div>
            <button
              onClick={handleReject}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-foreground/80 leading-relaxed">
              Nous utilisons des cookies essentiels pour le bon fonctionnement du site et des cookies
              analytiques pour améliorer votre expérience. Vos données sont traitées conformément au RGPD.
            </p>

            {showDetails && (
              <div className="bg-muted/50 rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-top duration-300">
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Cookies essentiels</h4>
                    <p className="text-sm text-foreground/70">
                      Nécessaires au fonctionnement du site (formulaires, sécurité). Ne peuvent pas être désactivés.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Cookies analytiques</h4>
                    <p className="text-sm text-foreground/70">
                      Nous aident à comprendre comment vous utilisez notre site pour l'améliorer.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAccept}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                Accepter tout
              </button>
              <button
                onClick={handleReject}
                className="flex-1 px-6 py-3 border-2 border-border bg-muted hover:bg-muted/70 rounded-lg transition-colors"
              >
                Refuser les cookies non essentiels
              </button>
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="px-6 py-3 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {showDetails ? 'Masquer' : 'En savoir plus'}
              </button>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-foreground/60 pt-2">
              <Link
                href="/politique-confidentialite"
                className="hover:text-primary transition-colors underline"
              >
                Politique de confidentialité
              </Link>
              <Link
                href="/mentions-legales"
                className="hover:text-primary transition-colors underline"
              >
                Mentions légales
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
