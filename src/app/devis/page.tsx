import { QuoteForm } from '@/components/quote-form';
import { Sparkles, FileText } from 'lucide-react';

export const metadata = {
  title: 'Demande de Devis | GUAPO Web Designer',
  description: 'Demandez un devis gratuit pour votre projet de site web. Création de sites modernes, élégants et performants en Belgique.',
};

export default function DevisPage() {
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

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 bg-gradient-to-br from-background via-primary/20 to-secondary/20 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/40 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary/40 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-accent/30 rounded-full blur-3xl"></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/30 text-sm border border-primary/50 backdrop-blur-sm mb-6">
            <FileText className="w-4 h-4 text-primary" />
            <span>Devis gratuit sous 48h</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Demande de <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">Devis</span>
          </h1>
          
          <p className="text-xl text-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Parlez-nous de votre projet et recevez un devis personnalisé adapté à vos besoins et votre budget.
          </p>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-20 px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-card/50 backdrop-blur-sm border-2 border-primary/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Réponse rapide</h3>
              <p className="text-sm text-foreground/70">Devis sous 48h maximum</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border-2 border-secondary/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-secondary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Devis gratuit</h3>
              <p className="text-sm text-foreground/70">Sans engagement</p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border-2 border-accent/30 rounded-xl p-6 text-center hover:scale-105 transition-transform">
              <div className="w-12 h-12 bg-gradient-to-r from-accent to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold mb-2">Sur mesure</h3>
              <p className="text-sm text-foreground/70">Adapté à vos besoins</p>
            </div>
          </div>

          {/* Form */}
          <div className="bg-card/30 backdrop-blur-sm border-2 border-border rounded-2xl p-8 md:p-12 shadow-2xl">
            <QuoteForm />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-background via-accent/20 to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-1/4 w-72 h-72 bg-primary/50 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-secondary/50 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Des questions avant de faire votre demande ?
          </h2>
          <p className="text-lg text-foreground/80 mb-8">
            N'hésitez pas à nous contacter directement par email ou sur Instagram
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:info@guapowebdesigner.com"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              info@guapowebdesigner.com
            </a>
            <a
              href="https://www.instagram.com/guapo_webdesigner/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary/40 bg-card/50 backdrop-blur-sm rounded-lg hover:bg-primary/20 transition-colors"
            >
              @guapo_webdesigner
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
