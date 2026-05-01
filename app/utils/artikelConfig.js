export const CACHE_TTL_MS = 60 * 60 * 1000;

// Google News RSS — gratis, tanpa API key, RSS standar, multisumber
const GNEWS_BASE = "https://news.google.com/rss/search?hl=id&gl=ID&ceid=ID:id&q=";

const RSS_FEEDS_MAP = {
  ibu_hamil: [
    { url: GNEWS_BASE + encodeURIComponent("gizi ibu hamil kehamilan"),  sumber: "Google News" },
  ],
  balita: [
    { url: GNEWS_BASE + encodeURIComponent("gizi nutrisi balita anak"),  sumber: "Google News" },
  ],
  default: [
    { url: GNEWS_BASE + encodeURIComponent("gizi kesehatan ibu anak"),   sumber: "Google News" },
  ],
};

export function getFeedsForKategori(kategori) {
  return RSS_FEEDS_MAP[kategori] ?? RSS_FEEDS_MAP.default;
}

// Feed tips per kategori
const TIPS_FEEDS_MAP = {
  ibu_hamil: [
    { url: GNEWS_BASE + encodeURIComponent("tips kesehatan ibu hamil gizi kehamilan"), sumber: "Google News" },
  ],
  balita: [
    { url: GNEWS_BASE + encodeURIComponent("tips nutrisi anak balita mpasi sehat"), sumber: "Google News" },
  ],
  default: [
    { url: GNEWS_BASE + encodeURIComponent("tips gizi kesehatan ibu anak"), sumber: "Google News" },
  ],
};

export function getFeedsForTips(kategori) {
  return TIPS_FEEDS_MAP[kategori] ?? TIPS_FEEDS_MAP.default;
}

// ── Parser RSS XML sederhana (tanpa library tambahan) ──────────────────────

function extractCdata(xml, tag) {
  const cdata = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, "i"
  ).exec(xml);
  if (cdata) return cdata[1].trim();
  const plain = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i").exec(xml);
  return plain ? plain[1].trim() : "";
}

function extractLink(xml) {
  // <link> di RSS tidak pakai CDATA, tapi bisa ada whitespace / newline
  const m = /<link>(https?:\/\/[^<]+)<\/link>/.exec(xml);
  return m ? m[1].trim() : "";
}

export function parseRssXml(xml) {
  const items = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m;
  while ((m = re.exec(xml)) !== null) {
    const raw = m[1];
    items.push({
      title:       extractCdata(raw, "title"),
      link:        extractLink(raw),
      description: extractCdata(raw, "description"),
      pubDate:     extractCdata(raw, "pubDate"),
      guid:        extractCdata(raw, "guid") || extractLink(raw),
    });
  }
  return items;
}

export async function fetchRssItems(feedUrl) {
  const res = await fetch(feedUrl, {
    headers: { Accept: "application/rss+xml, application/xml, text/xml, */*" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const xml = await res.text();
  console.log("[RSS preview]", xml.substring(0, 120).replace(/\n/g, " "));
  const items = parseRssXml(xml);
  if (items.length === 0) throw new Error("0 item terparsing dari XML");
  return items;
}

// ── Keyword relevance ──────────────────────────────────────────────────────

export const FILTER_KEYWORDS = {
  ibu_hamil: ["hamil", "kehamilan", "prenatal", "persalinan", "maternal", "menyusui", "trimester"],
  balita:    ["balita", "bayi", "mpasi", "asi", "stunting", "tumbuh kembang", "anak"],
};

const BALITA_SUBS    = ["0-6_bulan", "7-11_bulan", "1-3_tahun", "4-6_tahun"];
const IBU_HAMIL_SUBS = ["trimester_1", "trimester_2", "trimester_3"];

export function resolveKategori(profil) {
  if (profil?.kategori) return profil.kategori;
  const sub = profil?.subKategori;
  if (IBU_HAMIL_SUBS.includes(sub)) return "ibu_hamil";
  if (BALITA_SUBS.includes(sub)) return "balita";
  return null;
}

export function hitungRelevani(item, kategori) {
  if (!kategori || !FILTER_KEYWORDS[kategori]) return 1;
  const teks = `${item.title ?? ""} ${item.description ?? ""}`.toLowerCase();
  return FILTER_KEYWORDS[kategori].filter((kw) => teks.includes(kw)).length;
}
