import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api/',
          '/_next/',
          '/blog/admin',
        ],
      },
    ],
    sitemap: 'https://www.anber.me/sitemap.xml',
    host: 'https://www.anber.me',
  };
}
