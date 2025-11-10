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
  phone: z
    .string()
    .min(8, 'Numéro de téléphone invalide')
    .max(20, 'Numéro de téléphone invalide'),
  company: z
    .string()
    .min(2, 'Le nom de l\'entreprise doit contenir au moins 2 caractères')
    .max(100, 'Le nom de l\'entreprise doit contenir moins de 100 caractères')
    .optional()
    .or(z.literal('')),
  websiteType: z.enum([
    'vitrine',
    'ecommerce',
    'blog',
    'portfolio',
    'application',
    'autre'
  ], {
    errorMap: () => ({ message: 'Veuillez sélectionner un type de site web' })
  }),
  budget: z.enum([
    'moins-2000',
    '2000-5000',
    '5000-10000',
    'plus-10000',
    'a-discuter'
  ], {
    errorMap: () => ({ message: 'Veuillez sélectionner un budget' })
  }),
  timeline: z.enum([
    'urgent',
    '1-mois',
    '2-3-mois',
    'flexible'
  ], {
    errorMap: () => ({ message: 'Veuillez sélectionner un délai' })
  }),
  description: z
    .string()
    .min(20, 'La description doit contenir au moins 20 caractères')
    .max(2000, 'La description doit contenir moins de 2000 caractères'),
  features: z.array(z.string()).optional(),
});

export type QuoteFormInput = z.infer<typeof QuoteFormSchema>;
