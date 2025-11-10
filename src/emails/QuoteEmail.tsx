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
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  budget?: string;
  deadline?: string;
  domain: string;
  hosting: string;
  features?: string[];
  message: string;
}

export function QuoteEmail({ 
  name, 
  email, 
  phone, 
  projectType, 
  budget, 
  deadline,
  domain,
  hosting,
  features,
  message 
}: QuoteEmailProps) {
  return (
    <Html>
      <Preview>Nouvelle demande de devis de {name}</Preview>
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
              <Text style={{ fontWeight: 'bold', marginBottom: '5px', color: '#374151' }}>
                Informations du client
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom:</strong> {name}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Email:</strong> {email}
              </Text>
              {phone && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Téléphone:</strong> {phone}
                </Text>
              )}
            </Section>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ marginBottom: '20px' }}>
              <Text style={{ fontWeight: 'bold', marginBottom: '5px', color: '#374151' }}>
                Détails du projet
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Type de projet:</strong> {projectType}
              </Text>
              {budget && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Budget estimé:</strong> {budget}
                </Text>
              )}
              {deadline && (
                <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                  <strong>Date souhaitée:</strong> {deadline}
                </Text>
              )}
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Nom de domaine:</strong> {domain}
              </Text>
              <Text style={{ margin: '5px 0', color: '#6b7280' }}>
                <strong>Hébergement:</strong> {hosting}
              </Text>
            </Section>

            {features && features.length > 0 && (
              <>
                <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
                <Section style={{ marginBottom: '20px' }}>
                  <Text style={{ fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>
                    ✨ Fonctionnalités souhaitées
                  </Text>
                  {features.map((feature, index) => (
                    <Text key={index} style={{ margin: '5px 0 5px 15px', color: '#6b7280' }}>
                      • {feature}
                    </Text>
                  ))}
                </Section>
              </>
            )}

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section>
              <Text style={{ fontWeight: 'bold', marginBottom: '10px', color: '#374151' }}>
                Message / Description
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