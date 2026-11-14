const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const productId = url.searchParams.get("productId");
    const queryName = url.searchParams.get("name");
    const queryBrand = url.searchParams.get("brand");
    const autoSave = url.searchParams.get("autoSave") === "true";

    let name = queryName;
    let brand = queryBrand;

    if (!name && productId) {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}&select=name,brand`, {
        headers: {
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
      });
      if (!resp.ok) throw new Error(`Failed to look up product: ${resp.status}`);
      const rows = await resp.json() as Array<{ name: string; brand: string | null }>;
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: "Product not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      name = rows[0].name;
      brand = rows[0].brand;
    }

    if (!name) {
      return new Response(JSON.stringify({ error: "Product name or productId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const searchTerms = brand ? `${brand} ${name}` : name;
    const offUrl = `https://world.openfoodfacts.org/cgi/search.pl?search_terms=${encodeURIComponent(searchTerms)}&search_simple=1&action=process&json=1&page_size=5&fields=code,product_name,brands,image_front_url,image_url,image_small_url`;

    const offResp = await fetch(offUrl, {
      headers: { "User-Agent": "SnackMate/1.0 (product image search)" },
    });
    if (!offResp.ok) throw new Error(`Open Food Facts request failed: ${offResp.status}`);

    const offData = await offResp.json() as {
      products?: Array<{
        code?: string;
        product_name?: string;
        brands?: string;
        image_front_url?: string;
        image_url?: string;
        image_small_url?: string;
      }>;
    };

    const products = offData.products ?? [];
    const bestMatch = products.find(
      (p) =>
        (p.image_front_url || p.image_url) &&
        p.product_name &&
        p.product_name.toLowerCase().includes(name!.toLowerCase().split(/\s+/)[0]),
    ) ?? products.find((p) => p.image_front_url || p.image_url);

    const imageUrl = bestMatch?.image_front_url ?? bestMatch?.image_url ?? null;
    const barcode = bestMatch?.code ?? null;

    if (autoSave && productId && imageUrl) {
      const updateResp = await fetch(`${SUPABASE_URL}/rest/v1/products?id=eq.${productId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          apikey: SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({ image_url: imageUrl, ...(barcode ? { barcode } : {}) }),
      });
      if (!updateResp.ok) throw new Error(`Failed to update product image: ${updateResp.status}`);
    }

    return new Response(
      JSON.stringify({
        imageUrl,
        barcode,
        found: imageUrl !== null,
        productName: bestMatch?.product_name ?? null,
        brand: bestMatch?.brands ?? null,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
