import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'GUAPO Web Designer',
    short_name: 'GUAPO',
    description: 'Création de sites web modernes, élégants et performants. Design UI/UX, développement responsive, identité visuelle.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a0d2e',
    theme_color: '#a855f7',
    icons: [
      {
        src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=192&height=192&resize=contain',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/render/image/public/document-uploads/Logo-de-Guapo-Designer-Web-1762372330786.png?width=512&height=512&resize=contain',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
    lang: 'fr',
  };
}
