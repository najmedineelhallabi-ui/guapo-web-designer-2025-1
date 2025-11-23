'use server';

import { sendQuoteEmail } from '@/lib/email';
import { z } from 'zod';

const quoteSchema = z.object({
  firstName: z.string().min(2, 'Le prénom doit contenir au moins 2 caractères'),
  lastName: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  email: z.string().email('Adresse email invalide'),
  company: z.string().min(2, 'Le nom de l\'entreprise/projet doit contenir au moins 2 caractères'),
  sector: z.string().optional(),
  siteType: z.string().min(1, 'Veuillez sélectionner un type de site'),
  pageCount: z.coerce.number().int().positive().optional(),
  features: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  otherLanguages: z.string().optional(),
  optimization: z.array(z.string()).optional(),
  hosting: z.string().optional(),
  domain: z.string().min(1, 'Veuillez sélectionner une option pour le nom de domaine'),
  message: z.string().min(10, 'Le message doit contenir au moins 10 caractères').max(5000),
  rgpdConsent: z.string().refine((val) => val === 'on', {
    message: 'Vous devez accepter la politique de confidentialité pour continuer',
  }),
  language: z.enum(['fr', 'nl', 'en']).optional(),
});

export type QuoteFormState = {
  success?: boolean;
  message?: string;
  errors?: Record<string, string[]>;
  formData?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    company?: string;
    sector?: string;
    siteType?: string;
    pageCount?: number;
    features?: string[];
    languages?: string[];
    otherLanguages?: string;
    optimization?: string[];
    hosting?: string;
    domain?: string;
    message?: string;
    rgpdConsent?: string;
    language?: 'fr' | 'nl' | 'en';
  };
};

export async function sendQuoteAction(
  _prevState: QuoteFormState | undefined,
  formData: FormData
): Promise<QuoteFormState> {
  console.log('🔵 [ACTION] sendQuoteAction called');
  
  try {
    console.log('🔵 [ACTION] Parsing form data...');
    
    // Parse and validate form data
    const rawData = {
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      email: formData.get('email'),
      company: formData.get('company'),
      sector: formData.get('sector') || undefined,
      siteType: formData.get('siteType'),
      pageCount: formData.get('pageCount') ? Number(formData.get('pageCount')) : undefined,
      features: formData.getAll('features') as string[],
      languages: formData.getAll('languages') as string[],
      otherLanguages: formData.get('otherLanguages') as string || undefined,
      optimization: formData.getAll('optimization') as string[],
      hosting: formData.get('hosting') as string || undefined,
      domain: formData.get('domain'),
      message: formData.get('message'),
      rgpdConsent: formData.get('rgpdConsent'),
      language: formData.get('language') as 'fr' | 'nl' | 'en' || 'fr',
    };

    console.log('🔵 [ACTION] Raw data:', JSON.stringify(rawData, null, 2));
    console.log('🔵 [ACTION] Validating data...');

    const validatedData = quoteSchema.parse(rawData);
    
    console.log('🔵 [ACTION] Data validated successfully');
    console.log('🔵 [ACTION] Calling sendQuoteEmail...');

    // Send email using the centralized email function (includes pricing)
    await sendQuoteEmail({
      firstName: validatedData.firstName,
      lastName: validatedData.lastName,
      email: validatedData.email,
      company: validatedData.company,
      sector: validatedData.sector,
      siteType: validatedData.siteType,
      pageCount: validatedData.pageCount,
      features: validatedData.features,
      languages: validatedData.languages,
      otherLanguages: validatedData.otherLanguages,
      optimization: validatedData.optimization,
      hosting: validatedData.hosting,
      domain: validatedData.domain,
      message: validatedData.message,
      language: validatedData.language || 'fr',
    });

    console.log('🔵 [ACTION] Email sent successfully!');

    return {
      success: true,
      message: 'Votre demande de devis a été envoyée avec succès ! Nous vous répondrons dans les plus brefs délais.',
    };
  } catch (error) {
    console.error('🔴 [ACTION] Error occurred:', error);
    
    if (error instanceof z.ZodError) {
      console.error('🔴 [ACTION] Validation error:', error.flatten().fieldErrors);
      
      // Keep form data in case of validation errors
      return {
        success: false,
        errors: error.flatten().fieldErrors as Record<string, string[]>,
        formData: {
          firstName: formData.get('firstName') as string,
          lastName: formData.get('lastName') as string,
          email: formData.get('email') as string,
          company: formData.get('company') as string,
          sector: formData.get('sector') as string,
          siteType: formData.get('siteType') as string,
          pageCount: formData.get('pageCount') ? Number(formData.get('pageCount')) : undefined,
          features: formData.getAll('features') as string[],
          languages: formData.getAll('languages') as string[],
          otherLanguages: formData.get('otherLanguages') as string,
          optimization: formData.getAll('optimization') as string[],
          hosting: formData.get('hosting') as string,
          domain: formData.get('domain') as string,
          message: formData.get('message') as string,
          rgpdConsent: formData.get('rgpdConsent') as string,
          language: formData.get('language') as 'fr' | 'nl' | 'en',
        },
      };
    }

    console.error('🔴 [ACTION] Unexpected error details:', {
      name: error instanceof Error ? error.name : 'Unknown',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return {
      success: false,
      message: 'Une erreur inattendue s\'est produite. Veuillez réessayer ou nous contacter directement.',
    };
  }
}