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
  let base64Logo = "";

  // 🎯 تصميم لوجو "سلة الخصومات" المطور - نفس الفكرة الأصلية بس أشيك واحترافي جداً
  const svgLogo = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 450">
    <defs>
      <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7e22ce" />
        <stop offset="100%" stop-color="#db2777" />
      </linearGradient>
      
      <linearGradient id="coinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FDE047" />
        <stop offset="50%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#B45309" />
      </linearGradient>

      <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FCD34D" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.12"/>
      </filter>
      
      <filter id="coinShadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" flood-color="#000000" flood-opacity="0.2"/>
      </filter>
    </defs>

    <circle cx="200" cy="180" r="160" fill="#ffffff" filter="url(#softShadow)"/>
    
    <circle cx="200" cy="180" r="150" fill="none" stroke="url(#ringGrad)" stroke-width="4"/>

    <path d="M100 110 L125 160" fill="none" stroke="#4c1d95" stroke-width="14" stroke-linecap="round"/>
    
    <path d="M115 160 L300 160 L270 250 L145 250 Z" fill="url(#cartGrad)"/>
    <path d="M145 250 C145 275, 270 275, 270 250" fill="none" stroke="url(#cartGrad)" stroke-width="12" stroke-linecap="round"/>

    <circle cx="165" cy="285" r="15" fill="#4c1d95"/>
    <circle cx="250" cy="285" r="15" fill="#4c1d95"/>
    <circle cx="165" cy="285" r="5" fill="#ffffff"/>
    <circle cx="250" cy="285" r="5" fill="#ffffff"/>

    <path d="M85 105 L100 120 L130 85" fill="none" stroke="#10B981" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
    
    <path d="M130 280 L145 295 L175 260" fill="none" stroke="#10B981" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>

    <circle cx="225" cy="165" r="65" fill="url(#coinGrad)" filter="url(#coinShadow)"/>
    <circle cx="225" cy="165" r="55" fill="none" stroke="#FEF3C7" stroke-width="2" opacity="0.6"/>
    
    <text x="225" y="190" font-family="Arial, sans-serif" font-size="70" font-weight="bold" fill="#FFFFFF" text-anchor="middle">%</text>

    <path d="M150 110 Q160 110 160 100 Q160 110 170 110 Q160 110 160 120 Q160 110 150 110 Z" fill="#FDE047"/>
    <path d="M280 90 Q290 90 290 80 Q290 90 300 90 Q290 90 290 100 Q290 90 280 90 Z" fill="#FDE047"/>
    <path d="M295 190 Q300 190 300 185 Q300 190 305 190 Q300 190 300 195 Q300 190 295 190 Z" fill="#FDE047"/>

    <text x="200" y="385" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="42" font-weight="900" fill="#1E293B" text-anchor="middle">Discount Basket</text>
    <text x="200" y="420" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="bold" fill="#475569" text-anchor="middle">سلة الخصومات</text>
  </svg>`;

  base64Logo = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgLogo)))}`;

  try {
    const endpoint =
      `wss://chrome.browserless.io?token=${browserlessKey}&--lang=ar-EG&--disable-notifications&--disable-extensions`;

    browser = await puppeteer.connect({
      browserWSEndpoint: endpoint,
      defaultViewport: {
        width: 1920,
        height: 1600,
        deviceScaleFactor: 2,
      },
    });

    const page = await browser.newPage();

    // User-Agent حقيقي
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36",
    );

    // الكوكيز الثابتة للحساب البديل
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

    const clipRegion = await page.evaluate((logoDataUri) => {
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

      const applyHighlight = (el: HTMLElement, color: string) => {
        if (!el) return;
        el.style.border = `3px solid ${color}`;
        el.style.borderRadius = "10px";
        el.style.padding = "8px";
        el.style.margin = "4px 0";
        el.style.display = "inline-block";
        el.style.width = "fit-content";
      };

      // ✅ استهداف العمود اللي في النص فقط عشان نتجاهل سعر الشمال
      const centerCol = document.getElementById("centerCol");
      if (centerCol) {
        const priceSelectors = [
          ".a-price.apexPriceToPay",
          "#corePrice_desktop",
          "#corePriceDisplay_desktop_feature_div",
          "#price_inside_buybox",
        ];

        for (const selector of priceSelectors) {
          const el = centerCol.querySelector(selector) as HTMLElement;
          if (el) {
            applyHighlight(el, "red"); // اللون أحمر
            break;
          }
        }

        // ✅ تلوين حالة التوفر باللون الأحمر (في العمود الأوسط فقط)
        const availability = centerCol.querySelector("#availability") as HTMLElement;
        if (
          availability &&
          (
            availability.innerText.includes("تبقي") ||
            availability.innerText.includes("فقط") ||
            availability.innerText.includes("متبقي")
          )
        ) {
          applyHighlight(availability, "red");
        }
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

      // ✅ أبعاد الإطار مع مساحة إضافية من فوق
      // ✅ تطبيق المنطق الثابت والناجح لحساب اليمين واليسار
      const imageRect = imageCanvas
        ? imageCanvas.getBoundingClientRect()
        : leftCol
          ? leftCol.getBoundingClientRect()
          : ppdRect;

      const topPadding = 45; // مسافة من فوق عشان الكلام ميتغطاش

      // 1. حساب نقطة البداية (يسار) بخصم 70 بيكسل كمسافة أمان
      const clipX = Math.max(0, ppdRect.left - 70);
      const clipY = Math.max(0, ppdRect.top + window.scrollY - topPadding);

      // 2. حساب نقطة النهاية (يمين) وعرض الإطار الإجمالي
      let maxRightEdge = imageRect.right;
      let clipWidth = (maxRightEdge - clipX) + 70;
      const clipHeight = (maxBottom - ppdRect.top) + 40 + topPadding;

      // 3. صمام الأمان: منع الإطار من تخطي عرض الشاشة الفعلي (مهم جداً للملابس)
      const maxPageWidth = document.documentElement.scrollWidth;
      if (clipX + clipWidth > maxPageWidth) {
        clipWidth = maxPageWidth - clipX - 5;
      }

      // ✅ إنشاء الإطار الخارجي الأخضر
      const overlay = document.createElement("div");
      overlay.style.position = "absolute";
      overlay.style.left = (clipX + window.scrollX) + "px";
      overlay.style.top = clipY + "px";
      overlay.style.width = clipWidth + "px";
      overlay.style.height = clipHeight + "px";
      overlay.style.border = "6px solid #28a745"; // الإطار الأخضر
      overlay.style.boxSizing = "border-box";
      overlay.style.zIndex = "999999";
      overlay.style.pointerEvents = "none";

      return new Promise((resolve) => {
        if (logoDataUri) {
          const logo = document.createElement("img");
          logo.src = logoDataUri;
          logo.style.position = "absolute";
          logo.style.bottom = "20px";
          logo.style.right = "20px";
          logo.style.width = "120px";
          logo.style.height = "auto";
          logo.style.zIndex = "1000000";

          logo.onload = () => {
            overlay.appendChild(logo);
            document.body.appendChild(overlay);
            resolve({ x: clipX, y: clipY, width: clipWidth, height: clipHeight });
          };

          logo.onerror = () => {
            document.body.appendChild(overlay);
            resolve({ x: clipX, y: clipY, width: clipWidth, height: clipHeight });
          };
        } else {
          document.body.appendChild(overlay);
          resolve({ x: clipX, y: clipY, width: clipWidth, height: clipHeight });
        }
      });
    }, base64Logo);

    if (!clipRegion) {
      throw new Error("Could not find product details container (#ppd)");
    }

    await new Promise((r) => setTimeout(r, 300));

    const imageBuffer = await page.screenshot({
      type: "jpeg",
      quality: 90,
      clip: clipRegion as any,
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
  } catch (e: any) {
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