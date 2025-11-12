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

interface QuoteConfirmationEmailProps {
  firstName: string;
  lastName: string;
  company: string;
  siteType: string;
}

export function QuoteConfirmationEmail({ 
  firstName,
  lastName,
  company,
  siteType
}: QuoteConfirmationEmailProps) {
  return (
    <Html>
      <Preview>Confirmation de votre demande de devis - GUAPO Web Designer</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#f9fafb' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#ffffff', borderRadius: '8px', padding: '30px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
            <Heading style={{ 
              marginTop: 0, 
              color: '#7c3aed',
              fontSize: '24px',
              marginBottom: '20px',
              textAlign: 'center'
            }}>
              ✅ Demande de devis bien reçue !
            </Heading>
            
            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Bonjour {firstName} {lastName},
            </Text>
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Merci d'avoir fait confiance à <strong style={{ color: '#7c3aed' }}>GUAPO Web Designer</strong> pour votre projet !
            </Text>
            
            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              Nous avons bien reçu votre demande de devis concernant votre projet <strong>{company}</strong> pour un <strong>{siteType}</strong>.
            </Text>

            <Section style={{ 
              backgroundColor: '#f3f4f6', 
              padding: '20px', 
              borderRadius: '8px',
              margin: '20px 0',
              borderLeft: '4px solid #7c3aed'
            }}>
              <Text style={{ 
                fontSize: '16px', 
                color: '#1f2937', 
                margin: '0 0 10px 0',
                fontWeight: 'bold'
              }}>
                📋 Prochaines étapes :
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0', lineHeight: '1.6' }}>
                • Notre équipe étudie attentivement votre demande
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0', lineHeight: '1.6' }}>
                • Nous vous répondrons sous <strong>24-48 heures</strong>
              </Text>
              <Text style={{ fontSize: '14px', color: '#4b5563', margin: '8px 0', lineHeight: '1.6' }}>
                • Vous recevrez un devis personnalisé et détaillé
              </Text>
            </Section>

            <Text style={{ fontSize: '16px', color: '#1f2937', lineHeight: '1.6' }}>
              En attendant, n'hésitez pas à nous contacter si vous avez des questions ou des informations complémentaires à nous transmettre.
            </Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />

            <Section style={{ textAlign: 'center', margin: '20px 0' }}>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0' }}>
                📧 <strong>Email:</strong> info@guapowebdesigner.com
              </Text>
              <Text style={{ fontSize: '14px', color: '#6b7280', margin: '5px 0' }}>
                📱 <strong>Instagram:</strong> @guapo_webdesigner
              </Text>
            </Section>

            <Text style={{ 
              fontSize: '16px', 
              color: '#1f2937', 
              lineHeight: '1.6',
              marginTop: '20px'
            }}>
              À très bientôt,<br />
              <strong style={{ color: '#7c3aed' }}>L'équipe GUAPO Web Designer</strong>
            </Text>

            <Hr style={{ borderColor: '#e5e7eb', margin: '20px 0' }} />
            
            <Text style={{ 
              color: '#9ca3af', 
              fontSize: '12px',
              textAlign: 'center',
              lineHeight: '1.5'
            }}>
              © 2025 GUAPO Web Designer<br />
              Cet email a été envoyé en réponse à votre demande de devis
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
