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

  // EMAIL 1: Pour le propriétaire (VERSION SIMPLIFIÉE)
  const ownerEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 25px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 25px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .info-item {
            padding: 10px;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 600;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .price-title {
            font-size: 18px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 15px;
          }
          .price-grid {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-category {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
          }
          .price-value {
            font-weight: 600;
            color: #8b5cf6;
            font-size: 14px;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
          }
          .message-box {
            background: #f9fafb;
            border-left: 4px solid #8b5cf6;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
          }
          .message-title {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-bottom: 10px;
          }
          .message-text {
            color: #4b5563;
            font-size: 14px;
            line-height: 1.6;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 12px 25px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 15px;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🆕 Nouvelle Demande de Devis</h1>
        </div>
        <div class="content">
          <!-- Grille d'informations client -->
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Client</div>
              <div class="info-value">${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)}</div>
            </div>
            <div class="info-item">
              <div class="info-label">Email</div>
              <div class="info-value">${escapeHtml(data.email)}</div>
            </div>
            ${data.company ? `
            <div class="info-item">
              <div class="info-label">Entreprise</div>
              <div class="info-value">${escapeHtml(data.company)}</div>
            </div>
            ` : ''}
            ${data.sector ? `
            <div class="info-item">
              <div class="info-label">Secteur</div>
              <div class="info-value">${escapeHtml(data.sector)}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Type de site</div>
              <div class="info-value">${escapeHtml(data.siteType)}</div>
            </div>
            ${data.pageCount ? `
            <div class="info-item">
              <div class="info-label">Pages</div>
              <div class="info-value">${escapeHtml(data.pageCount.toString())}</div>
            </div>
            ` : ''}
          </div>

          <!-- Estimation tarifaire -->
          <div class="price-section">
            <div class="price-title">💰 Estimation</div>
            
            <div class="price-grid">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div class="price-category">${category}</div>
                ${items.map(({ item, price }) => `
                  <div class="price-row">
                    <span class="price-label">${escapeHtml(item)}</span>
                    <span class="price-value">${escapeHtml(price)}</span>
                  </div>
                `).join('')}
              `).join('')}
            </div>

            <div class="price-total">
              ${pricing.minTotal}€ - ${pricing.maxTotal}€
            </div>
          </div>

          <!-- Message du client -->
          ${data.message ? `
          <div class="message-box">
            <div class="message-title">💬 Message du client</div>
            <div class="message-text">${escapeHtml(data.message).replace(/\n/g, '<br>')}</div>
          </div>
          ` : ''}

          <div style="text-align: center;">
            <a href="mailto:${escapeHtml(data.email)}" class="cta-button">
              Répondre au Client
            </a>
          </div>
        </div>

        <div class="footer">
          © 2025 GUAPO Web Designer
        </div>
      </body>
    </html>
  `;

  // EMAIL 2: Pour le client (AVEC CONFIRMATION)
  const clientEmailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 650px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .header {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 25px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 24px;
          }
          .content {
            background: white;
            border: 2px solid #e2e8f0;
            border-radius: 0 0 10px 10px;
            padding: 25px;
          }
          .greeting {
            font-size: 16px;
            color: #1f2937;
            margin-bottom: 20px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin: 20px 0;
            padding: 20px;
            background: #f9fafb;
            border-radius: 8px;
          }
          .info-item {
            padding: 10px;
          }
          .info-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 5px;
          }
          .info-value {
            font-size: 15px;
            color: #1f2937;
            font-weight: 600;
          }
          .price-section {
            background: linear-gradient(135deg, #f3e8ff 0%, #e9d5ff 100%);
            border: 2px solid #8b5cf6;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
          }
          .price-title {
            font-size: 18px;
            font-weight: 700;
            color: #6d28d9;
            text-align: center;
            margin-bottom: 15px;
          }
          .price-grid {
            background: white;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
          }
          .price-row {
            display: flex;
            justify-content: space-between;
            padding: 10px 0;
            border-bottom: 1px solid #f3f4f6;
          }
          .price-row:last-child {
            border-bottom: none;
          }
          .price-category {
            font-size: 14px;
            font-weight: 600;
            color: #8b5cf6;
            margin-top: 15px;
            margin-bottom: 8px;
            padding-bottom: 5px;
            border-bottom: 2px solid #e9d5ff;
          }
          .price-category:first-child {
            margin-top: 0;
          }
          .price-label {
            color: #374151;
            font-size: 14px;
          }
          .price-value {
            font-weight: 600;
            color: #8b5cf6;
            font-size: 14px;
          }
          .price-total {
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
          }
          .note-box {
            background: #dcfce7;
            border: 2px solid #86efac;
            border-radius: 8px;
            padding: 12px;
            margin-top: 12px;
            font-size: 13px;
            color: #15803d;
            text-align: center;
          }
          .confirmation-box {
            background: #fef3c7;
            border: 3px solid #fbbf24;
            border-radius: 10px;
            padding: 25px;
            margin: 25px 0;
            text-align: center;
          }
          .confirmation-title {
            font-size: 20px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 15px;
          }
          .confirmation-text {
            font-size: 15px;
            color: #78350f;
            margin-bottom: 20px;
            line-height: 1.6;
          }
          .button-group {
            display: flex;
            gap: 15px;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 20px;
          }
          .btn-confirm {
            display: inline-block;
            background: linear-gradient(135deg, #16a34a 0%, #22c55e 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
          }
          .btn-comment {
            display: inline-block;
            background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
            color: white;
            padding: 14px 28px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 700;
            font-size: 15px;
          }
          .next-steps {
            background: #f9fafb;
            border-left: 4px solid #8b5cf6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
          }
          .next-steps-title {
            font-size: 16px;
            font-weight: 600;
            color: #6d28d9;
            margin-bottom: 12px;
          }
          .next-steps ul {
            list-style: none;
            padding: 0;
            margin: 0;
          }
          .next-steps li {
            padding: 6px 0;
            color: #4b5563;
            font-size: 14px;
          }
          .next-steps li:before {
            content: "✓";
            color: #8b5cf6;
            font-weight: bold;
            margin-right: 10px;
          }
          .contact-info {
            text-align: center;
            padding: 15px;
            background: #f3e8ff;
            border-radius: 8px;
            margin: 20px 0;
            font-size: 14px;
          }
          .contact-info strong {
            color: #8b5cf6;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #e2e8f0;
            color: #9ca3af;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>✅ Demande Reçue</h1>
        </div>
        <div class="content">
          <div class="greeting">
            Bonjour ${escapeHtml(data.firstName)} ${escapeHtml(data.lastName)},
          </div>

          <p style="font-size: 15px; color: #1f2937;">
            Merci d'avoir fait confiance à <strong style="color: #8b5cf6;">GUAPO Web Designer</strong> ! 
            Nous avons bien reçu votre demande pour <strong>${escapeHtml(data.company || 'votre projet')}</strong>.
          </p>

          <!-- Récapitulatif -->
          <div class="info-grid">
            <div class="info-item">
              <div class="info-label">Type de site</div>
              <div class="info-value">${escapeHtml(data.siteType)}</div>
            </div>
            ${data.pageCount ? `
            <div class="info-item">
              <div class="info-label">Pages prévues</div>
              <div class="info-value">${escapeHtml(data.pageCount.toString())}</div>
            </div>
            ` : ''}
            ${data.domain ? `
            <div class="info-item">
              <div class="info-label">Domaine</div>
              <div class="info-value">${escapeHtml(data.domain)}</div>
            </div>
            ` : ''}
            <div class="info-item">
              <div class="info-label">Hébergement</div>
              <div class="info-value">Inclus ✓</div>
            </div>
          </div>

          <!-- Estimation -->
          <div class="price-section">
            <div class="price-title">💰 Votre Estimation</div>
            
            <div class="price-grid">
              ${Object.entries(groupedBreakdown).map(([category, items]) => `
                <div class="price-category">${category}</div>
                ${items.map(({ item, price }) => `
                  <div class="price-row">
                    <span class="price-label">${escapeHtml(item)}</span>
                    <span class="price-value">${escapeHtml(price)}</span>
                  </div>
                `).join('')}
              `).join('')}
            </div>

            <div class="price-total">
              ${pricing.minTotal}€ - ${pricing.maxTotal}€
            </div>

            <div class="note-box">
              ✅ <strong>Hébergement inclus</strong> - SSL et performances optimales
            </div>
          </div>

          <!-- SECTION CONFIRMATION -->
          <div class="confirmation-box">
            <div class="confirmation-title">📋 Cette estimation vous convient ?</div>
            <div class="confirmation-text">
              Confirmez votre intérêt ou ajoutez un commentaire pour préciser vos besoins. 
              Nous vous répondrons avec un devis détaillé sous 24-48h.
            </div>
            <div class="button-group">
              <a href="mailto:info@guapowebdesigner.com?subject=Confirmation%20devis%20-%20${encodeURIComponent(data.firstName + ' ' + data.lastName)}&body=Bonjour%2C%0A%0AJe%20confirme%20mon%20int%C3%A9r%C3%AAt%20pour%20l'estimation%20re%C3%A7ue%20(${pricing.minTotal}%E2%82%AC%20-%20${pricing.maxTotal}%E2%82%AC).%0A%0AMon%20projet%3A%20${encodeURIComponent(data.company || 'Non spécifié')}%0AType%20de%20site%3A%20${encodeURIComponent(data.siteType)}%0A%0A%E2%9C%85%20Je%20suis%20d'accord%20pour%20continuer%0A%0ACommentaire%20(optionnel)%3A%0A%0A%0ACordialement%2C%0A${encodeURIComponent(data.firstName + ' ' + data.lastName)}" class="btn-confirm">
                ✅ Confirmer mon intérêt
              </a>
              <a href="mailto:info@guapowebdesigner.com?subject=Question%20sur%20devis%20-%20${encodeURIComponent(data.firstName + ' ' + data.lastName)}&body=Bonjour%2C%0A%0AJ'ai%20re%C3%A7u%20l'estimation%20pour%20mon%20projet%20(${pricing.minTotal}%E2%82%AC%20-%20${pricing.maxTotal}%E2%82%AC).%0A%0AMon%20projet%3A%20${encodeURIComponent(data.company || 'Non spécifié')}%0AType%20de%20site%3A%20${encodeURIComponent(data.siteType)}%0A%0AJ'aimerais%20discuter%20des%20points%20suivants%3A%0A%0A%0A%0ACordialement%2C%0A${encodeURIComponent(data.firstName + ' ' + data.lastName)}" class="btn-comment">
                💬 Ajouter un commentaire
              </a>
            </div>
          </div>

          <!-- Prochaines étapes -->
          <div class="next-steps">
            <div class="next-steps-title">📋 Prochaines Étapes</div>
            <ul>
              <li>Notre équipe étudie votre demande</li>
              <li>Devis détaillé sous 24-48 heures</li>
              <li>Discussion de votre projet</li>
              <li>Réponse à vos questions</li>
            </ul>
          </div>

          <div class="contact-info">
            📧 <strong>info@guapowebdesigner.com</strong><br>
            📱 <strong>@guapo_webdesigner</strong>
          </div>

          <p style="font-size: 15px; color: #1f2937; margin-top: 20px;">
            À très bientôt,<br>
            <strong style="color: #8b5cf6;">L'équipe GUAPO</strong>
          </p>
        </div>

        <div class="footer">
          © 2025 GUAPO Web Designer
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
      subject: `🎨 Nouvelle demande - ${data.firstName} ${data.lastName} - ${pricing.minTotal}€-${pricing.maxTotal}€`,
      html: ownerEmailHtml,
    });
    console.log('✅ 1/2 - Owner email sent successfully!', ownerResult);

    // Envoyer EMAIL 2: Au client
    console.log('📧 2/2 - Sending confirmation email to client...');
    const clientResult = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: data.email,
      replyTo: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      subject: `✅ Votre estimation - GUAPO Web Designer`,
      html: clientEmailHtml,
    });
    console.log('✅ 2/2 - Client email sent successfully!', clientResult);

    console.log('🎉 Email process completed with Resend!');
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