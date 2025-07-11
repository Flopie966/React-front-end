import { NextResponse } from 'next/server';

// Example: get dynamic pages (replace with real data fetching logic)
async function getDynamicPages() {
  // Example: return [{ slug: 'blog/first-post', lastmod: '2024-06-01' }];
  return [];
}

export async function GET() {
  // List of static routes with lastmod (use build time as fallback)
  const buildDate = new Date().toISOString().split('T')[0];
  const staticPages = [
    { slug: '', lastmod: buildDate }, // homepage
    { slug: 'about', lastmod: buildDate },
    { slug: 'contact', lastmod: buildDate },
    { slug: 'privacy-policy', lastmod: buildDate },
    { slug: 'terms', lastmod: buildDate },
    // Add more static pages as needed
  ];

  // Fetch dynamic pages
  const dynamicPages = await getDynamicPages();

  const allPages = [...staticPages, ...dynamicPages];

  const baseUrl = 'https://www.moneybear.nl';

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allPages
    .map(
      (page) => `
    <url>
      <loc>${baseUrl}${page.slug ? `/${page.slug}` : ''}</loc>
      <lastmod>${page.lastmod}</lastmod>
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