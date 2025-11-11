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
  return (
    <Html>
      <Preview>Nouvelle demande de devis de {firstName} {lastName} - {company}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Heading style={{ 
              marginTop: 0, 
              color: '#7c3aed',
              fontSize: '24px',
              marginBottom: '20px'
            }}>
              🎨 Nouvelle Demande de Devis
            </Heading>
            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                1️⃣ Informations du client
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom complet:</strong> {firstName} {lastName}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Email:</strong> {email}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Entreprise / Projet:</strong> {company}
              </Text>
              {sector && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Secteur d'activité:</strong> {sector}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                2️⃣ Type de site
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Type:</strong> {siteType}
              </Text>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                3️⃣ Design & Contenu
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                ✓ Design sur mesure (UX/UI personnalisé)
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                ✓ Responsive (mobile + tablette + ordinateur)
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nombre de pages prévues:</strong> {pageCount}
              </Text>
            </Section>

            {features && features.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                    4️⃣ Fonctionnalités / Modules
                  </Text>
                  {features.map((feature, index) => (
                    <Text key={index} style={{ margin: '5px 0 5px 15px', color: '#6b7280' }}>
                      • {feature}
                    </Text>
                  ))}
                </Section>
              </>
            )}

            {optimization && optimization.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                    5️⃣ Optimisation & Sécurité
                  </Text>
                  {optimization.map((opt, index) => (
                    <Text key={index} style={{ margin: '5px 0 5px 15px', color: '#6b7280' }}>
                      • {opt}
                    </Text>
                  ))}
                </Section>
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                6️⃣ Hébergement & Maintenance
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Hébergement:</strong> {hosting}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom de domaine:</strong> {domain}
              </Text>
              {maintenance && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Maintenance mensuelle:</strong> {maintenance}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section>
              <Text style={{ fontWeight: 'bold', fontSize: '16px', marginBottom: '10px', color: '#7c3aed' }}>
                8️⃣ Remarques spécifiques / Besoins particuliers
              </Text>
              <Section style={{ 
                backgroundColor: '#f3f4f6', 
                padding: '15px', 
                borderRadius: '6px',
                borderLeft: '4px solid #7c3aed'
              }}>
                <Text style={{ 
                  color: '#1f2937',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                  margin: 0
                }}>
                  {message}
                </Text>
              </Section>
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ 
              color: '#9ca3af', 
              fontSize: '12px',
              textAlign: 'center',
              marginTop: '20px'
            }}>
              Répondez directement à cet email pour contacter le client
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}