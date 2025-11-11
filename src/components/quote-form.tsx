'use client';

import { useActionState, useEffect } from 'react';
import { sendQuoteAction, QuoteFormState } from '@/app/actions/sendQuote';
import { Mail, User, Briefcase, Calendar, MessageSquare, Send, CheckCircle, AlertCircle, Globe, Server, CheckSquare, Shield } from 'lucide-react';
import { useLanguage } from '@/contexts/language-context';
import Link from 'next/link';

export function QuoteForm() {
  const { t } = useLanguage();
  const [state, formAction, isPending] = useActionState<QuoteFormState, FormData>(
    sendQuoteAction,
    {}
  );

  useEffect(() => {
    if (state.success) {
      // Scroll to success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [state.success]);

  return (
    <div className="max-w-3xl mx-auto">
      <form action={formAction} className="space-y-6">
        {/* Success message */}
        {state.success && (
          <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/50 text-foreground px-6 py-4 rounded-xl flex items-start gap-3 animate-fade-in shadow-lg">
            <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-lg">Merci pour votre demande !</p>
              <p className="text-sm text-foreground/80 mt-1">{state.message}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {state.success === false && !state.errors && (
          <div className="bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" />
            <p>{state.message}</p>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Name field */}
          <div>
            <label htmlFor="name" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <User className="w-4 h-4 text-primary" />
              Nom complet *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="Votre nom"
              disabled={isPending}
            />
            {state.errors?.name && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.name[0]}
              </p>
            )}
          </div>

          {/* Email field */}
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Mail className="w-4 h-4 text-primary" />
              Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              placeholder="votre@email.com"
              disabled={isPending}
            />
            {state.errors?.email && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.email[0]}
              </p>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Project Type field */}
          <div>
            <label htmlFor="projectType" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Briefcase className="w-4 h-4 text-primary" />
              Type de projet *
            </label>
            <select
              id="projectType"
              name="projectType"
              required
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all"
              disabled={isPending}
            >
              <option value="">Sélectionnez...</option>
              <option value="Site vitrine">Site vitrine</option>
              <option value="Autre">Autre</option>
            </select>
            {state.errors?.projectType && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.projectType[0]}
              </p>
            )}
          </div>

          {/* Deadline field */}
          <div>
            <label htmlFor="deadline" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Calendar className="w-4 h-4 text-secondary" />
              Date souhaitée
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              disabled={isPending}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Domain field */}
          <div>
            <label htmlFor="domain" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Globe className="w-4 h-4 text-accent" />
              Nom de domaine *
            </label>
            <select
              id="domain"
              name="domain"
              required
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all"
              disabled={isPending}
            >
              <option value="">Sélectionnez...</option>
              <option value="J'ai déjà un domaine">J'ai déjà un domaine</option>
              <option value="Je souhaite en acheter un">Je souhaite en acheter un</option>
              <option value="Besoin de conseil">Besoin de conseil</option>
            </select>
            {state.errors?.domain && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.domain[0]}
              </p>
            )}
          </div>

          {/* Hosting field */}
          <div>
            <label htmlFor="hosting" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
              <Server className="w-4 h-4 text-secondary" />
              Hébergement *
            </label>
            <select
              id="hosting"
              name="hosting"
              required
              className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary transition-all"
              disabled={isPending}
            >
              <option value="">Sélectionnez...</option>
              <option value="J'ai déjà un hébergement">J'ai déjà un hébergement</option>
              <option value="Je souhaite en acheter un">Je souhaite en acheter un</option>
              <option value="Besoin de conseil">Besoin de conseil</option>
            </select>
            {state.errors?.hosting && (
              <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {state.errors.hosting[0]}
              </p>
            )}
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gradient-to-br from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-xl p-6">
          <label className="flex items-center gap-2 text-sm font-semibold text-foreground mb-4">
            <CheckSquare className="w-5 h-5 text-primary" />
            Fonctionnalités souhaitées
          </label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="features"
                value="Système de prise de rendez-vous en ligne"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Système de prise de rendez-vous en ligne
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="features"
                value="Envoi automatique d'e-mails au client + à l'entreprise"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Envoi automatique d'e-mails au client + à l'entreprise
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="features"
                value="Formulaire de demande de devis"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Formulaire de demande de devis
              </span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="features"
                value="Sécurisation SSL + RGPD"
                className="w-5 h-5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer"
                disabled={isPending}
              />
              <span className="text-foreground/90 group-hover:text-foreground transition-colors">
                Sécurisation SSL + RGPD
              </span>
            </label>
          </div>
        </div>

        {/* Message field */}
        <div>
          <label htmlFor="message" className="flex items-center gap-2 text-sm font-semibold text-foreground mb-2">
            <MessageSquare className="w-4 h-4 text-primary" />
            Description du projet *
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={6}
            className="w-full px-4 py-3 bg-card/50 backdrop-blur-sm border-2 border-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all resize-none"
            placeholder="Décrivez votre projet en détail : vos besoins, vos objectifs, vos attentes..."
            disabled={isPending}
          />
          {state.errors?.message && (
            <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {state.errors.message[0]}
            </p>
          )}
        </div>

        {/* RGPD Consent */}
        <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              type="checkbox"
              name="rgpdConsent"
              required
              className="w-5 h-5 mt-0.5 rounded border-2 border-border text-primary focus:ring-2 focus:ring-primary cursor-pointer flex-shrink-0"
              disabled={isPending}
            />
            <div className="space-y-2">
              <span className="text-foreground/90 group-hover:text-foreground transition-colors flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <strong>Consentement RGPD *</strong>
              </span>
              <p className="text-sm text-foreground/70">
                J'accepte que mes données personnelles soient collectées et traitées par GUAPO Web Designer 
                dans le but de traiter ma demande de devis. Mes données ne seront jamais vendues à des tiers. 
                Je peux exercer mes droits (accès, rectification, suppression) en contactant{' '}
                <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline">
                  info@guapowebdesigner.com
                </a>
                . Pour plus d'informations, consultez notre{' '}
                <Link href="/politique-confidentialite" className="text-primary hover:underline font-semibold">
                  politique de confidentialité
                </Link>
                .
              </p>
            </div>
          </label>
          {state.errors?.rgpdConsent && (
            <p className="text-red-600 text-sm mt-2 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {state.errors.rgpdConsent[0]}
            </p>
          )}
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:scale-[1.02] flex items-center justify-center gap-3 text-lg"
        >
          {isPending ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Envoi en cours...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              Envoyer ma demande de devis
            </>
          )}
        </button>

        <p className="text-center text-sm text-foreground/60">
          * Champs obligatoires
        </p>
      </form>
    </div>
  );
}