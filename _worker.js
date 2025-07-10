// Util Functions
function escapeHtml(text) {
	return (text || '').replace(/[&<>"]'/g, m => ({
		'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
	})[m]);
}
function simpleEncode(domain, slug, length = 9) {
	const seed = `${domain}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
function detectLang(domain, slug, idSuffix) {
	const langs = ['ko', 'en', 'ja', 'fr', 'es', 'pt', 'it', 'th', 'ar', 'pl', 'de'];
	for (const lang of langs) {
		if (generateId(domain, lang, slug, 5) === idSuffix) return lang;
	}
	return null;
}
function generateId(domain, lang, slug, length = 5) {
	const seed = `${domain}|${lang}|${slug}`;
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash << 5) - hash + seed.charCodeAt(i);
		hash |= 0;
	}
	const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result = '';
	let value = Math.abs(hash);
	while (result.length < length) {
		result += chars[value % chars.length];
		value = Math.floor(value / chars.length);
	}
	return result;
}
const generateProductHtml = (data, lang, url, affUrl, slug) => {
	const title = escapeHtml(data.document_title || slug);
	const description = escapeHtml(data.newdescription || '');
	const productName = escapeHtml(data.titlesingle);
	const imageUrls = data.product_small_image_urls || [];
	const randomSlug = escapeHtml(data.slugAcak);
	const randomIdSuffix = generateId(url.hostname, lang, data.slugAcak, 5);
	const randomInternalUrl = `/${randomSlug}-${randomIdSuffix}`;
	const randomSlugText = randomSlug.replace(/-/g, ' ');
	const priceFormatted = escapeHtml(data.target_original_price_formatted);
	const dir = data.dir || 'ltr';

	const buyButtonLabels = {
		en: 'Detail Product',
		ko: '제품 상세보기',
		ja: '商品詳細',
		de: 'Produktdetails',
		pl: 'Szczegóły produktu',
		th: 'ดูรายละเอียดสินค้า',
		es: 'Detalles del producto',
		pt: 'Detalhes do produto',
		ar: 'تفاصيل المنتج',
		it: 'Dettagli del prodotto',
		fr: 'Détails du produit'
	};
	const buyLabel = buyButtonLabels[lang] || buyButtonLabels['en'];
	return `<!DOCTYPE html>
<html lang="${lang}">
<head>
<meta charset="UTF-8">
<title>${title}</title>
<meta name="description" content="${description}">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="robots" content="index,follow">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${description}">
<meta property="og:image" content="${imageUrls[0]}">
<meta property="og:url" content="${url.href}">
<meta property="og:type" content="product">
<meta property="og:site_name" content="go.gibsob.com">
<link rel="canonical" href="${url.origin}${url.pathname}${url.search}">
<link rel="icon" type="image/png" href="/favicon.ico"/>
<meta name="theme-color" content="#ffffff" />
<style>
body{font-family:Arial,sans-serif;background-color:#f1f1f1;margin:0;padding:20px;display:flex;justify-content:center}.product-wrapper{max-width:768px;margin:0 auto;padding:1rem;background:#fff;border-radius:12px;box-shadow:0 2px 10px rgb(0 0 0 / .05);box-sizing:border-box}.product-title{font-size:20px;text-align:center;margin-bottom:1rem;color:#111;padding:0 1rem;word-break:break-word}.product-gallery{width:100%;max-width:768px;margin:0 auto;padding:1rem;display:flex;flex-direction:column;align-items:center;background:#fff;border-radius:10px;box-shadow:0 2px 8px rgb(0 0 0 / .05);box-sizing:border-box}.main-image{width:100%;height:auto;border:1px solid #ccc;border-radius:8px;margin-bottom:16px;box-shadow:0 0 10px rgb(0 0 0 / .1)}.thumbnails{display:flex;flex-wrap:wrap;justify-content:center;gap:10px;margin-bottom:16px;max-width:100%}.thumb{width:72px;height:72px;object-fit:cover;border:2px solid #fff0;border-radius:6px;cursor:pointer;transition:border-color 0.3s,transform 0.2s}.thumb:hover{border-color:#007bff;transform:scale(1.05)}.description{padding:0 1rem;font-size:14px;text-align:center;line-height:1.6;color:#333}.buy-button{display:block;background-color:#c62828;color:#fff;font-weight:700;padding:12px 24px;margin:24px auto 0;border:none;border-radius:6px;text-decoration:none;font-size:16px;text-align:center;transition:background-color 0.3s ease;box-shadow:0 4px 10px rgb(0 0 0 / .1);max-width:300px}.buy-button:hover{background-color:#b71c1c}.related-link{text-align:center;font-size:14px;margin:20px auto 10px;padding:8px 12px;background-color:#fff;border-radius:6px;display:inline-block;box-shadow:0 1px 4px rgb(0 0 0 / .05)}.related-link a{color:#0056b3;text-decoration:none;font-weight:500}.related-link a:hover{text-decoration:underline}.breadcrumb{padding-left:12px;margin-top:8px;margin-bottom:8px;font-size:13px;color:#333}.breadcrumb a{color:#333;text-decoration:none}.breadcrumb a:hover{text-decoration:underline}.price-box{text-align:center;margin:16px 0 8px;font-family:'Arial',sans-serif}.price-label{font-size:20px;color:#222}.price-value{font-size:28px;font-weight:700;color:#222}@media (max-width:480px){.thumb{width:64px;height:64px}.product-gallery{padding:.5rem}.description{font-size:13px}.button-link{width:100%;text-align:center}}
</style>
<script type="application/ld+json">
${JSON.stringify({
		"@context": "https://schema.org/",
		"@type": "Product",
		name: data.titlesingle,
		image: imageUrls,
		description: data.newdescription,
		sku: data.productId,
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: data.stars,
			reviewCount: data.lastest_volume,
		},
		offers: {
			"@type": "Offer",
			url: url.href,
			priceCurrency: data.target_currency,
			price: Number(data.sale_price),
			availability: "https://schema.org/InStock",
		}
	})}
</script>
</head>
<body>
<div class="product-wrapper">
<div class="breadcrumb">
<a href="/">🏠 HOME</a>
</div>
<div class="product-gallery">
<img id="mainImage" src="${imageUrls[0]}" alt="${productName}" class="main-image" loading="lazy" />
<h1 class="product-title">${productName}</h1>
<div class="thumbnails">
${imageUrls.map((url, i) => `
<img src="${url}" alt="${productName} ${i + 1}" class="thumb ${i === 0 ? 'active' : ''}" loading="lazy" />
`).join('')}
</div>
</div>
<div class="price-box">
<span class="price-label"></span><span class="price-value">${priceFormatted.replace(/^US\s*/, '')}</span>
</div>
<p class="description" dir="${dir}">${description}</p>
<div class="related-link">
🔗 <a href="${randomInternalUrl}">${randomSlugText}</a>
</div>
<a href="${affUrl}" class="buy-button" rel="nofollow noopener">${buyLabel}</a>
</div>
<div style="display:none;">
<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
</div>
<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
if (!isBot && !navigator.webdriver) {
setTimeout(() => {
location.href = "${affUrl}";
}, 3000);
}
})();
</script>

<script>
(function() {
const isBot = /bot|crawl|spider|slurp|google/i.test(navigator.userAgent);
let lang = "${lang}";
const redirectUrlHuman = "${affUrl}";
if (lang === "en") lang = "www";
const redirectUrlBot = "https://" + lang + ".aliexpress.com/item/${data.productId}.html";
if (isBot) {
setTimeout(() => {
location.href = redirectUrlBot;
}, 3000);
} else {
setTimeout(() => {
location.href = redirectUrlHuman;
}, 3000);
}
})();
</script>

</body>
</html>`;
};

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const effectiveDomain = url.hostname;

		const cleanPath = pathname.startsWith("/") ? pathname.slice(1) : pathname;
		if (!self.verificationLists) {
			self.verificationLists = [];

			const sources = [
				{ url: "https://go.gibsob.com/verif.txt", base: "https://athineama.github.io/HTML/" },
				{ url: "https://go.gibsob.com/test.txt", base: "https://ambeyen.github.io/HTML/" },
				{ url: "https://go.gibsob.com/xyz.txt", base: "https://namalain.github.io/HTML/" },
			];

			// Ambil semua daftar verifikasi sekaligus
			self.verificationLists = await Promise.all(
				sources.map(async ({ url, base }) => {
					const res = await fetch(url);
					const text = await res.text();
					const paths = new Set(
						text.split("\n").map(line => line.trim()).filter(Boolean)
					);
					return { base, paths };
				})
			);
		}

		// Cek apakah `cleanPath` ada di salah satu verification list
		for (const { base, paths } of self.verificationLists) {
			if (paths.has(cleanPath)) {
				const fileRes = await fetch(`${base}${cleanPath}`);

				if (!fileRes.ok) {
					return new Response("Failed to load verification file", { status: 502 });
				}

				const html = await fileRes.text();

				return new Response(html, {
					status: 200,
					headers: {
						"Content-Type": "text/html; charset=UTF-8",
						"Cache-Control": "public, max-age=3600",
					},
				});
			}
		}

		if (pathname === "/google613292532e0cfce0.html") {
			const fileRes = await fetch("https://nde.buytostore.com/google613292532e0cfce0.html");

			if (!fileRes.ok) {
				return new Response("Failed to load verification file", { status: 502 });
			}

			const html = await fileRes.text();

			return new Response(html, {
				status: 200,
				headers: {
					"Content-Type": "text/html; charset=UTF-8",
					"Cache-Control": "public, max-age=3600",
				},
			});
		}
		// ✅ Redirect dari URL dengan "?" ke SEO-friendly path
		if (url.search) {
			const redirectedSlug = decodeURIComponent(url.search.slice(1));
			return Response.redirect(`${url.origin}/${redirectedSlug}`, 301);
		}

		// ✅ Handle homepage
		if (pathname === "/") {
			const homeHtml = `

<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>go.gibsob.com</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            margin: 0;
            padding: 20px;
        }

        h1 {
            text-align: center;
            color: #343a40;
        }

        .container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 15px;
            margin-top: 20px;
        }

        .btn {
            display: inline-block;
            padding: 10px 15px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            text-decoration: none;
            transition: background-color 0.3s;
        }

        .btn:hover {
            background-color: #0056b3;
        }

        @media (max-width: 600px) {
            .btn {
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <h1>go.gibsob.com</h1>
    <div class="container">
        <a rel="dofollow" href="item/2yyqm76gfz.txt" class="btn">aAsIcHfN</a><a rel="dofollow" href="item/7zwgmnvf23.txt" class="btn">IZsONW4i</a><a rel="dofollow" href="item/05heqeuv5f.txt" class="btn">R2RraV5b</a><a rel="dofollow" href="item/j9yjpcxtqu.txt" class="btn">bz8d9vFX</a><a rel="dofollow" href="item/82ldcnnq4a.txt" class="btn">RWOCXD6l</a><a rel="dofollow" href="item/9wcynunff0.txt" class="btn">XvmPOZzV</a><a rel="dofollow" href="item/9q9esfnvk1.txt" class="btn">QdsYBeDl</a><a rel="dofollow" href="item/jtuh79a6yp.txt" class="btn">E1dcXAQ6</a><a rel="dofollow" href="item/co57jnr8s4.txt" class="btn">RJIxaLkE</a><a rel="dofollow" href="item/plnz1zvqlf.txt" class="btn">YCA8BgLB</a><a rel="dofollow" href="item/cgs3ev6rbv.txt" class="btn">pi4mq6PM</a><a rel="dofollow" href="item/pma2bwhuy3.txt" class="btn">uuR5UE4H</a><a rel="dofollow" href="item/h34bx673bt.txt" class="btn">6HxOH6VP</a><a rel="dofollow" href="item/fz4vlosdh6.txt" class="btn">zaR6tKAQ</a><a rel="dofollow" href="item/xpd2gztns0.txt" class="btn">dvRq0ttT</a><a rel="dofollow" href="item/0p57pyaon2.txt" class="btn">C4D3n9mm</a><a rel="dofollow" href="item/8buyq76k9e.txt" class="btn">r32QlgyZ</a><a rel="dofollow" href="item/kwt1hw6hhc.txt" class="btn">G9wVfszl</a><a rel="dofollow" href="item/ua6ht1y2je.txt" class="btn">q8XT0k56</a><a rel="dofollow" href="item/z2mdz5z9pn.txt" class="btn">XIMNSnDi</a><a rel="dofollow" href="item/xhl3or05ms.txt" class="btn">sRy9civX</a><a rel="dofollow" href="item/vfm5zym8hf.txt" class="btn">xuuKLO0V</a><a rel="dofollow" href="item/xv8vlt65uz.txt" class="btn">VZzFHlkU</a><a rel="dofollow" href="item/hjnqooscme.txt" class="btn">oNAzpBcu</a><a rel="dofollow" href="item/n44wqbdi02.txt" class="btn">YNzANeSR</a><a rel="dofollow" href="item/w0l6gvng1c.txt" class="btn">r1GeVjPQ</a><a rel="dofollow" href="item/3s4ghtusam.txt" class="btn">oIiFIpr6</a><a rel="dofollow" href="item/e9fw43i7kf.txt" class="btn">keWoW9kl</a><a rel="dofollow" href="item/6034t6dhe4.txt" class="btn">GmlDMOS9</a><a rel="dofollow" href="item/4kt0vfdv0d.txt" class="btn">fEbYEH9y</a><a rel="dofollow" href="item/2p5gpfbn2v.txt" class="btn">KmW4h6aM</a><a rel="dofollow" href="item/qaydtyo11d.txt" class="btn">Unr4i5OJ</a><a rel="dofollow" href="item/3lxo0j1hyr.txt" class="btn">SDOFLLLd</a><a rel="dofollow" href="item/4ptf137ejm.txt" class="btn">IiM9rVH9</a><a rel="dofollow" href="item/w54vi54hg8.txt" class="btn">OFg0nnWK</a><a rel="dofollow" href="item/ee1jeuykp1.txt" class="btn">Fo1tgsqg</a><a rel="dofollow" href="item/jb8it7kma0.txt" class="btn">RupMsQRD</a><a rel="dofollow" href="item/xaqutsicb5.txt" class="btn">CG11OHWb</a><a rel="dofollow" href="item/llicvamhp9.txt" class="btn">OJA0w131</a><a rel="dofollow" href="item/k50jmt9wv7.txt" class="btn">zsl06NEE</a><a rel="dofollow" href="item/t477pcok6k.txt" class="btn">lpKvQDMz</a><a rel="dofollow" href="item/hmjzdiqfml.txt" class="btn">fbE9PKtM</a><a rel="dofollow" href="item/f389nd69hq.txt" class="btn">KmfLprWe</a><a rel="dofollow" href="item/a0lod2bl3c.txt" class="btn">SDzToyw8</a><a rel="dofollow" href="item/p8kexkiy36.txt" class="btn">6ZZckf7F</a><a rel="dofollow" href="item/ks6gtugh6b.txt" class="btn">e7i6dqZA</a><a rel="dofollow" href="item/bzdstqz7d6.txt" class="btn">56CzeH9D</a><a rel="dofollow" href="item/j33dkeizvq.txt" class="btn">tIIlo3xM</a><a rel="dofollow" href="item/go8dvujupl.txt" class="btn">AauXvnkV</a><a rel="dofollow" href="item/rnlg0valq2.txt" class="btn">quYofV5n</a><a rel="dofollow" href="item/nybbprhutc.txt" class="btn">gHt4EmZb</a><a rel="dofollow" href="item/0aed2b5amv.txt" class="btn">MeHudc5a</a><a rel="dofollow" href="item/rnak7qmokw.txt" class="btn">zPlhLHmx</a><a rel="dofollow" href="item/swb4fx06sf.txt" class="btn">adwZmIaO</a><a rel="dofollow" href="item/x5r701kvo3.txt" class="btn">wDo3mzAI</a><a rel="dofollow" href="item/zvlgyl4vyd.txt" class="btn">L91KBt67</a><a rel="dofollow" href="item/jr0xk57c8g.txt" class="btn">cOPXg9P1</a><a rel="dofollow" href="item/s5muutrlql.txt" class="btn">qsWKlF4D</a><a rel="dofollow" href="item/5iqxo47zky.txt" class="btn">xH6CKFNn</a><a rel="dofollow" href="item/6tzwqyv1sz.txt" class="btn">aUfFsRp7</a><a rel="dofollow" href="item/229j4hy6sx.txt" class="btn">LF0SDEDE</a><a rel="dofollow" href="item/d5wyovnc9e.txt" class="btn">6bW4T7Vw</a><a rel="dofollow" href="item/r2nk2jig4h.txt" class="btn">CaLetUmx</a><a rel="dofollow" href="item/4an3wsl4i3.txt" class="btn">MaiRRw0I</a><a rel="dofollow" href="item/jih2gy39cq.txt" class="btn">0GKvmfaB</a><a rel="dofollow" href="item/777t7likeq.txt" class="btn">5001j64o</a><a rel="dofollow" href="item/a7lyqzw8nc.txt" class="btn">dMzcH2DY</a><a rel="dofollow" href="item/ketv10bahg.txt" class="btn">vHHhsrUs</a><a rel="dofollow" href="item/pfsassi5jl.txt" class="btn">Bh5uEqUi</a><a rel="dofollow" href="item/rnn0xr942w.txt" class="btn">HE3Ja8NF</a><a rel="dofollow" href="item/wa708pw742.txt" class="btn">V51ACoCx</a><a rel="dofollow" href="item/djjrwl7xub.txt" class="btn">KLv6jHWO</a><a rel="dofollow" href="item/3mkttgx3n3.txt" class="btn">sIdFvsJt</a><a rel="dofollow" href="item/ixs7on1awi.txt" class="btn">W4XUoiqJ</a><a rel="dofollow" href="item/coctq8nyp2.txt" class="btn">Z9zcThwT</a><a rel="dofollow" href="item/8rxbx2owxd.txt" class="btn">btxZSDZZ</a><a rel="dofollow" href="item/6lc56c32gb.txt" class="btn">GYkAq47c</a><a rel="dofollow" href="item/1htoj1xfjg.txt" class="btn">aSghOOWu</a><a rel="dofollow" href="item/xyo130qtdh.txt" class="btn">jixTgaHC</a><a rel="dofollow" href="item/dhpje7zl1o.txt" class="btn">eUoIk51m</a><a rel="dofollow" href="item/mxf5cvivhc.txt" class="btn">hgCr2iBa</a><a rel="dofollow" href="item/kcby9obu9u.txt" class="btn">zGqUPiVs</a><a rel="dofollow" href="item/5q2hk11xga.txt" class="btn">hZ0jCtKa</a><a rel="dofollow" href="item/5g2bqoksem.txt" class="btn">MdZe4FfU</a><a rel="dofollow" href="item/ujaullknyt.txt" class="btn">ZJngeR2F</a><a rel="dofollow" href="item/tnxuitlwpe.txt" class="btn">S214rTzp</a><a rel="dofollow" href="item/ufbkxiy9v3.txt" class="btn">ZEGcu3J2</a><a rel="dofollow" href="item/vum6r5mkmn.txt" class="btn">hybK2bm4</a><a rel="dofollow" href="item/5on7yxjmmg.txt" class="btn">VPGnYECR</a><a rel="dofollow" href="item/pe7l70v5dj.txt" class="btn">W9A3BKCk</a><a rel="dofollow" href="item/spsrvrpd83.txt" class="btn">XrEaxgZZ</a><a rel="dofollow" href="item/s0yjp143t8.txt" class="btn">Ct41h49b</a><a rel="dofollow" href="item/l10vk3vtgh.txt" class="btn">L0XM1aTk</a><a rel="dofollow" href="item/6d6isnquqq.txt" class="btn">wyCdYgCx</a><a rel="dofollow" href="item/ot9tra66yx.txt" class="btn">1UkQQRJp</a><a rel="dofollow" href="item/uf02vymok5.txt" class="btn">CmyAO2Op</a><a rel="dofollow" href="item/p9gojh2wpn.txt" class="btn">G627jzqi</a><a rel="dofollow" href="item/ewmr26sq9c.txt" class="btn">PdnXZ89o</a><a rel="dofollow" href="item/494d3yl054.txt" class="btn">4FIDDtsa</a><a rel="dofollow" href="item/myu18cqqrr.txt" class="btn">9losWHLu</a>    </div>
	<div style="display:none;">
		<img src="//sstatic1.histats.com/0.gif?4804389&101" alt="histats" width="1" height="1">
	</div>
</body>
</html>
`;
			return new Response(homeHtml, {
				headers: { "Content-Type": "text/html; charset=UTF-8" },
			});
		}

		// ✅ Tangani file statis (robots.txt, favicon, sitemap, verifikasi)
		const staticExtensions = ['.ico', '.txt', '.txt.gz', '.xml', '.xml.gz', '.calueralf'];
		for (const ext of staticExtensions) {
			if (pathname.endsWith(ext)) {
				return env.ASSETS.fetch(request);
			}
		}

		const staticFiles = ['style.css', 'favicon.ico', 'robots.txt', 'sitemap.txt', 'sitemap-index.xml'];
		if (staticFiles.includes(pathname.slice(1))) {
			return env.ASSETS.fetch(request);
		}

		// ✅ Tangani dynamic path seperti "/produk-abc-2slSQ"
		const slugPath = decodeURIComponent(pathname.slice(1));
		const match = slugPath.match(/^(.*)-([a-zA-Z0-9]{5})$/);

		if (!match) {
			return new Response("Bad URL Format", { status: 400 });
		}

		const slug = match[1];
		const suffix = match[2];

		const lang = detectLang(effectiveDomain, slug, suffix);
		if (!lang) {
			return new Response("Language detection failed", { status: 400 });
		}
		const realang = lang === "en" ? "www" : lang;
		const subID = simpleEncode(effectiveDomain, slug, 7);
		const apiUrl = `https://${subID}.buytostore.com/i/${effectiveDomain}/${lang}/${slug}`;

		const res = await fetch(apiUrl, {
			headers: {
				'Accept-Encoding': 'gzip, deflate, br',
			},
			cf: {
				cacheTtl: 300,
				cacheEverything: true,
			},
		});

		if (!res.ok) {
			return new Response("404 - Product Not Found", { status: 404 });
		}

		const data = await res.json();
		const productId = data.productId;
		const affKey = '_DkhJKeT';
		const affUrl = `https://s.click.aliexpress.com/deep_link.htm?aff_short_key=${affKey}&dl_target_url=https://www.aliexpress.com/item/${productId}.html`;

		const html = generateProductHtml(data, lang, url, affUrl, slug);

		return new Response(html || "<!DOCTYPE html><html><body>Fallback content</body></html>", {
			headers: {
				"Content-Type": "text/html; charset=UTF-8",
				"Cache-Control": "public, s-maxage=300, must-revalidate",
			},
		});
	}
};

