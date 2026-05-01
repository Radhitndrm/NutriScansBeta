import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../utils/firebaseConfig";
import { useAuth } from "../../../context/AuthContext";
import {
  getFeedsForTips, fetchRssItems,
  CACHE_TTL_MS, resolveKategori,
} from "../../../utils/artikelConfig";
import { TIPS } from "../../../data/tipsData";

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
  return `@nutriscan_tips_${kategori ?? "all"}`;
}

export default function useTips() {
  const { user } = useAuth();
  const [profil, setProfil] = useState(null);
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, "users", user.uid), (snap) => {
      if (!snap.exists()) return;
      const parsed = snap.data();
      if (!parsed.kategori) parsed.kategori = resolveKategori(parsed);
      setProfil(parsed);
    });
    return unsub;
  }, [user]);

  const fetchTips = useCallback(
    async (force = false) => {
      const kategori = resolveKategori(profil);

      setLoading(true);
      setError(null);

      try {
        const key = cacheKey(kategori);

        if (!force) {
          const cached = await AsyncStorage.getItem(key);
          if (cached) {
            const { data, timestamp } = JSON.parse(cached);
            if (Date.now() - timestamp < CACHE_TTL_MS) {
              setTips(data);
              setLoading(false);
              return;
            }
          }
        }

        const feeds = getFeedsForTips(kategori);
        let rawItems = null;
        let sumberBerhasil = "";
        for (const feed of feeds) {
          try {
            rawItems = await fetchRssItems(feed.url);
            sumberBerhasil = feed.sumber;
            break;
          } catch {
            // coba feed berikutnya
          }
        }

        if (rawItems && rawItems.length > 0) {
          const sorted = [...rawItems].sort((a, b) => {
            const tA = a.pubDate ? new Date(a.pubDate).getTime() : 0;
            const tB = b.pubDate ? new Date(b.pubDate).getTime() : 0;
            return tB - tA;
          });
          const data = sorted.map((item) => mapItem(item, sumberBerhasil));
          setTips(data);
          await AsyncStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
        } else {
          const fallback = kategori
            ? TIPS.filter((t) => t.kategori.includes(kategori))
            : TIPS;
          setTips(fallback);
          setError("Gagal memuat tips terbaru. Menampilkan tips offline.");
        }
      } catch {
        const kat = resolveKategori(profil);
        setTips(kat ? TIPS.filter((t) => t.kategori.includes(kat)) : TIPS);
        setError("Gagal memuat tips terbaru. Menampilkan tips offline.");
      } finally {
        setLoading(false);
      }
    },
    [profil]
  );

  useEffect(() => {
    if (profil !== null) fetchTips();
  }, [profil, fetchTips]);

  return { tips, loading, error, refresh: () => fetchTips(true) };
}
