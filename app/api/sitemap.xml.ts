import { NextResponse } from 'next/server';

export async function GET() {
  // List of static routes
  const staticPages = [
    '', // homepage
    'about',
  ];

  // If you have dynamic routes, add them here
  // Example: const dynamicPages = await getDynamicPages();
  const dynamicPages: string[] = [];

  const allPages = [...staticPages, ...dynamicPages];

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.com';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}/${page}</loc>
      <changefreq>weekly</changefreq>
      <priority>0.8</priority>
    </url>`
    )
    .join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
    },
  });
} 