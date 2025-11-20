import { Resend } from 'resend';
import { PRICING } from './pricing';

const resend = new Resend(process.env.RESEND_API_KEY);

// Prix par page supplémentaire
const PAGE_EXTRA_COST = 100;

function calculatePricing(data: {
  siteType: string;
  pageCount?: number;
  features?: string[];
  optimization?: string[];
  domain?: string;
  languages?: string[];
  otherLanguages?: string;
}) {
  let minTotal = 0;
  let maxTotal = 0;
  const breakdown: { category: string; item: string; price: string }[] = [];

  // Type de site (prix de base)
  const siteTypeKey = data.siteType as keyof typeof PRICING.siteTypes;
  const siteTypePrice = PRICING.siteTypes[siteTypeKey];
  if (siteTypePrice) {
    minTotal += siteTypePrice.min;
    maxTotal += siteTypePrice.max;
    breakdown.push({
      category: '🎨 Type de site',
      item: data.siteType,
      price: siteTypePrice.min === siteTypePrice.max 
        ? `${siteTypePrice.min}€` 
        : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`
    });
  }

  // Pages supplémentaires
  if (data.pageCount) {
    const pageCount = parseInt(data.pageCount.toString());
    let basePagesLimit = 3;
    
    if (data.siteType.includes('1 à 3 pages')) {
      basePagesLimit = 3;
    } else if (data.siteType.includes('4 à 5 pages')) {
      basePagesLimit = 5;
    } else if (data.siteType.includes('6 à 8 pages')) {
      basePagesLimit = 8;
    } else if (data.siteType.includes('9 à 12 pages')) {
      basePagesLimit = 12;
    }
    
    if (pageCount > basePagesLimit) {
      const extraPages = pageCount - basePagesLimit;
      const extraCost = extraPages * PAGE_EXTRA_COST;
      minTotal += extraCost;
      maxTotal += extraCost;
      breakdown.push({
        category: '📄 Pages supplémentaires',
        item: `${extraPages} page(s) supplémentaire(s)`,
        price: `${extraCost}€`
      });
    }
  }

  // Fonctionnalités
  if (data.features && data.features.length > 0) {
    data.features.forEach(feature => {
      const featureKey = feature as keyof typeof PRICING.features;
      const price = PRICING.features[featureKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: '⚡ Fonctionnalités',
          item: feature,
          price: price > 0 ? `${price}€` : 'Inclus'
        });
      }
    });
  }

  // Langues sélectionnées (si multilingue activé)
  if (data.languages && data.languages.length > 0) {
    const langList = [...data.languages];
    if (data.otherLanguages) {
      langList.push(`Autre: ${data.otherLanguages}`);
    }
    breakdown.push({
      category: '🌐 Langues',
      item: langList.join(', '),
      price: 'Inclus dans Multilingue'
    });
  }

  // Optimisation & Sécurité
  if (data.optimization && data.optimization.length > 0) {
    data.optimization.forEach(opt => {
      const optKey = opt as keyof typeof PRICING.optimization;
      const price = PRICING.optimization[optKey];
      if (price !== undefined) {
        minTotal += price;
        maxTotal += price;
        breakdown.push({
          category: '🔒 Optimisation & Sécurité',
          item: opt,
          price: price > 0 ? `${price}€` : 'Inclus'
        });
      }
    });
  }

  // Nom de domaine
  if (data.domain) {
    const domainKey = data.domain as keyof typeof PRICING.domain;
    const price = PRICING.domain[domainKey];
    if (price !== undefined && price > 0) {
      minTotal += price;
      maxTotal += price;
      breakdown.push({
        category: '🌐 Nom de domaine',
        item: `${data.domain} (première année)`,
        price: `${price}€`
      });
    }
  }

  return { minTotal, maxTotal, breakdown };
}

export async function sendQuoteEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  company?: string;
  sector?: string;
  siteType: string;
  pageCount?: number;
  features?: string[];
  languages?: string[];
  otherLanguages?: string;
  optimization?: string[];
  hosting?: string;
  domain?: string;
  message: string;
}) {
  console.log('🚀 Starting email send process with Resend...');
  console.log('📧 Email FROM:', process.env.EMAIL_FROM || 'onboarding@resend.dev');
  console.log('📧 Owner Email TO:', process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com');
  console.log('📧 Client Email TO:', data.email);
  
  // Calculer les prix
  const pricing = calculatePricing({
    siteType: data.siteType,
    pageCount: data.pageCount,
    features: data.features,
    languages: data.languages,
    otherLanguages: data.otherLanguages,
    optimization: data.optimization,
    domain: data.domain
  });

  console.log('💰 Pricing calculated:', `${pricing.minTotal}€ - ${pricing.maxTotal}€`);

  // Grouper les éléments par catégorie
  const groupedBreakdown = pricing.breakdown.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push({ item: item.item, price: item.price });
    return acc;
  }, {} as Record<string, { item: string; price: string }[]>);

  // EMAIL 1: Pour le propriétaire (avec tous les détails)
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .urgent-badge {
            display: inline-block;
            background: #7c3aed;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 2px 4px rgba(124, 58, 237, 0.4);
          }
          .content {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 30px;
          }
          .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          .section:last-child {
            border-bottom: none;
          }
          .section-title {
            font-size: 18px;
            font-weight: 600;
            color: #8b5cf6;
            margin-bottom: 12px;
          }
          .info-row {
            margin-bottom: 10px;
          }
          .label {
            font-weight: 600;
            color: #4a5568;
          }
          .value {
            color: #2d3748;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 3px solid #8b5cf6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
          }
          .price-title {
            font-size: 22px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 20px;
          }
          .price-breakdown {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .price-category {
            font-size: 16px;
            font-weight: 600;
            color: #8b5cf6;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-item:last-child {
            border-bottom: none;
          }
          .price-item-name {
            flex: 1;
            color: #374151;
          }
          .price-item-value {
            font-weight: 600;
            color: #8b5cf6;
            margin-left: 15px;
            white-space: nowrap;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .price-note {
            text-align: center;
            font-size: 13px;
            color: #6d28d9;
            margin-top: 15px;
            font-style: italic;
          }
          .hosting-note {
            background: #dcfce7;
            border: 2px solid #86efac;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
          }
          .hosting-note strong {
            color: #15803d;
          }
          .features-list {
            list-style: none;
            padding: 0;
          }
          .features-list li {
            padding: 5px 0 5px 20px;
            position: relative;
          }
          .features-list li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #8b5cf6;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="urgent-badge">🆕 NOUVEAU</div>
          <h1>📋 Nouvelle Demande de Devis</h1>
        </div>
        <div class="content">
          <div class="section">
            <div class="section-title">👤 Informations du Client</div>
            <div class="info-row">
              <span class="label">Nom complet:</span> 
              <span class="value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</span>
            </div>
            <div class="info-row">
              <span class="label">Email:</span> 
              <span class="value">${escapeHtml(data.email)}</span>
            </div>
            ${data.company ? `
            <div class="info-row">
              <span class="label">Entreprise:</span> 
              <span class="value">${escapeHtml(data.company)}</span>
            </div>
            ` : ''}
            ${data.sector ? `
            <div class="info-row">
              <span class="label">Secteur d'activité:</span> 
              <span class="value">${escapeHtml(data.sector)}</span>
            </div>
            ` : ''}
          </div>

          <!-- PRIX ESTIMÉ -->
          <div class="price-section">
            <div class="price-title">💰 Estimation Tarifaire</div>
            
            <div class="price-breakdown">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div style="margin-bottom: 20px;">
                  <div class="price-category">${category}</div>
                  ${items.map(({ item, price }) => `
                    <div class="price-item">
                      <span class="price-item-name">${escapeHtml(item)}</span>
                      <span class="price-item-value">${escapeHtml(price)}</span>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>

            <div class="price-total">
              Estimation: ${pricing.minTotal}€ - ${pricing.maxTotal}€
            </div>

            <div class="hosting-note">
              <strong>✅ Hébergement inclus:</strong> L'hébergement du site est automatiquement inclus dans le forfait (hébergement haute performance avec SSL).
            </div>

            <div class="price-note">
              ⚠️ Cette estimation est indicative et peut varier selon les spécifications exactes du projet.<br>
              Un devis détaillé et personnalisé sera établi après discussion.
            </div>
          </div>

          <div class="section">
            <div class="section-title">🎯 Détails du Projet</div>
            <div class="info-row">
              <span class="label">Type de site:</span> 
              <span class="value">${escapeHtml(data.siteType)}</span>
            </div>
            ${data.pageCount ? `
            <div class="info-row">
              <span class="label">Nombre de pages:</span> 
              <span class="value">${escapeHtml(data.pageCount.toString())} pages</span>
            </div>
            ` : ''}
            <div class="info-row">
              <span class="label">Hébergement:</span> 
              <span class="value">${data.hosting || 'Inclus dans le projet'}</span>
            </div>
            <div class="info-row">
              <span class="label">Nom de domaine:</span> 
              <span class="value">${data.domain || 'À discuter'}</span>
            </div>
          </div>

          ${data.features && data.features.length > 0 ? `
          <div class="section">
            <div class="section-title">✨ Fonctionnalités Souhaitées</div>
            <ul class="features-list">
              ${data.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          ${data.optimization && data.optimization.length > 0 ? `
          <div class="section">
            <div class="section-title">🔒 Optimisation & Sécurité</div>
            <ul class="features-list">
              ${data.optimization.map(opt => `<li>${escapeHtml(opt)}</li>`).join('')}
            </ul>
          </div>
          ` : ''}

          <div class="section">
            <div class="section-title">📝 Description du Projet</div>
            <p class="value">${escapeHtml(data.message).replace(/\n/g, '<br>')}</p>
          </div>

          <div style="text-align: center;">
            <a href="mailto:${escapeHtml(data.email)}" class="cta-button">
              Répondre au Client
            </a>
          </div>
        </div>

        <div class="footer">
          <p>Cette demande a été envoyée depuis le formulaire de devis de GUAPO Web Designer</p>
          <p style="margin-top: 10px;">© 2025 GUAPO Web Designer</p>
        </div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client (confirmation avec prix)
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 700px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .success-badge {
            display: inline-block;
            background: #16a34a;
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
            box-shadow: 0 2px 4px rgba(22, 163, 74, 0.4);
          }
          .content {
            background: #ffffff;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 30px;
          }
          .greeting {
            font-size: 18px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .section {
            margin-bottom: 25px;
            padding-bottom: 20px;
            border-bottom: 1px solid #e2e8f0;
          }
          .section:last-child {
            border-bottom: none;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 3px solid #8b5cf6;
            border-radius: 12px;
            padding: 25px;
            margin: 25px 0;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.2);
          }
          .price-title {
            font-size: 22px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 20px;
          }
          .price-breakdown {
            background: white;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
          }
          .price-category {
            font-size: 16px;
            font-weight: 600;
            color: #8b5cf6;
            margin-bottom: 10px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-item:last-child {
            border-bottom: none;
          }
          .price-item-name {
            flex: 1;
            color: #374151;
          }
          .price-item-value {
            font-weight: 600;
            color: #8b5cf6;
            margin-left: 15px;
            white-space: nowrap;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            font-size: 24px;
            font-weight: 700;
            margin-top: 20px;
            box-shadow: 0 4px 6px rgba(139, 92, 246, 0.3);
          }
          .price-note {
            text-align: center;
            font-size: 13px;
            color: #6d28d9;
            margin-top: 15px;
            font-style: italic;
          }
          .hosting-note {
            background: #dcfce7;
            border: 2px solid #86efac;
            border-radius: 8px;
            padding: 15px;
            margin-top: 15px;
          }
          .hosting-note strong {
            color: #15803d;
          }
          .next-steps {
            background: #fef2f2;
            border-left: 4px solid #8b5cf6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .next-steps-title {
            font-size: 18px;
            font-weight: 600;
            color: #6d28d9;
            margin-bottom: 15px;
          }
          .next-steps ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .next-steps li {
            padding: 8px 0;
            color: #4b5563;
          }
          .next-steps li:before {
            content: "✓";
            color: #8b5cf6;
            font-weight: bold;
            margin-right: 10px;
          }
          .contact-info {
            background: #f3e8ff;
            border: 2px solid #c4b5fd;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            margin: 25px 0;
          }
          .contact-info strong {
            color: #8b5cf6;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e2e8f0;
            color: #718096;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="success-badge">✅ CONFIRMÉ</div>
          <h1>✅ Demande de Devis Reçue</h1>
        </div>
        <div class="content">
          <div class="greeting">
            Bonjour ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},
          </div>

          <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
            Merci d'avoir fait confiance à <strong style="color: #8b5cf6;">GUAPO Web Designer</strong> pour votre projet !
          </p>

          <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
            Nous avons bien reçu votre demande de devis pour <strong style="color: #8b5cf6;">${escapeHtml(data.company || 'votre projet')}</strong> 
            concernant un <strong style="color: #8b5cf6;">${escapeHtml(data.siteType)}</strong>.
          </p>

          <!-- ESTIMATION TARIFAIRE POUR LE CLIENT -->
          <div class="price-section">
            <div class="price-title">💰 Votre Estimation</div>
            
            <div class="price-breakdown">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div style="margin-bottom: 20px;">
                  <div class="price-category">${category}</div>
                  ${items.map(({ item, price }) => `
                    <div class="price-item">
                      <span class="price-item-name">${escapeHtml(item)}</span>
                      <span class="price-item-value">${escapeHtml(price)}</span>
                    </div>
                  `).join('')}
                </div>
              `).join('')}
            </div>

            <div class="price-total">
              Estimation: ${pricing.minTotal}€ - ${pricing.maxTotal}€
            </div>

            <div class="hosting-note">
              <strong>✅ Hébergement inclus:</strong> L'hébergement haute performance avec certificat SSL est automatiquement inclus dans votre forfait.
            </div>

            <div class="price-note">
              ℹ️ Cette estimation est indicative et basée sur les informations que vous nous avez fournies.<br>
              Nous vous enverrons un devis détaillé et personnalisé sous 24-48 heures.
            </div>
          </div>

          <div class="next-steps">
            <div class="next-steps-title">📋 Prochaines Étapes</div>
            <ul>
              <li>Notre équipe étudie attentivement votre demande</li>
              <li>Vous recevrez un <strong style="color: #8b5cf6;">devis détaillé sous 24-48 heures</strong></li>
              <li>Nous vous contacterons pour discuter de votre projet</li>
              <li>Nous répondrons à toutes vos questions</li>
            </ul>
          </div>

          <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">
            En attendant, n'hésitez pas à nous contacter si vous avez des questions ou des informations complémentaires à nous transmettre.
          </p>

          <div class="contact-info">
            <p style="margin: 5px 0;">
              📧 <strong>Email:</strong> info@guapowebdesigner.com
            </p>
            <p style="margin: 5px 0;">
              📱 <strong>Instagram:</strong> @guapo_webdesigner
            </p>
          </div>

          <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin-top: 25px;">
            À très bientôt,<br>
            <strong style="color: #8b5cf6;">L'équipe GUAPO Web Designer</strong>
          </p>
        </div>

        <div class="footer">
          <p>© 2025 GUAPO Web Designer</p>
          <p style="margin-top: 10px;">Cet email a été envoyé en réponse à votre demande de devis</p>
        </div>
      </body>
    </html>
  `;

  try {
    console.log('📨 Sending emails via Resend...');
    
    // Envoyer EMAIL 1: Au propriétaire
    console.log('📧 1/2 - Sending email to owner...');
    const ownerResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: data.email,
      subject: `🎨 Nouvelle demande de devis - ${data.firstName} ${data.lastName} - Estimation: ${pricing.minTotal}€-${pricing.maxTotal}€`,
      html: ownerEmailHtml,
    });
    console.log('✅ 1/2 - Owner email sent successfully!', ownerResult);

    // Envoyer EMAIL 2: Au client (TEMPORAIRE: envoyé au propriétaire aussi car domaine non vérifié)
    // Une fois le domaine vérifié dans Resend, changer 'to:' pour utiliser data.email
    console.log('📧 2/2 - Sending confirmation email to client (TEMP: sent to owner)...');
    const clientResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com', // TEMPORAIRE: devrait être data.email
      replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      subject: `✅ [COPIE CLIENT - ${data.email}] Confirmation de votre demande de devis - GUAPO Web Designer`,
      html: clientEmailHtml,
    });
    console.log('✅ 2/2 - Client email sent successfully!', clientResult);

    console.log('🎉 Email process completed with Resend!');
    console.log('⚠️ IMPORTANT: Le domaine Resend n\'est pas encore vérifié. L\'email de confirmation du client est envoyé à votre adresse.');
    console.log('📝 Pour envoyer directement aux clients: Vérifiez votre domaine sur resend.com/domains');
    return { success: true };
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}