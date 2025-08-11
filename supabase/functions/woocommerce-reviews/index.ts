import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface RequestBody {
  productUrl: string;
  consumerKey?: string;
  consumerSecret?: string;
}

interface WooProduct {
  id: number;
  name: string;
  description?: string;
  permalink?: string;
  average_rating?: string;
  review_count?: number;
  prices?: { price?: string; currency_code?: string };
}

interface WooReview {
  id: number;
  reviewer: string;
  reviewer_avatar_urls?: Record<string, string>;
  date_created?: string;
  rating?: number;
  review: string;
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders },
  });
}

function getOrigin(url: string): string {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.host}`;
  } catch {
    return "";
  }
}

function getSlugFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const parts = u.pathname.split("/").filter(Boolean);
    const idx = parts.findIndex((p) => p.toLowerCase() === "product");
    if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    // fallback: last segment
    return parts.length > 0 ? parts[parts.length - 1] : null;
  } catch {
    return null;
  }
}

async function fetchJson(url: string, init?: RequestInit) {
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(`Request failed ${res.status}: ${url}`);
  return await res.json();
}

async function fetchStoreProductBySlug(origin: string, slug: string): Promise<WooProduct | null> {
  try {
    const data = await fetchJson(`${origin}/wp-json/wc/store/v1/products?slug=${encodeURIComponent(slug)}&per_page=1`);
    if (Array.isArray(data) && data.length > 0) {
      const p = data[0];
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        permalink: p.permalink,
        average_rating: p.average_rating,
        review_count: p.review_count,
        prices: p.prices,
      } as WooProduct;
    }
    return null;
  } catch (_e) {
    return null;
  }
}

async function fetchWpComments(origin: string, productId: number): Promise<WooReview[]> {
  try {
    // Public comments endpoint (may be disabled on some stores)
    const data = await fetchJson(`${origin}/wp-json/wp/v2/comments?post=${productId}&per_page=20&_fields=id,author_name,content,date`);
    if (Array.isArray(data)) {
      return data.map((c: any) => ({
        id: c.id,
        reviewer: c.author_name,
        review: typeof c.content?.rendered === "string" ? c.content.rendered.replace(/<[^>]+>/g, "").trim() : "",
        date_created: c.date,
      }));
    }
    return [];
  } catch (_e) {
    return [];
  }
}

async function fetchV3Reviews(origin: string, productId: number, key?: string, secret?: string): Promise<WooReview[]> {
  if (!key || !secret) return [];
  try {
    const qs = new URLSearchParams({ consumer_key: key, consumer_secret: secret, per_page: "20" });
    const data = await fetchJson(`${origin}/wp-json/wc/v3/products/${productId}/reviews?${qs.toString()}`);
    if (Array.isArray(data)) {
      return data.map((r: any) => ({
        id: r.id,
        reviewer: r.reviewer,
        rating: typeof r.rating === "number" ? r.rating : undefined,
        review: r.review,
        date_created: r.date_created,
      }));
    }
    return [];
  } catch (_e) {
    return [];
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const body = (await req.json()) as RequestBody;
    const { productUrl, consumerKey, consumerSecret } = body || {};

    if (!productUrl) {
      return jsonResponse({ error: "productUrl is required" }, 400);
    }

    const origin = getOrigin(productUrl);
    if (!origin) return jsonResponse({ error: "Invalid productUrl" }, 400);

    const slug = getSlugFromUrl(productUrl);

    // Step 1: Resolve product
    let product: WooProduct | null = null;
    if (slug) {
      product = await fetchStoreProductBySlug(origin, slug);
    }

    // If still null, try a naive fallback by fetching the page and extracting JSON-LD
    if (!product) {
      try {
        const htmlRes = await fetch(productUrl);
        const html = await htmlRes.text();
        const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
        if (jsonLdMatch) {
          const data = JSON.parse(jsonLdMatch[1]);
          const name = data.name || data["@graph"]?.find((n: any) => n["@type"] === "Product")?.name;
          product = {
            id: Number(data.sku) || Date.now(),
            name: name || "Product",
            description: data.description || "",
            average_rating: undefined,
            review_count: undefined,
          } as WooProduct;
        }
      } catch (_e) {}
    }

    if (!product || !product.id) {
      return jsonResponse({ error: "Could not resolve product from URL" }, 404);
    }

    // Step 2: Fetch reviews (prefer authenticated v3 if keys provided)
    let reviews: WooReview[] = [];
    let source: string = "wp/v2 comments (public)";

    if (consumerKey && consumerSecret) {
      const v3 = await fetchV3Reviews(origin, product.id, consumerKey, consumerSecret);
      if (v3.length > 0) {
        reviews = v3;
        source = "wc/v3 reviews (authenticated)";
      }
    }

    if (reviews.length === 0) {
      reviews = await fetchWpComments(origin, product.id);
    }

    return jsonResponse({
      success: true,
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.prices?.price,
        currency: product.prices?.currency_code,
        average_rating: product.average_rating,
        review_count: product.review_count,
        permalink: product.permalink || productUrl,
      },
      reviews,
      source,
    });
  } catch (e) {
    return jsonResponse({ success: false, error: (e as Error).message }, 500);
  }
}, { port: 3002 }); 