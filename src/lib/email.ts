import { Resend } from 'resend';
import { PRICING } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

// Prix par page supplémentaire
const PAGE_EXTRA_COST = 100;

// Traductions pour les valeurs des options du formulaire
const optionTranslations = {
  "Site vitrine simple (1 à 3 pages)": { fr: "Site vitrine simple (1 à 3 pages)", nl: "Eenvoudige showcase site (1 tot 3 pagina's)", en: "Simple showcase website (1 to 3 pages)" },
  "Site vitrine standard (4 à 5 pages)": { fr: "Site vitrine standard (4 à 5 pages)", nl: "Standaard showcase site (4 tot 5 pagina's)", en: "Standard showcase website (4 to 5 pages)" },
  "Site vitrine avancé (6 à 8 pages)": { fr: "Site vitrine avancé (6 à 8 pages)", nl: "Geavanceerde showcase site (6 tot 8 pagina's)", en: "Advanced showcase website (6 to 8 pages)" },
  "Site vitrine premium (9 à 12 pages)": { fr: "Site vitrine premium (9 à 12 pages)", nl: "Premium showcase site (9 tot 12 pagina's)", en: "Premium showcase website (9 to 12 pages)" },
  "Portfolio / site personnel": { fr: "Portfolio / site personnel", nl: "Portfolio / persoonlijke website", en: "Portfolio / personal website" },
  "Petite boutique (1-20 produits)": { fr: "Petite boutique (1-20 produits)", nl: "Kleine winkel (1-20 producten)", en: "Small shop (1-20 products)" },
  "Boutique moyenne (21-100 produits)": { fr: "Boutique moyenne (21-100 produits)", nl: "Gemiddelde winkel (21-100 producten)", en: "Medium shop (21-100 products)" },
  "Grande boutique (100+ produits)": { fr: "Grande boutique (100+ produits)", nl: "Grote winkel (100+ producten)", en: "Large shop (100+ products)" },
  "Formulaire de contact simple": { fr: "Formulaire de contact simple", nl: "Eenvoudig contactformulier", en: "Simple contact form" },
  "Formulaire de demande de devis": { fr: "Formulaire de demande de devis", nl: "Offerteaanvraagformulier", en: "Quote request form" },
  "Envoi automatique d'emails de confirmation (pour devis)": { fr: "Envoi automatique d'emails de confirmation (pour devis)", nl: "Automatische verzending van bevestigingsmails (voor offertes)", en: "Automatic confirmation email sending (for quotes)" },
  "Système de prise de rendez-vous en ligne (avec emails automatiques)": { fr: "Système de prise de rendez-vous en ligne (avec emails automatiques)", nl: "Online afsprakenboekingssysteem (met automatische emails)", en: "Online appointment booking system (with automatic emails)" },
  "Intégration calendrier (Google Calendar, etc.)": { fr: "Intégration calendrier (Google Calendar, etc.)", nl: "Agenda-integratie (Google Calendar, etc.)", en: "Calendar integration (Google Calendar, etc.)" },
  "Multilingue": { fr: "Multilingue", nl: "Meertalig", en: "Multilingual" },
  "Blog / actualités": { fr: "Blog / actualités", nl: "Blog / nieuws", en: "Blog / news" },
  "Catalogue de produits": { fr: "Catalogue de produits", nl: "Productcatalogus", en: "Product catalog" },
  "Panier d'achat": { fr: "Panier d'achat", nl: "Winkelwagen", en: "Shopping cart" },
  "Passerelle de paiement (Stripe, PayPal, etc.)": { fr: "Passerelle de paiement (Stripe, PayPal, etc.)", nl: "Betalingsgateway (Stripe, PayPal, etc.)", en: "Payment gateway (Stripe, PayPal, etc.)" },
  "Gestion des commandes": { fr: "Gestion des commandes", nl: "Bestellingenbeheer", en: "Order management" },
  "Gestion des stocks": { fr: "Gestion des stocks", nl: "Voorraadbeheer", en: "Inventory management" },
  "Comptes clients": { fr: "Comptes clients", nl: "Klantenaccounts", en: "Customer accounts" },
  "Pack Tout Inclus (SEO + Performance + SSL + RGPD)": { fr: "Pack Tout Inclus (SEO + Performance + SSL + RGPD)", nl: "All-inclusive Pakket (SEO + Prestaties + SSL + AVG)", en: "All-Inclusive Pack (SEO + Performance + SSL + GDPR)" },
  "SEO de base (balises, titres, URLs)": { fr: "SEO de base (balises, titres, URLs)", nl: "Basis SEO (tags, titels, URL's)", en: "Basic SEO (tags, titles, URLs)" },
  "Optimisation vitesse / performance": { fr: "Optimisation vitesse / performance", nl: "Snelheid / prestaties optimalisatie", en: "Speed / performance optimization" },
  "Certificat SSL / HTTPS": { fr: "Certificat SSL / HTTPS", nl: "SSL-certificaat / HTTPS", en: "SSL certificate / HTTPS" },
  "RGPD / conformité légale": { fr: "RGPD / conformité légale", nl: "AVG / wettelijke naleving", en: "GDPR / legal compliance" },
  "Inclus dans le projet": { fr: "Inclus dans le projet", nl: "Inbegrepen in het project", en: "Included in the project" },
  "Fourni par le client": { fr: "Fourni par le client", nl: "Geleverd door de klant", en: "Provided by the client" },
  "À discuter": { fr: "À discuter", nl: "Te bespreken", en: "To discuss" },
  "Menu / Site de commande (système de base)": { fr: "Menu / Site de commande (système de base)", nl: "Menu / Bestelsite (basissysteem)", en: "Menu / Ordering site (base system)" },
  "Pack Menu Simple": { fr: "Pack Menu Simple", nl: "Eenvoudig Menupakket", en: "Simple Menu Pack" },
  "Pack Menu Complet": { fr: "Pack Menu Complet", nl: "Compleet Menupakket", en: "Complete Menu Pack" },
  "Ajout au panier": { fr: "Ajout au panier", nl: "Toevoegen aan winkelwagen", en: "Add to cart" },
  "Sur place / à emporter": { fr: "Sur place / à emporter", nl: "Ter plaatse / afhalen", en: "Dine-in / takeaway" },
  "Confirmation de commande": { fr: "Confirmation de commande", nl: "Bestelbevestiging", en: "Order confirmation" },
  "Email automatique client": { fr: "Email automatique client", nl: "Automatische klant email", en: "Automatic customer email" },
  "Dashboard Cuisine": { fr: "Dashboard Cuisine", nl: "Keuken dashboard", en: "Kitchen dashboard" },
  "Statuts de commande cuisine": { fr: "Statuts de commande cuisine", nl: "Keuken bestelstatus", en: "Kitchen order status" },
  "Gestion menu": { fr: "Gestion menu", nl: "Menu beheer", en: "Menu management" },
  "Dashboard Serveur": { fr: "Dashboard Serveur", nl: "Ober dashboard", en: "Waiter dashboard" },
  "Statuts de commande serveur": { fr: "Statuts de commande serveur", nl: "Ober bestelstatus", en: "Waiter order status" },
  "Français (FR)": { fr: "Français (FR)", nl: "Frans (FR)", en: "French (FR)" },
  "Néerlandais (NL)": { fr: "Néerlandais (NL)", nl: "Nederlands (NL)", en: "Dutch (NL)" },
  "English (ENG)": { fr: "Anglais (ENG)", nl: "Engels (ENG)", en: "English (ENG)" },
  "Autre": { fr: "Autre", nl: "Andere", en: "Other" }
};

function translateOption(option: string, lang: 'fr' | 'nl' | 'en' = 'fr'): string {
  const translation = optionTranslations[option as keyof typeof optionTranslations];
  return translation ? translation[lang] : option;
}

const emailTranslations = {
  fr: {
    owner: {
      subject: (firstName: string, lastName: string, min: number, max: number, hasRange: boolean) => `🎨 Devis - ${firstName} ${lastName} - ${hasRange ? `${min}€ à ${max}€` : `${min}€`}`,
      title: "🎨 Nouveau Devis",
      subtitle: "Nouvelle demande reçue",
      categorySiteType: "Type de site",
      categoryExtraPages: "Pages supp.",
      categoryFeatures: "Fonctionnalités",
      categoryLanguages: "Langues",
      categoryOptimization: "Optimisation",
      categoryDomain: "Domaine",
      extraPages: (count: number) => `${count} page(s) sup.`,
      included: "Inclus",
      firstYear: "1ère année"
    },
    client: {
      subject: "✅ Votre estimation - GUAPO Web Designer",
      title: "Votre Estimation"
    }
  }
};

function getT(lang: 'fr' | 'nl' | 'en' = 'fr') {
  return emailTranslations[lang] || emailTranslations.fr;
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

function calculatePricing(data: any, lang: 'fr' | 'nl' | 'en' = 'fr') {
  let minTotal = 0, maxTotal = 0, monthlySubscription = 0, totalMonthlyForMenu = 0;
  const t = getT(lang);
  const isMenuProject = data.siteType.includes('Menu / Site de commande');

  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
  }

  if (data.menuSubscription) {
    const subKey = data.menuSubscription as keyof typeof PRICING.subscriptions;
    const subPrice = PRICING.subscriptions[subKey];
    if (subPrice) {
      monthlySubscription = subPrice;
      totalMonthlyForMenu = subPrice;
      monthlyBreakdown.push({ item: translateOption(data.menuSubscription, lang), price: subPrice });
    }
  }

  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let limit = 3;
    if (data.siteType.includes('4 à 5')) limit = 5;
    else if (data.siteType.includes('6 à 8')) limit = 8;
    else if (data.siteType.includes('9 à 12')) limit = 12;
    if (pageCount > limit) {
      const extra = pageCount - limit;
      minTotal += extra * PAGE_EXTRA_COST;
      maxTotal += extra * PAGE_EXTRA_COST;
    }
  }

  if (data.features) {
    data.features.forEach((f: string) => {
      const price = (PRICING.features as any)[f];
      if (price !== undefined) {
        minTotal += price; maxTotal += price;
      }
    });
  }

  if (data.optimization) {
    data.optimization.forEach((o: string) => {
      const price = (PRICING.optimization as any)[o];
      if (price !== undefined) { minTotal += price; maxTotal += price; }
    });
  }

  if (data.domain) {
    const price = (PRICING.domain as any)[data.domain];
    if (price !== undefined && price > 0) { minTotal += price; maxTotal += price; }
  }

  // Monthly breakdown and totals for Model B
  const monthlyBreakdown: any[] = [];
  if (data.menuSubscription) {
    const subKey = data.menuSubscription as keyof typeof PRICING.subscriptions;
    const subPrice = PRICING.subscriptions[subKey];
    if (subPrice) {
      totalMonthlyForMenu = subPrice;
      monthlyBreakdown.push({ item: translateOption(data.menuSubscription, lang), price: subPrice });
    }
  }

  if (isMenuProject && data.features) {
    data.features.forEach((f: string) => {
      const mPrice = (PRICING as any).monthlyMenuFeatures?.[f];
      if (mPrice !== undefined) {
        if (!data.menuSubscription) {
          totalMonthlyForMenu += mPrice;
        }
        // Always show in breakdown, but price 0 if included in pack
        monthlyBreakdown.push({ 
          item: translateOption(f, lang), 
          price: data.menuSubscription ? 0 : mPrice,
          isIncluded: !!data.menuSubscription 
        });
      }
    });
  }
  
  // Cap the monthly total based on the subscription pack if selected, or default to max pack price
  let monthlyCap = 35;
  if (data.menuSubscription === "Pack Menu Simple") monthlyCap = 25;
  if (isMenuProject && totalMonthlyForMenu > monthlyCap) totalMonthlyForMenu = monthlyCap;

  return {
    isMenuProject,
    hasRange: minTotal !== maxTotal,
    // Base prices
    baseMinHT: minTotal,
    baseMaxHT: maxTotal,
    // Discount info
    discountMin,
    discountMax,
    // HT after discount
    discountedMinHT,
    discountedMaxHT,
    // TVA
    tvaMin,
    tvaMax,
    // TTC
    minTotalTTC,
    maxTotalTTC,
    // Monthly (Model B or Pack for Model A Menu)
    menuMonthlyHT,
    menuMonthlyTVA,
    menuMonthlyTTC,
    // For specific UI parts
    monthlyBreakdown: monthlyBreakdown,
    totalMonthlyTTCForModelB: menuMonthlyTTC
  };
}

export async function sendQuoteEmail(data: any) {
  const lang = data.language || 'fr';
  const pricing = calculatePricing(data, lang);
  const t = getT(lang);

  const tableRows: any[] = [];
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) tableRows.push({ item: translateOption(data.siteType, lang), unique: siteTypePrice.min === siteTypePrice.max ? `${siteTypePrice.min}€` : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`, monthly: '-' });

  if (data.features) {
    data.features.forEach((f: string) => {
      const uPrice = (PRICING.features as any)[f];
      const mPrice = (PRICING as any).monthlyMenuFeatures?.[f];
      tableRows.push({ item: translateOption(f, lang), unique: uPrice !== undefined ? (uPrice > 0 ? `${uPrice}€` : 'Inclus') : '-', monthly: mPrice !== undefined ? `${mPrice}€` : '-' });
    });
  }

  if (data.menuSubscription) {
    const mPrice = (PRICING.subscriptions as any)[data.menuSubscription];
    tableRows.push({ item: translateOption(data.menuSubscription, lang), unique: '-', monthly: `${mPrice}€` });
  }

  const commonStyles = `
    body{font-family:sans-serif;color:#334155;margin:0;padding:20px;background:#f8fafc}
    .c{background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:25px;max-width:600px;margin:0 auto}
    .h{background:#1e293b;color:#fff;padding:20px;border-radius:12px 12px 0 0;text-align:center;margin-bottom:20px}
    table{width:100%;border-collapse:collapse;margin:15px 0;font-size:13px}
    th{background:#f8fafc;padding:10px;text-align:left;border-bottom:2px solid #e2e8f0}
    td{padding:10px;border-bottom:1px solid #f1f5f9}
    .box{border:1px solid #e2e8f0;border-radius:10px;padding:15px;background:#f8fafc;margin-bottom:15px}
    .btn{display:block;padding:12px;text-decoration:none;border-radius:6px;font-weight:700;text-align:center;font-size:14px;margin-top:10px}
    .btn-a{background:#1e293b;color:#fff}
    .btn-b{background:#10b981;color:#fff}
  `;

  const ownerEmailHtml = `
    <html><head><style>${commonStyles}</style></head><body>
      <div class="c">
        <div class="h"><h2>${t.owner.title}</h2></div>
        <p><strong>Client:</strong> ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}<br><strong>Email:</strong> ${data.email}<br><strong>Projet:</strong> ${escapeHtml(data.company || '-')}</p>
        <table>
          <thead><tr><th>Élément</th><th style="text-align:right">Unique</th><th style="text-align:right">Mensuel</th></tr></thead>
          <tbody>${tableRows.map(r => `<tr><td>${escapeHtml(r.item)}</td><td style="text-align:right">${r.unique}</td><td style="text-align:right">${r.monthly}</td></tr>`).join('')}</tbody>
        </table>
        <div class="box">
          <strong>Modèle A (Vente):</strong><br>
          Sous-total: ${pricing.hasRange ? `${pricing.baseMinHT}€ - ${pricing.baseMaxHT}€` : `${pricing.baseMinHT}€`} HTVA<br>
          Promo -30%: -${pricing.hasRange ? `${pricing.discountMin}€ - ${pricing.discountMax}€` : `${pricing.discountMin}€`} HTVA<br>
          Total HTVA: ${pricing.hasRange ? `${pricing.discountedMinHT}€ - ${pricing.discountedMaxHT}€` : `${pricing.discountedMinHT}€`}<br>
          TVA (21%): ${pricing.hasRange ? `${pricing.tvaMin}€ - ${pricing.tvaMax}€` : `${pricing.tvaMin}€`}<br>
          <strong>TOTAL TVAC: ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`}</strong>
          ${pricing.isMenuProject ? `<br><br>Abonnement Pack: ${pricing.menuMonthlyTTC}€/m TVAC` : ''}
        </div>
        ${pricing.isMenuProject ? `<div class="box" style="background:#ecfdf5"><strong>Modèle B (Abonnement):</strong> 0€ HTVA, Mensuel ${pricing.totalMonthlyTTCForModelB}€/m TVAC</div>` : ''}
        <a href="mailto:${data.email}" class="btn btn-a">Répondre au client</a>
      </div>
    </body></html>
  `;

  const clientEmailHtml = `
    <html><head><style>${commonStyles}</style></head><body>
      <div class="c">
        <div class="h"><h1>${t.client.title}</h1></div>
        <p>Bonjour <strong>${escapeHtml(data.firstName)}</strong>,</p>
        <p>Voici l'estimation pour votre projet <strong>${escapeHtml(data.company || 'web')}</strong> :</p>
        
        <div style="background:#fefce8;border:1px solid #fef08a;padding:10px;border-radius:8px;margin-bottom:15px;text-align:center">
          <span style="font-size:16px">🎁 <strong>PROMOTION EXCEPTIONNELLE -30%</strong></span><br>
          <span style="font-size:12px;color:#854d0e">Valable sur votre investissement initial jusqu'au 31/12/2025</span>
        </div>

        <table>
          <thead><tr><th>Description</th><th style="text-align:right">HTVA</th><th style="text-align:right">Mensuel</th></tr></thead>
          <tbody>${tableRows.map(r => `<tr><td>${escapeHtml(r.item)}</td><td style="text-align:right">${r.unique}</td><td style="text-align:right;color:#0ea5e9">${r.monthly}</td></tr>`).join('')}</tbody>
        </table>

        ${pricing.isMenuProject ? `
          <div style="display:table;width:100%;border-spacing:10px 0;margin:20px 0">
            <div style="display:table-cell;width:50%;vertical-align:top" class="box">
              <div style="font-weight:800;text-align:center">MODÈLE A</div>
              <div style="font-size:10px;text-align:center;color:#64748b;margin-bottom:10px">INVESTISSEMENT UNIQUE</div>
              
              <div style="font-size:12px;border-top:1px solid #e2e8f0;padding-top:8px">
                Prix normal: <span style="text-decoration:line-through">${pricing.hasRange ? `${pricing.baseMinHT}€ - ${pricing.baseMaxHT}€` : `${pricing.baseMinHT}€`}</span> HTVA<br>
                <span style="color:#16a34a">Promotion -30%: -${pricing.hasRange ? `${pricing.discountMin}€ - ${pricing.discountMax}€` : `${pricing.discountMin}€`} HTVA</span><br>
                Total HTVA: <strong>${pricing.hasRange ? `${pricing.discountedMinHT}€ - ${pricing.discountedMaxHT}€` : `${pricing.discountedMinHT}€`}</strong><br>
                TVA (21%): ${pricing.hasRange ? `${pricing.tvaMin}€ - ${pricing.tvaMax}€` : `${pricing.tvaMin}€`}<br>
                <div style="font-size:14px;margin-top:5px;font-weight:800">TOTAL TVAC: ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`}</div>
                <br>
                Abonnement Pack: <strong>${pricing.menuMonthlyTTC}€/m TVAC</strong>
                <div style="font-size:9px;color:#64748b;margin-top:4px">(Gestion, maintenance, accès plateforme)</div>
              </div>
              <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn btn-a">CHOISIR MODÈLE A</a>
            </div>
            <div style="display:table-cell;width:50%;vertical-align:top" class="box" style="background:#ecfdf5;border-color:#a7f3d0">
              <div style="font-weight:800;text-align:center;color:#065f46">MODÈLE B</div>
              <div style="font-size:10px;text-align:center;color:#059669;margin-bottom:10px">OPTION ABONNEMENT</div>
              <div style="font-size:12px;border-top:1px solid #a7f3d0;padding-top:8px;color:#065f46">
                Mise en service: <strong>0€</strong><br>
                ${pricing.monthlyBreakdown.map((i: any) => `<div style="font-size:10px">${escapeHtml(i.item)}: ${i.price === 0 ? 'Inclus' : `${i.price}€/m`}</div>`).join('')}
                <div style="margin-top:10px;padding-top:8px;border-top:1px dashed #a7f3d0">
                  Sous-total: ${pricing.menuMonthlyHT}€/m HTVA<br>
                  TVA (21%): ${pricing.menuMonthlyTVA}€/m<br>
                  <div style="font-size:14px;margin-top:5px;font-weight:800">TOTAL: ${pricing.menuMonthlyTTC}€/m TVAC</div>
                </div>
              </div>
              <a href="https://guapowebdesigner.com/confirm-quote?model=B&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn btn-b">CHOISIR MODÈLE B</a>
            </div>
          </div>
        ` : `
          <div class="box" style="text-align:center">
            <div style="font-weight:800;margin-bottom:10px">VOTRE ESTIMATION DÉTAILLÉE</div>
            <div style="text-align:left;max-width:300px;margin:0 auto;font-size:13px">
              Sous-total: ${pricing.hasRange ? `${pricing.baseMinHT}€ - ${pricing.baseMaxHT}€` : `${pricing.baseMinHT}€`} HTVA<br>
              <span style="color:#16a34a">Promotion -30%: -${pricing.hasRange ? `${pricing.discountMin}€ - ${pricing.discountMax}€` : `${pricing.discountMin}€`} HTVA</span><br>
              Total HTVA: <strong>${pricing.hasRange ? `${pricing.discountedMinHT}€ - ${pricing.discountedMaxHT}€` : `${pricing.discountedMinHT}€`}</strong><br>
              TVA (21%): ${pricing.hasRange ? `${pricing.tvaMin}€ - ${pricing.tvaMax}€` : `${pricing.tvaMin}€`}<br>
              <div style="font-size:18px;font-weight:800;color:#10b981;margin-top:10px;border-top:2px solid #e2e8f0;padding-top:10px">TOTAL TVAC: ${pricing.hasRange ? `${pricing.minTotalTTC}€ - ${pricing.maxTotalTTC}€` : `${pricing.minTotalTTC}€`}</div>
            </div>
            <a href="https://guapowebdesigner.com/confirm-quote?model=A&firstName=${encodeURIComponent(data.firstName)}&lastName=${encodeURIComponent(data.lastName)}&email=${encodeURIComponent(data.email)}&company=${encodeURIComponent(data.company || '')}&siteType=${encodeURIComponent(data.siteType)}" class="btn btn-b">VALIDER LE PROJET</a>
          </div>
        `}
        <div style="text-align:center;margin-top:20px">
          <a href="mailto:info@guapowebdesigner.com" style="color:#64748b;font-size:12px;text-decoration:none">Une question ? Répondez à cet email.</a>
        </div>
      </div>
    </body></html>
  `;

    try {
      const from = process.env.EMAIL_FROM || 'onboarding@resend.dev';
      const toOwner = process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com';

      console.log('Sending emails from:', from);

      await resend.emails.send({ 
        from, 
        to: toOwner, 
        replyTo: data.email, 
        subject: `Devis: ${data.firstName} ${data.lastName}`, 
        html: ownerEmailHtml 
      });
      
      await resend.emails.send({ 
        from, 
        to: data.email, 
        replyTo: toOwner, 
        subject: t.client.subject, 
        html: clientEmailHtml 
      });

      return { success: true };
    } catch (error) {
      console.error('Email error details:', error);
      throw error;
    }
}
