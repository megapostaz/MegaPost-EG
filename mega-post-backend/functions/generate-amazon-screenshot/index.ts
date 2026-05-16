import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "npm:puppeteer-core";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-device-id",
};

const BLOCKED_RESOURCES = ["font", "media", "other", "manifest"];
const BLOCKED_DOMAINS = [
  "amazon-adsystem.com",
  "google-analytics.com",
  "facebook.net",
  "doubleclick.net",
  "advertising-api-eu.amazon.com",
];

async function generateProductCardImage(
  productUrl: string,
  browserlessKey: string,
) {
  let browser;

  try {
    const endpoint =
      `wss://chrome.browserless.io?token=${browserlessKey}&--lang=ar-EG&--disable-notifications&--disable-extensions`;

    browser = await puppeteer.connect({
      browserWSEndpoint: endpoint,
      defaultViewport: {
        width: 1280,
        height: 1600,
        deviceScaleFactor: 2,
      },
    });

    const page = await browser.newPage();

    // User-Agent حقيقي
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    );

    // الكوكيز الثابتة

    // الكوكيز الجديدة للحساب البديل
    // الكوكيز الجديدة للحساب البديل
    await page.setCookie(
      {
        name: "at-acbeg",
        value: "Atza|gQCY1oyvAwEBAhmkGLL0A5aWVR6hAiF8WjIAenv1m2ZECQ61-W8LMamOJRmUoCCEOwW72P1LxF6BGCJryt4h34PeiB9bpnPRKmlNCl3JtP4i8I4dkn2X1-3TEna2YTKNwzqDHmrHc9ElG3yCnD_2GLE8h0OWL9MxF4hPPIupMQqG-RQh3TP1qq9JzNfjg5pm29J-_xu_JGiq-aatOoVZgvv5paLH3aFENDW4OaHZhXtir0oKSFxotx7b4XVgJZBxeUGxEgQO9zR_De3jegveR74RQNhw2miHsGPssj3w0LsRmouKQRn6JUBBLQCzRYu8697YMBQPKPDLS57SJ1zFvIyahy3_o2Eya8y2jD9AzTUn23s",
        domain: ".amazon.eg",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "sess-at-acbeg",
        value: "HldfCJ5ftjccNAlVfcauRPohpvo53fu+an0YvkYAZy0=",
        domain: ".amazon.eg",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "session-id",
        value: "260-8240634-1834651",
        domain: ".amazon.eg",
        path: "/",
        secure: true,
      },
      {
        name: "session-id-time",
        value: "2082787201l",
        domain: ".amazon.eg",
        path: "/",
        secure: true,
      },
      {
        name: "session-token",
        value: "\"cSoKH6u8VPc34aj1Ule5oPm1Zbxsg+quO53klfbx3rB5IEJcFNdyE1iPR6wBlBjq2vIOBwg1aVQJxZcP2yvePuFFz3ys65LZRh75gZWcn6GcdlhEgiX5XaHYb7mYqqiHQg1Xx5NIiGHeqO1aK9HZBbGArBPyIfjZmG7BCecpzoaXT9wRXKsHpOqGZCLka/tXz4f89zudEWILQTYda20fucJMVEgkfaoiNonMcy5lTxNaUpZUe4Q1cg==\"",
        domain: ".amazon.eg",
        path: "/",
        secure: true,
      },
      {
        name: "sid",
        value: "4SpR5pvkpSNwc9Eqgn6vVw==|Z02Jcnl1QaZEmm647nprf5XfkZ0EOGg5o5tzVJGmJ1g=",
        domain: ".amazon.eg",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "sst-acbeg",
        value: "Sst1|PQKq2Z7jsN5K87ajhl1vp2zjDT2EXKUixpkfTyFjUMEJajC8Zgk0BIWRY9gmU5EL5z6BXN0l0UocM-uF1qN3MVBknJJN146HfToEwqC3XQmr8h-JBeuTHGz7s9PXOwWvv6ZBNQqC7wbNNtA7j2PQvMAzIcde4TgLLLcTpyZd64-ZAwQk3MiRK3Wv9HPBMUEHOyLrJE0G9GJQxXwUPMrxU_pZij-TJUdftalHuNdFuTmufMX4RGiEnbNvkZvppK4Vv6WwU5065TIec8duH7odJLVtwrw1eWRjdm4d1G4waPw5UgHn062A5-Lp1N39xPr_HSNRFeEPKpxozksR5pQSdG7jhhvLzmc36Mc9aRdVrY1MrHU5cBT54Z7ybitr1H-1XpdX",
        domain: ".amazon.eg",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "sso-state-acbeg",
        value: "Xdsso|ZQGZXZuzCePs5EkHZORUz7dEpOTeVmdibZRcKhhtQurZwnVUOpPTiCSwa3_9TPkxNy382U3lxHgxIRhPyI3oCH6N5P6zGclefsmj4iSd1BdDG_WV",
        domain: ".amazon.eg",
        path: "/",
        httpOnly: true,
        secure: true,
      },
      {
        name: "ubid-acbeg",
        value: "260-8851051-4635458",
        domain: ".amazon.eg",
        path: "/",
        secure: true,
      },
      {
        name: "x-acbeg",
        value: "dbVhXgz7oe65tfBukQX56tIgzwog5AtVycEkdGXKO09F88mT2jX2oLR4joocb4AA",
        domain: ".amazon.eg",
        path: "/",
        secure: true,
      },
      {
        name: "i18n-prefs",
        value: "EGP",
        domain: ".amazon.eg",
        path: "/",
      },
      {
        name: "lc-acbeg",
        value: "ar_AE",
        domain: ".amazon.eg",
        path: "/",
      }
    );
    // اللغة
    await page.setExtraHTTPHeaders({
      "Accept-Language": "ar-EG,ar;q=0.9,en-US;q=0.8,en;q=0.7",
    });

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      const url = req.url();

      if (
        BLOCKED_RESOURCES.includes(req.resourceType()) ||
        BLOCKED_DOMAINS.some((d) => url.includes(d))
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(productUrl, {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    const clipRegion = await page.evaluate(() => {
      const toHide = [
        "#nav-belt",
        "#nav-main",
        "#navFooter",
        ".nav-footer",
        "#wayfinding-breadcrumbs_feature_div",
        ".s-breadcrumb",
        '[id*="CardInstance"]',
        "#abbWrapper",
        "#newerVersion_feature_div",
        "#addToWishlist_feature_div",
        "#wishlistButtonStack",
        "#adLink",
        "#inline-twister-row-size_name",
        "#variation_size_name",
        "#nav-extra-special-messaging",
      ];

      toHide.forEach((s) => {
        document.querySelectorAll(s).forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.setProperty("display", "none", "important");
          }
        });
      });

      const applyHighlight = (el: HTMLElement) => {
        if (!el) return;
        el.style.border = "3px solid #00FFFF";
        el.style.borderRadius = "10px";
        el.style.padding = "8px";
        el.style.margin = "4px 0";
        el.style.display = "inline-block";
        el.style.width = "fit-content";
      };

      const priceSelectors = [
        ".a-price.apexPriceToPay",
        "#corePrice_desktop",
        "#corePriceDisplay_desktop_feature_div",
        "#price_inside_buybox",
      ];

      for (const selector of priceSelectors) {
        const el = document.querySelector(selector) as HTMLElement;
        if (el) {
          applyHighlight(el);
          break;
        }
      }

      const availability = document.getElementById(
        "availability",
      ) as HTMLElement;

      if (
        availability &&
        (
          availability.innerText.includes("تبقي") ||
          availability.innerText.includes("فقط") ||
          availability.innerText.includes("متبقي")
        )
      ) {
        applyHighlight(availability);
      }

      const ppd = document.getElementById("ppd");
      if (!ppd) return null;

      const leftCol = document.getElementById("leftCol");
      const imageCanvas =
        document.getElementById("imgTagWrapperId") ||
        document.getElementById("main-image-container");
      const sellerInfo =
        document.querySelector(".offer-display-features-container") ||
        document.getElementById("merchantInfoFeature_feature_div");
      const colorSection =
        document.getElementById("inline-twister-row-color_name") ||
        document.querySelector(".inline-twister-row");

      const ppdRect = ppd.getBoundingClientRect();
      const endpoints: number[] = [];

      if (leftCol) {
        endpoints.push(leftCol.getBoundingClientRect().bottom);
      }

      if (imageCanvas) {
        endpoints.push(imageCanvas.getBoundingClientRect().bottom);
      }

      if (sellerInfo) {
        endpoints.push((sellerInfo as Element).getBoundingClientRect().bottom);
      }

      if (colorSection) {
        endpoints.push((colorSection as Element).getBoundingClientRect().bottom);
      }

      if (endpoints.length === 0) {
        const price = document.getElementById("corePrice_desktop");
        if (price) {
          endpoints.push(price.getBoundingClientRect().bottom);
        }
      }

      const maxBottom = Math.max(...endpoints, ppdRect.top + 550);

      return {
        x: Math.max(0, ppdRect.x - 5),
        y: Math.max(0, ppdRect.y - 5),
        width: ppdRect.width + 10,
        height: (maxBottom - ppdRect.top) + 25,
      };
    });

    if (!clipRegion) {
      throw new Error("Could not find product details container (#ppd)");
    }

    await new Promise((r) => setTimeout(r, 300));

    const imageBuffer = await page.screenshot({
      type: "jpeg",
      quality: 90,
      clip: clipRegion,
    });

    return imageBuffer;
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { asin, url } = await req.json();
    const deviceId = req.headers.get("x-device-id");

    const productUrl = url
      ? url.replace("amazon.eg", "amazon.eg")
      : `https://www.amazon.eg/dp/${asin}`;

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: user } = await supabase
      .from("user_settings")
      .select("browserless_key")
      .eq("device_id", deviceId)
      .single();

    const browserlessKey = user?.browserless_key || "";

    const buffer = await generateProductCardImage(
      productUrl,
      browserlessKey,
    );

    if (!buffer) {
      throw new Error("Image generation failed");
    }

    const fileName = `smart_clip_${asin}_${Date.now()}.jpg`;

    const { error: uploadError } = await supabase
      .storage
      .from("banners")
      .upload(fileName, buffer, {
        contentType: "image/jpeg",
      });

    if (uploadError) {
      throw uploadError;
    }

    const {
      data: { publicUrl },
    } = supabase
      .storage
      .from("banners")
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({
        screenshot_url: publicUrl,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (e) {
    console.error("❌ Serve Error:", e.message);

    return new Response(
      JSON.stringify({
        error: e.message,
      }),
      {
        headers: corsHeaders,
        status: 400,
      },
    );
  }
});