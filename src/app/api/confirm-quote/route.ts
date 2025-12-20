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
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1e293b; max-width: 600px; margin: 0 auto; padding: 20px; background: #f8fafc; }
            .card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1); border: 1px solid #e2e8f0; }
            .header { background: ${isModelB ? '#10b981' : '#1e293b'}; color: white; padding: 40px 30px; text-align: center; border-radius: 16px 16px 0 0; }
            .content { padding: 35px; background: white; }
            .choice-badge { display: inline-block; padding: 12px 24px; border-radius: 50px; font-weight: 900; font-size: 16px; text-transform: uppercase; margin-bottom: 30px; letter-spacing: 1px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
            .badge-a { background: #1e293b; color: #ffffff; border: 2px solid #334155; }
            .badge-b { background: #10b981; color: #ffffff; border: 2px solid #059669; }
            .section { margin-bottom: 25px; padding: 20px; border-radius: 12px; background: #ffffff; border: 1px solid #f1f5f9; }
            .label { font-size: 11px; color: #94a3b8; text-transform: uppercase; letter-spacing: 2px; font-weight: 800; margin-bottom: 10px; }
            .value { font-size: 18px; color: #1e293b; font-weight: 700; }
            .price-container { background: #f8fafc; border-radius: 16px; padding: 30px; border: 2px solid #e2e8f0; margin-top: 20px; }
            .price-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px dashed #cbd5e1; }
            .price-row:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
            .price-label { font-weight: 700; color: #475569; font-size: 14px; }
            .price-value { font-size: 26px; font-weight: 900; color: #0f172a; }
            .monthly-tag { font-size: 14px; color: #3b82f6; font-weight: 700; background: #eff6ff; padding: 4px 12px; border-radius: 20px; margin-top: 5px; display: inline-block; }
            .btn { display: block; background: #1e293b; color: white !important; padding: 20px; border-radius: 12px; text-decoration: none; font-weight: 800; text-align: center; margin-top: 30px; font-size: 18px; box-shadow: 0 4px 15px rgba(30,41,59,0.3); }
            .footer { text-align: center; padding: 30px; color: #94a3b8; font-size: 12px; font-weight: 500; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <h1 style="margin:0;font-size:28px;">✅ NOUVEAU CHOIX CLIENT</h1>
              <p style="margin:10px 0 0 0;opacity:0.9;font-weight:600;font-size:16px">PROJET #${ref || 'SANS-REF'}</p>
            </div>
            <div class="content">
              <div style="text-align:center">
                <div class="choice-badge ${isModelB ? 'badge-b' : 'badge-a'}">
                  ${isModelB ? 'MODÈLE B : ABONNEMENT' : 'MODÈLE A : ACHAT SYSTÈME'}
                </div>
              </div>

              <div class="section">
                <div class="label">Client & Entreprise</div>
                <div class="value">${escapeHtml(firstName)} ${escapeHtml(lastName)}</div>
                <div style="font-size:16px;color:#64748b;margin-top:4px">${escapeHtml(email)}</div>
                ${company ? `<div style="font-size:16px;color:#1e293b;margin-top:12px;font-weight:700">🏢 ${escapeHtml(company)}</div>` : ''}
              </div>

              <div class="section">
                <div class="label">Type de Projet</div>
                <div class="value">${escapeHtml(siteType)}</div>
              </div>

              <div class="price-container">
                ${isModelA ? `
                  <div class="section" style="border-bottom: 1px solid #cbd5e1; margin-bottom: 15px;">
                    <div class="label">Investissement Initial Unique</div>
                    <div class="price-value">${minPrice === maxPrice ? `${minPrice}€` : `${minPrice}€ - ${maxPrice}€`} TVAC</div>
                  </div>
                  <div>
                    <div class="label">Mensualité (Pack/Maint.)</div>
                    <div class="price-value" style="font-size:20px; color:#3b82f6">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:13px;color:#64748b;margin-top:4px">${escapeHtml(packName || 'Maintenance & plateforme')}</div>
                  </div>
                ` : `
                  <div class="section" style="border-bottom: 1px solid #cbd5e1; margin-bottom: 15px;">
                    <div class="label">Investissement Initial</div>
                    <div class="price-value" style="color:#10b981">0€ (OFFERT)</div>
                  </div>
                  <div>
                    <div class="label">Abonnement Mensuel All-In</div>
                    <div class="price-value">${monthlyPrice}€ / mois TVAC</div>
                    <div style="font-size:13px;color:#64748b;margin-top:4px">${escapeHtml(packName || 'Abonnement complet')}</div>
                  </div>
                `}
              </div>

              <a href="mailto:${email}" class="btn">RÉPONDRE AU CLIENT PAR EMAIL</a>
            </div>
          </div>
          <div class="footer">
            GUAPO Web Designer • Notification de Confirmation Automatique<br>
            Généré le ${new Date().toLocaleString('fr-BE')}
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
