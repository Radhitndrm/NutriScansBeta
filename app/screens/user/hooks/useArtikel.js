import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../../context/AuthContext";
import {
  getFeedsForKategori, fetchRssItems,
  CACHE_TTL_MS, resolveKategori, hitungRelevani,
} from "../../../utils/artikelConfig";
import { ARTIKEL } from "../../../data/artikelData";

function stripHtml(html = "") {
  return html
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatTanggal(pubDate) {
  if (!pubDate) return "";
  try { return new Date(pubDate).toISOString().substring(0, 10); } catch { return ""; }
}

function mapItem(item, sumber) {
  return {
    id: item.guid || item.link,
    judul: item.title ?? "",
    ringkasan: stripHtml(item.description ?? "").substring(0, 200),
    konten: stripHtml(item.description ?? ""),
    sumber,
    tanggal: formatTanggal(item.pubDate),
    url: item.link ?? "",
    isExternal: true,
  };
}

function cacheKey(kategori) {
  return `@nutriscan_artikel_${kategori ?? "all"}`;
}

const log = (msg, extra) => {
  const ts = new Date().toISOString().slice(11, 23);
  if (extra !== undefined) console.log(`[Artikel ${ts}] ${msg}`, extra);
  else console.log(`[Artikel ${ts}] ${msg}`);
};

export default function useArtikel() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) { log("Tidak ada user, skip load profil"); return; }
    log(`Mulai baca profil AsyncStorage uid=${user.uid}`);
    const t0 = Date.now();
    AsyncStorage.getItem(`@nutriscan_profil_${user.uid}`).then((raw) => {
      const parsed = raw ? JSON.parse(raw) : null;
      log(`Profil selesai dibaca (${Date.now() - t0}ms)`, parsed);
      if (parsed) setProfil(parsed);
    });
  }, [user]);

  const fetchArtikel = useCallback(
    async (force = false) => {
      const kategori = resolveKategori(profil);

      log(`fetchArtikel dipanggil — force=${force} kategori=${kategori}`);
      setLoading(true);
      setError(null);

      try {
        const key = cacheKey(kategori);

        if (!force) {
          log("Cek cache AsyncStorage...");
          const t1 = Date.now();
          const cached = await AsyncStorage.getItem(key);
          log(`Cache selesai dibaca (${Date.now() - t1}ms) — ada=${!!cached}`);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            const ageMs = Date.now() - timestamp;
            log(`Cache usia ${Math.round(ageMs / 1000)}s — valid=${ageMs < CACHE_TTL_MS}`);
            if (ageMs < CACHE_TTL_MS) {
              log(`Pakai cache (${data.length} artikel)`);
              setArticles(data);
              setLoading(false);
              return;
            }
            log("Cache kadaluarsa, lanjut fetch");
          }
        }

        // Coba tiap feed berurutan sampai ada yang berhasil
        const feeds = getFeedsForKategori(kategori);
        let rawItems = null;
        let sumberBerhasil = "";
        for (const feed of feeds) {
          try {
            log(`Mencoba fetch langsung RSS: ${feed.url}`);
            const t2 = Date.now();
            rawItems = await fetchRssItems(feed.url);
            log(`Berhasil (${Date.now() - t2}ms) — ${rawItems.length} item dari ${feed.sumber}`);
            sumberBerhasil = feed.sumber;
            break;
          } catch (err) {
            log(`Gagal fetch ${feed.url} — ${err.message}, coba feed berikutnya`);
          }
        }

        if (rawItems && rawItems.length > 0) {
          const sorted = [...rawItems].sort(
            (a, b) => hitungRelevani(b, kategori) - hitungRelevani(a, kategori)
          );
          const data = sorted.map((item) => mapItem(item, sumberBerhasil));
          log(`Mapping ${data.length} artikel (kategori=${kategori}), simpan ke cache`);
          setArticles(data);
          await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          log("Semua feed gagal, pakai data statis");
          const fallback = kategori
            ? ARTIKEL.filter((a) => a.kategori.includes(kategori))
            : ARTIKEL;
          setArticles(fallback);
          setError("Gagal memuat artikel terbaru. Menampilkan artikel offline.");
        }
      } catch (err) {
        log("ERROR tidak terduga", err?.message ?? err);
        const kat = resolveKategori(profil);
        setArticles(kat ? ARTIKEL.filter((a) => a.kategori.includes(kat)) : ARTIKEL);
        setError("Gagal memuat artikel terbaru. Menampilkan artikel offline.");
      } finally {
        log("fetchArtikel selesai, loading=false");
        setLoading(false);
      }
    },
    [profil]
  );

  useEffect(() => {
    if (profil !== null) fetchArtikel();
  }, [profil, fetchArtikel]);

  return { articles, loading, error, refresh: () => fetchArtikel(true) };
}
