import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  console.warn('Missing RESEND_API_KEY environment variable');
}

export const resend = new Resend(process.env.RESEND_API_KEY || '');

export async function sendQuoteEmail(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company?: string;
  websiteType: string;
  budget: string;
  timeline: string;
  description: string;
  features?: string[];
}) {
  const websiteTypeLabels = {
    vitrine: 'Site Vitrine',
    ecommerce: 'Site E-commerce',
    blog: 'Blog',
    portfolio: 'Portfolio',
    application: 'Application Web',
    autre: 'Autre'
  };

  const budgetLabels = {
    'moins-2000': 'Moins de 2000€',
    '2000-5000': '2000€ - 5000€',
    '5000-10000': '5000€ - 10000€',
    'plus-10000': 'Plus de 10000€',
    'a-discuter': 'À discuter'
  };

  const timelineLabels = {
    urgent: 'Urgent (moins de 2 semaines)',
    '1-mois': '1 mois',
    '2-3-mois': '2-3 mois',
    flexible: 'Flexible'
  };

  const emailHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #9f7aea 0%, #b794f4 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
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
            color: #9f7aea;
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
            color: #9f7aea;
            font-weight: bold;
          }
          .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #9f7aea 0%, #b794f4 100%);
            color: white;
            padding: 12px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            margin-top: 20px;
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
            <div class="info-row">
              <span class="label">Téléphone:</span> 
              <span class="value">${escapeHtml(data.phone)}</span>
            </div>
            ${data.company ? `
            <div class="info-row">
              <span class="label">Entreprise:</span> 
              <span class="value">${escapeHtml(data.company)}</span>
            </div>
            ` : ''}
          </div>

          <div class="section">
            <div class="section-title">🎯 Détails du Projet</div>
            <div class="info-row">
              <span class="label">Type de site:</span> 
              <span class="value">${websiteTypeLabels[data.websiteType as keyof typeof websiteTypeLabels]}</span>
            </div>
            <div class="info-row">
              <span class="label">Budget estimé:</span> 
              <span class="value">${budgetLabels[data.budget as keyof typeof budgetLabels]}</span>
            </div>
            <div class="info-row">
              <span class="label">Délai souhaité:</span> 
              <span class="value">${timelineLabels[data.timeline as keyof typeof timelineLabels]}</span>
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

          <div class="section">
            <div class="section-title">📝 Description du Projet</div>
            <p class="value">${escapeHtml(data.description).replace(/\n/g, '<br>')}</p>
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

  try {
    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: process.env.CONTACT_EMAIL_TO || 'info@guapowebdesigner.com',
      replyTo: data.email,
      subject: `🎨 Nouvelle demande de devis - ${data.firstName} ${data.lastName}`,
      html: emailHtml,
    });

    if (result.error) {
      throw new Error(`Resend error: ${result.error.message}`);
    }

    return result;
  } catch (error) {
    console.error('Email sending failed:', error);
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
