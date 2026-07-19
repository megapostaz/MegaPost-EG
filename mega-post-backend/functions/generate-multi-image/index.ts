import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import puppeteer from "npm:puppeteer-core";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-device-id',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

    let browser;

    try {
        const { asins } = await req.json();
        const deviceId = req.headers.get('x-device-id');

        if (!asins || asins.length === 0) throw new Error("No ASINs provided");

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL')!,
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
        );

        const { data: user } = await supabase
            .from('user_settings')
            .select('browserless_key')
            .eq('device_id', deviceId)
            .single();

        const browserlessKey = user?.browserless_key || "";


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

        let base64Logo = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgLogo)))}`;


        const query = asins.join("|");
        const url = `https://www.amazon.eg/s?k=${encodeURIComponent(query)}`;

        const endpoint = `wss://chrome.browserless.io?token=${browserlessKey}&stealth`;

        browser = await puppeteer.connect({
            browserWSEndpoint: endpoint,
            defaultViewport: { width: 1920, height: 1080 }
        });

        const page = await browser.newPage();

        await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/121 Safari/537.36"
        );
        // 🔥 كوكيز Amazon Egypt كاملة

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
        await page.setExtraHTTPHeaders({
            'Accept-Language': 'ar-EG,ar;q=0.9'
        });

        await page.goto(url, {
            waitUntil: "domcontentloaded",
            timeout: 60000
        });

        await new Promise(r => setTimeout(r, 3000));

        console.log("✅ Page Loaded");

        // 🔥 الطريقة الجديدة
        await page.evaluate((orderedAsins, logoUri) => {
            return new Promise((resolve) => {
                document.documentElement.dir = "rtl";
                document.body.style.direction = "rtl";
                document.body.style.fontFamily = "Tahoma, Arial";

                const canvas = document.createElement("div");
                canvas.id = "custom-screenshot-canvas";

                canvas.style.background = "#fff";
                canvas.style.display = "flex";
                canvas.style.flexWrap = "wrap";
                canvas.style.flexDirection = "row-reverse";
                canvas.style.gap = "20px";
                canvas.style.padding = "20px";
                canvas.style.width = "max-content";
                canvas.style.maxWidth = "1920px";
                canvas.style.position = "absolute";
                canvas.style.top = "0";
                canvas.style.left = "0";
                canvas.style.zIndex = "9999999";
                canvas.style.border = "6px solid #28a745";
                canvas.style.boxSizing = "border-box";

                const cards = document.querySelectorAll('div[data-component-type="s-search-result"]');
                const map = {};

                cards.forEach(card => {
                    const asin = card.getAttribute("data-asin");
                    const isSponsored = card.querySelector(".puis-sponsored-label-text");

                    if (asin && !isSponsored && card.offsetWidth > 200) {
                        map[asin] = card;
                    }
                });

                const orderedElements = orderedAsins
                    .map(a => map[a])
                    .filter(Boolean);

                orderedElements.reverse().forEach((el) => {
                    const unwanted = el.querySelectorAll(
                        'span[data-component-type="s-status-badge-component"], div[data-cy="secondary-offer-recipe"]'
                    );
                    unwanted.forEach(e => e.remove());

                    el.style.width = el.offsetWidth + "px";
                    el.style.minWidth = el.offsetWidth + "px";
                    el.style.margin = "0";
                    // 🔥 ضرورية عشان نخفي أي حاجة تحت القص
                    el.style.overflow = "hidden";

                    canvas.appendChild(el);
                });

                const root = document.querySelector("#a-page");
                if (root) root.style.display = "none";

                document.body.appendChild(canvas);

                // 🔥 بنستنى جزء من الثانية عشان نحسب أبعاد الأزرار صح
                setTimeout(() => {
                    // قص كل كارت بالظبط عند زرار إضافة إلى عربة التسوق
                    orderedElements.forEach((el) => {
                        const atcBtn = el.querySelector('.a-button-primary, .puis-atcb-add-container, button');
                        if (atcBtn) {
                            const elRect = el.getBoundingClientRect();
                            const btnRect = atcBtn.getBoundingClientRect();
                            // نحسب طول الكارت لحد آخر الزرار ونزود 15 بيكسل مسافة شكلها نضيف
                            const targetHeight = btnRect.bottom - elRect.top + 15;
                            el.style.height = targetHeight + "px";
                        }
                    });

                    // 🔥 إضافة اللوجو مرة واحدة فقط في مكانه تحت على اليمين 
                    // 🔥 إضافة اللوجو مرة واحدة فقط في مكانه تحت على الشمال 
                    if (logoUri) {
                        const logo = document.createElement("img");
                        logo.src = logoUri;
                        logo.style.position = "absolute";
                        logo.style.bottom = "0px";
                        logo.style.left = "20px"; // التعديل هنا: تبديل right بـ left
                        logo.style.width = "85px";
                        logo.style.height = "auto";
                        logo.style.zIndex = "1000000";

                        logo.onload = () => resolve(true);
                        logo.onerror = () => resolve(true);

                        canvas.appendChild(logo);
                    } else {
                        resolve(true);
                    }
                }, 150);
            });
        }, asins, base64Logo);

        await new Promise(r => setTimeout(r, 1500));

        const element = await page.$("#custom-screenshot-canvas");

        if (!element) throw new Error("Canvas not created");

        const buffer = await element.screenshot({
            type: "jpeg",
            quality: 100
        });

        const fileName = `multi_canvas_${Date.now()}.jpg`;

        const { error: uploadError } = await supabase
            .storage
            .from('banners')
            .upload(fileName, buffer, { contentType: 'image/jpeg' });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase
            .storage
            .from('banners')
            .getPublicUrl(fileName);

        return new Response(JSON.stringify({ image_url: publicUrl }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
        });

    } catch (e: any) {
        return new Response(JSON.stringify({ error: e.message }), {
            status: 400,
            headers: corsHeaders
        });
    } finally {
        if (browser) await browser.close();
    }
});