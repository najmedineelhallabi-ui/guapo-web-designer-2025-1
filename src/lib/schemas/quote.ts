import { z } from 'zod';

export const QuoteFormSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom doit contenir moins de 50 caractères'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom doit contenir moins de 50 caractères'),
  email: z
    .string()
    .email('Adresse email invalide')
    .max(255, 'L\'email doit contenir moins de 255 caractères'),
  company: z
    .string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise doit contenir moins de 100 caractères'),
  sector: z
    .string()
    .max(100, 'Le secteur doit contenir moins de 100 caractères')
    .optional()
    .or(z.literal('')),
  siteType: z
    .string()
    .min(1, 'Veuillez sélectionner un type de site'),
  pageCount: z
    .number()
    .int()
    .positive()
    .optional(),
  features: z.array(z.string()).optional(),
  languages: z.array(z.string()).optional(),
  otherLanguages: z
    .string()
    .max(200, 'Les autres langues doivent contenir moins de 200 caractères')
    .optional()
    .or(z.literal('')),
  optimization: z.array(z.string()).optional(),
  hosting: z
    .string()
    .optional(),
  domain: z
    .string()
    .min(1, 'Veuillez sélectionner une option pour le nom de domaine'),
  message: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description doit contenir moins de 2000 caractères'),
  rgpdConsent: z
    .string()
    .refine((val) => val === 'on', {
      message: 'Vous devez accepter la politique de confidentialité'
    })
});

export type QuoteFormInput = z.infer<typeof QuoteFormSchema>;