import type { MetadataRoute } from "next";

const BASE = "https://drawai-six.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE,                     lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/plan`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/find`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE}/chat`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/dashboard`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.85 },
    { url: `${BASE}/apply`,          lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/deadlines`,      lastModified: new Date(), changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE}/compare`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/odds`,           lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/otc`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/states`,         lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/tracker`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/checklist`,      lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/profile`,        lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE}/faq`,            lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/about`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.5 },
    { url: `${BASE}/terms`,          lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
    { url: `${BASE}/privacy`,        lastModified: new Date(), changeFrequency: "yearly",  priority: 0.2 },
  ];
}
