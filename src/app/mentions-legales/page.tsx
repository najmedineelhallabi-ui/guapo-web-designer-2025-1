import { Building, Mail, Globe, FileText, Shield } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Mentions légales - GUAPO Web Designer',
  description: 'Mentions légales et informations juridiques du site GUAPO Web Designer',
};

export default function MentionsLegalesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-background via-secondary/20 to-accent/20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/30 text-sm border border-secondary/50 backdrop-blur-sm mb-6">
            <FileText className="w-4 h-4 text-secondary" />
            <span>Informations légales</span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Mentions <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Légales</span>
          </h1>
          
          <p className="text-lg text-foreground/80">
            Informations juridiques et éditeur du site
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-12">
          
          {/* Éditeur du site */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Building className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Éditeur du site</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p><strong>Raison sociale :</strong> GUAPO Web Designer</p>
              <p><strong>Site web :</strong> <a href="https://guapowebdesigner.com" className="text-primary hover:underline">guapowebdesigner.com</a></p>
              <p><strong>Email :</strong> <a href="mailto:info@guapowebdesigner.com" className="text-primary hover:underline">info@guapowebdesigner.com</a></p>
              <p><strong>Instagram :</strong> <a href="https://www.instagram.com/guapo_webdesigner/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@guapo_webdesigner</a></p>
            </div>
          </div>

          {/* Hébergeur */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Hébergeur du site</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p><strong>Nom :</strong> Netlify, Inc. / Vercel Inc.</p>
              <p><strong>Adresse :</strong> 2325 3rd Street, Suite 296, San Francisco, California 94107, USA</p>
              <p><strong>Site web :</strong> <a href="https://www.netlify.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">netlify.com</a> / <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">vercel.com</a></p>
            </div>
          </div>

          {/* Propriété intellectuelle */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Propriété intellectuelle</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                L'ensemble du contenu de ce site (textes, images, logos, design, structure) est la propriété 
                exclusive de GUAPO Web Designer, sauf mention contraire.
              </p>
              <p>
                Toute reproduction, distribution, modification ou utilisation du contenu du site, en tout ou en partie, 
                sans autorisation préalable écrite est strictement interdite et constitue une contrefaçon sanctionnée 
                par les articles L.335-2 et suivants du Code de la propriété intellectuelle.
              </p>
            </div>
          </div>

          {/* Données personnelles */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Données personnelles</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                Le site guapowebdesigner.com respecte la vie privée de ses utilisateurs et s'engage à protéger 
                les données personnelles collectées conformément au Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p>
                Pour en savoir plus sur la collecte et le traitement de vos données personnelles, 
                consultez notre <Link href="/politique-confidentialite" className="text-primary hover:underline font-semibold">Politique de confidentialité</Link>.
              </p>
            </div>
          </div>

          {/* Cookies */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Cookies</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                Ce site utilise des cookies pour améliorer l'expérience utilisateur et analyser le trafic. 
                Vous pouvez accepter ou refuser les cookies non essentiels via la bannière de consentement.
              </p>
              <p>
                Les cookies essentiels au fonctionnement du site sont automatiquement activés et ne peuvent pas être désactivés.
              </p>
            </div>
          </div>

          {/* Responsabilité */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Limitation de responsabilité</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                GUAPO Web Designer s'efforce d'assurer l'exactitude et la mise à jour des informations diffusées 
                sur ce site, mais ne peut garantir l'exactitude, la précision ou l'exhaustivité des informations 
                mises à disposition.
              </p>
              <p>
                En conséquence, GUAPO Web Designer décline toute responsabilité pour toute imprécision, inexactitude 
                ou omission portant sur des informations disponibles sur ce site.
              </p>
            </div>
          </div>

          {/* Droit applicable */}
          <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Droit applicable</h2>
            </div>
            <div className="space-y-4 text-foreground/80">
              <p>
                Les présentes mentions légales sont soumises au droit français. Tout litige relatif à l'utilisation 
                du site guapowebdesigner.com sera de la compétence exclusive des tribunaux français.
              </p>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <Mail className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Contact</h2>
            </div>
            <div className="space-y-3 text-foreground/80">
              <p>
                Pour toute question concernant ces mentions légales :
              </p>
              <div className="flex flex-col gap-2 pt-2">
                <a 
                  href="mailto:info@guapowebdesigner.com" 
                  className="inline-flex items-center gap-2 text-primary hover:underline font-semibold"
                >
                  <Mail className="w-4 h-4" />
                  info@guapowebdesigner.com
                </a>
              </div>
            </div>
          </div>

          {/* Retour */}
          <div className="text-center pt-8">
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              Retour à l'accueil
            </Link>
          </div>

        </div>
      </section>
    </div>
  );
}
