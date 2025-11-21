import {
  Html,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Preview,
} from '@react-email/components';
import { PRICING, calculateEstimate } from '@/lib/pricing';

interface QuoteEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  sector?: string;
  siteType: string;
  pageCount: string;
  features?: string[];
  optimization?: string[];
  hosting: string;
  domain: string;
  maintenance?: string;
  message: string;
}

export function QuoteEmail({ 
  firstName,
  lastName,
  email,
  company,
  sector,
  siteType,
  pageCount,
  features,
  optimization,
  hosting,
  domain,
  maintenance,
  message 
}: QuoteEmailProps) {
  const estimate = calculateEstimate({ siteType, features, optimization, domain });
  const siteTypePrice = PRICING.siteTypes[siteType as keyof typeof PRICING.siteTypes];
  const isEcommerce = siteType.toLowerCase().includes('boutique') || siteType.toLowerCase().includes('e-commerce');
  const maintenanceYearly = isEcommerce ? 700 : 300;
  const maintenancePerIntervention = isEcommerce ? 150 : 100;
  const interventionsIncluded = isEcommerce ? 12 : 6;
  
  const s = {
    container: { maxWidth: '600px', margin: '20px auto', backgroundColor: '#fff', borderRadius: '8px' },
    header: { background: 'linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%)', padding: '20px', textAlign: 'center' as const },
    section: { padding: '20px' },
    title: { fontWeight: 'bold' as const, fontSize: '15px', color: '#7c3aed', marginBottom: '8px' },
    text: { fontSize: '13px', color: '#666', margin: '3px 0' },
    box: { backgroundColor: '#f0f9ff', padding: '10px', borderRadius: '6px', border: '1px solid #7c3aed' },
    estimate: { backgroundColor: '#ddd6fe', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed', textAlign: 'center' as const },
    maintenance: { backgroundColor: '#fff', padding: '12px', borderRadius: '6px', marginBottom: '10px', border: '1px solid #7c3aed' },
  };
  
  return (
    <Html>
      <Preview>Devis {firstName} {lastName} - {company}</Preview>
      <Body style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f4f4', margin: 0, padding: 0 }}>
        <Container style={s.container}>
          <Section style={s.header}>
            <Heading style={{ color: '#fff', fontSize: '22px', margin: 0 }}>🎨 Devis</Heading>
          </Section>
          <Section style={s.section}>
            
            <Text style={s.title}>1️⃣ Client</Text>
            <Text style={s.text}><strong>Nom:</strong> {firstName} {lastName}</Text>
            <Text style={s.text}><strong>Email:</strong> {email}</Text>
            <Text style={s.text}><strong>Entreprise:</strong> {company}</Text>
            {sector && <Text style={s.text}><strong>Secteur:</strong> {sector}</Text>}

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Text style={s.title}>2️⃣ Type de site</Text>
            <Section style={s.box}>
              <Text style={{ margin: 0, fontSize: '14px', color: '#1f2937' }}><strong>{siteType}</strong></Text>
              {siteTypePrice && (
                <Text style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 'bold', color: '#059669' }}>
                  💰 {siteTypePrice.min === siteTypePrice.max ? `${siteTypePrice.min}€` : `${siteTypePrice.min}€ - ${siteTypePrice.max}€`}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Text style={s.title}>3️⃣ Design</Text>
            <Text style={s.text}>✓ Design sur mesure • Responsive • <strong>Pages:</strong> {pageCount}</Text>

            {features && features.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
                <Text style={s.title}>4️⃣ Fonctionnalités</Text>
                {features.map((f, i) => {
                  const p = PRICING.features[f as keyof typeof PRICING.features];
                  return <Text key={i} style={s.text}>• {f} {p !== undefined && <strong style={{ color: '#059669' }}>({p === 0 ? 'Inclus' : `${p}€`})</strong>}</Text>;
                })}
              </>
            )}

            {optimization && optimization.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
                <Text style={s.title}>5️⃣ Optimisation</Text>
                {optimization.map((o, i) => {
                  const p = PRICING.optimization[o as keyof typeof PRICING.optimization];
                  return <Text key={i} style={s.text}>• {o} {p !== undefined && <strong style={{ color: '#d97706' }}>({p === 0 ? 'Inclus' : `${p}€`})</strong>}</Text>;
                })}
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Text style={s.title}>6️⃣ Hébergement & Domaine</Text>
            <Text style={s.text}><strong>Hébergement:</strong> {hosting} <strong style={{ color: '#059669' }}>(Inclus)</strong></Text>
            <Text style={s.text}><strong>Domaine:</strong> {domain} <strong style={{ color: '#059669' }}>({PRICING.domain[domain as keyof typeof PRICING.domain] === 0 ? 'Inclus' : `${PRICING.domain[domain as keyof typeof PRICING.domain]}€`})</strong></Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Section style={s.estimate}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#5b21b6', margin: '0 0 8px 0' }}>💰 ESTIMATION</Text>
              <Text style={{ fontSize: '28px', fontWeight: 'bold', color: '#7c3aed', margin: '5px 0' }}>
                {estimate.minTotal === estimate.maxTotal ? `${estimate.minTotal}€` : `${estimate.minTotal}€ - ${estimate.maxTotal}€`}
              </Text>
              <Text style={{ fontSize: '12px', color: '#6b7280', margin: '5px 0' }}>(Hors TVA)</Text>
              <Text style={{ fontSize: '13px', color: '#4b5563', margin: '8px 0 0 0' }}>
                <strong>+ TVA 21%:</strong> {Math.round(estimate.minTotal * 0.21)}€ - {Math.round(estimate.maxTotal * 0.21)}€
              </Text>
              <Text style={{ fontSize: '15px', fontWeight: 'bold', color: '#5b21b6', margin: '8px 0 0 0' }}>
                <strong>TTC:</strong> {Math.round(estimate.minTotal * 1.21)}€ - {Math.round(estimate.maxTotal * 1.21)}€
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Section style={{ backgroundColor: '#f0f9ff', padding: '15px', borderRadius: '8px', border: '2px solid #7c3aed' }}>
              <Text style={{ fontSize: '16px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 10px 0', textAlign: 'center' }}>
                🔧 Maintenance {isEcommerce ? 'E-commerce' : 'Vitrine'}
              </Text>
              
              <Section style={s.maintenance}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 8px 0' }}>
                  📦 Annuel - {maintenanceYearly}€ HT ({Math.round(maintenanceYearly * 1.21)}€ TTC)
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • {interventionsIncluded} interventions/an • Mises à jour • Sécurité • Support 48h
                </Text>
                <Text style={{ fontSize: '11px', color: '#6b7280', margin: '5px 0 0 0', fontStyle: 'italic' }}>
                  🎁 Premier mois offert
                </Text>
              </Section>

              <Section style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '6px', border: '1px solid #a78bfa' }}>
                <Text style={{ fontSize: '14px', fontWeight: 'bold', color: '#7c3aed', margin: '0 0 8px 0' }}>
                  💳 Par Intervention - {maintenancePerIntervention}€ HT ({Math.round(maintenancePerIntervention * 1.21)}€ TTC)
                </Text>
                <Text style={{ fontSize: '12px', color: '#4b5563', margin: '3px 0' }}>
                  • Sans engagement • À la demande • Délai 48h
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />

            <Text style={s.title}>7️⃣ Remarques</Text>
            <Section style={{ backgroundColor: '#f3f4f6', padding: '12px', borderRadius: '6px', borderLeft: '3px solid #7c3aed' }}>
              <Text style={{ fontSize: '13px', color: '#1f2937', lineHeight: '1.5', whiteSpace: 'pre-wrap', margin: 0 }}>
                {message}
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '15px 0' }} />
            
            <Text style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'center', margin: '10px 0 0 0' }}>
              Répondez à cet email pour contacter le client
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}