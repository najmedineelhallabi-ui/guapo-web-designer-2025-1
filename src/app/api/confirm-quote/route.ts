import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, siteType, minPrice, maxPrice, model, monthlyPrice, packName, ref } = body;

    const isModelA = model === 'A';
    const isModelB = model === 'B';

    // Email ultra-clair pour Guapo Web Designer
    const ownerEmailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
            .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
            .header { background: ${isModelB ? '#10b981' : '#1e293b'}; color: white; padding: 30px; text-align: center; }
            .content { padding: 30px; }
            .choice-badge { display: inline-block; padding: 10px 20px; border-radius: 50px; font-weight: 900; font-size: 14px; text-transform: uppercase; margin-bottom: 20px; color: white; background: ${isModelB ? '#059669' : '#334155'}; }
            .section { margin-bottom: 20px; padding: 15px; border-radius: 10px; background: #f8fafc; border: 1px solid #f1f5f9; }
            .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; letter-spacing: 1px; font-weight: 800; margin-bottom: 5px; }
            .value { font-size: 16px; color: #1e293b; font-weight: 700; }
            .price-container { background: #f1f5f9; border-radius: 12px; padding: 20px; border: 1px solid #e2e8f0; margin-top: 15px; }
            .price-value { font-size: 24px; font-weight: 900; color: #0f172a; }
            .btn { display: block; background: #1e293b; color: white !important; padding: 15px; border-radius: 8px; text-decoration: none; font-weight: 800; text-align: center; margin-top: 20px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 style="margin:0;font-size:24px;">🚀 CHOIX CONFIRMÉ</h1>
              <p style="margin:5px 0 0 0;opacity:0.9;">Réf: #${ref || 'SANS-REF'}</p>
            </div>
            <div class="content">
              <div style="text-align:center">
                <div class="choice-badge">
                  ${isModelB ? 'MODÈLE B : ABONNEMENT' : 'MODÈLE A : ACHAT'}
                </div>
              </div>

              <div class="section">
                <div class="label">Client</div>
                <div class="value">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
                <div style="font-size:14px;color:#64748b">${escapeHtml(email)}</div>
                ${company ? `<div style="margin-top:10px;font-weight:700">🏢 ${escapeHtml(company)}</div>` : ''}
              </div>

              <div class="section">
                <div class="label">Projet</div>
                <div class="value">${escapeHtml(siteType)}</div>
              </div>

              <div class="price-container">
                ${isModelA ? `
                  <div style="margin-bottom:20px; padding-bottom:15px; border-bottom:1px dashed #e2e8f0;">
                    <div class="label">💰 Investissement Initial (Achat)</div>
                    <div class="price-value">${minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`} TVAC</div>
                  </div>
                  <div>
                    <div class="label">🛠️ Maintenance Mensuelle</div>
                    <div class="price-value" style="font-size:20px; color:#3b82f6">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:12px;color:#64748b;margin-top:4px">${escapeHtml(packName || 'Maintenance & Support')}</div>
                  </div>
                ` : `
                  <div style="margin-bottom:20px; padding-bottom:15px; border-bottom:1px dashed #e2e8f0;">
                    <div class="label">💰 Investissement Initial</div>
                    <div class="price-value" style="color:#10b981">0€ (OFFERT)</div>
                  </div>
                  <div>
                    <div class="label">🔄 Abonnement Mensuel All-In</div>
                    <div class="price-value" style="color:#059669">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:12px;color:#64748b;margin-top:4px">${escapeHtml(packName || 'Abonnement complet')}</div>
                  </div>
                `}
              </div>

              <a href="mailto:${email}" class="btn">RÉPONDRE AU CLIENT</a>
            </div>
          </div>
        </body>
      </html>
    `;

    const result = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      to: 'info@guapowebdesigner.com',
      replyTo: email,
      subject: `✅ CHOIX ${model} : ${firstName} ${lastName} (#${ref || 'SANS-REF'})`,
      html: ownerEmailHtml,
    });

    return NextResponse.json({ success: true, id: result.data?.id });
  } catch (error) {
    console.error('❌ Error confirming quote:', error);
    return NextResponse.json({ success: false, error: 'Failed to send confirmation' }, { status: 500 });
  }
}

function escapeHtml(text: string): string {
  const map: { [key: string]: string } = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}
