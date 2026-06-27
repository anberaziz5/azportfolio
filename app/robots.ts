import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',        // never expose API routes
          '/_next/',      // Next.js internals
        ],
      },
    ],
    sitemap: 'https://www.anber.me/sitemap.xml',
    host: 'https://www.anber.me',
  };
}
