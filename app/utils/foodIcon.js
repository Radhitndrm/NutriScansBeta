// Icon & warna per jenis makanan — disesuaikan dengan palette earthy app
// (smoke #4a4f42, skyWarm #ccc9be, card #d4d2c9)
export function getFoodIcon(nama) {
  const n = (nama ?? "").toLowerCase();

  // ── Makanan pokok ──
  if (n.includes("nasi") || n.includes("rice") || n.includes("bubur"))
    return { icon: "restaurant-outline", bg: "#d4ccb8", color: "#5c4e38" };

  if (n.includes("mie") || n.includes("noodle"))
    return { icon: "layers-outline", bg: "#d4ccb4", color: "#524630" };

  if (n.includes("roti") || n.includes("bread") || n.includes("toast") || n.includes("oatmeal"))
    return { icon: "layers-outline", bg: "#d8d0bc", color: "#5a4c38" };

  if (n.includes("sandwich"))
    return { icon: "layers-outline", bg: "#d8d0bc", color: "#5a4c38" };

  if (n.includes("pizza"))
    return { icon: "pizza-outline", bg: "#d4c4b4", color: "#5a4030" };

  if (n.includes("burger"))
    return { icon: "fast-food-outline", bg: "#d0c8b4", color: "#5a4530" };

  // ── Protein hewani ──
  if (n.includes("telur") || n.includes("egg"))
    return { icon: "egg-outline", bg: "#dcd8c4", color: "#5c5030" };

  if (n.includes("ayam") || n.includes("chicken") || n.includes("sate"))
    return { icon: "flame-outline", bg: "#d4c0b0", color: "#5c3c28" };

  if (n.includes("nugget"))
    return { icon: "fast-food-outline", bg: "#d0c8b0", color: "#5a4828" };

  if (n.includes("daging") || n.includes("beef") || n.includes("sapi"))
    return { icon: "flame-outline", bg: "#ccc0b4", color: "#503830" };

  if (n.includes("ikan") || n.includes("fish") || n.includes("salmon") || n.includes("kembung"))
    return { icon: "fish-outline", bg: "#becccc", color: "#385050" };

  if (n.includes("hati") || n.includes("liver"))
    return { icon: "flame-outline", bg: "#ccc0b8", color: "#503838" };

  // ── Protein nabati ──
  if (n.includes("tahu") || n.includes("tofu"))
    return { icon: "cube-outline", bg: "#d0cecc", color: "#4a4840" };

  if (n.includes("tempe") || n.includes("tempeh"))
    return { icon: "grid-outline", bg: "#ccbfb0", color: "#4e4030" };

  if (n.includes("kacang") || n.includes("bean") || n.includes("nut"))
    return { icon: "disc-outline", bg: "#c8c4b0", color: "#4a4430" };

  // ── Buah-buahan ──
  if (n.includes("apel") || n.includes("apple"))
    return { icon: "nutrition-outline", bg: "#c8d4c0", color: "#3c5438" };

  if (n.includes("jeruk") || n.includes("orange"))
    return { icon: "flower-outline", bg: "#d4ccb8", color: "#5a4c28" };

  if (n.includes("pisang") || n.includes("banana"))
    return { icon: "moon-outline", bg: "#d8d0b8", color: "#5a4c28" };

  if (n.includes("lemon"))
    return { icon: "sparkles-outline", bg: "#d8d4b8", color: "#585028" };

  if (n.includes("kiwi"))
    return { icon: "disc-outline", bg: "#c4ccc0", color: "#3c5040" };

  if (n.includes("mangga") || n.includes("mango"))
    return { icon: "nutrition-outline", bg: "#d4ccb4", color: "#5a4a28" };

  if (n.includes("semangka") || n.includes("watermelon"))
    return { icon: "water-outline", bg: "#c4cccc", color: "#384c4c" };

  if (n.includes("pepaya") || n.includes("papaya"))
    return { icon: "nutrition-outline", bg: "#d0c8b8", color: "#564838" };

  if (n.includes("alpukat") || n.includes("avocado"))
    return { icon: "leaf-outline", bg: "#c4ccbc", color: "#3c5038" };

  // ── Sayuran ──
  if (n.includes("brokoli") || n.includes("broccoli"))
    return { icon: "leaf-outline", bg: "#c4d0bc", color: "#3c5038" };

  if (n.includes("wortel") || n.includes("carrot"))
    return { icon: "triangle-outline", bg: "#d4c8b4", color: "#5a4830" };

  if (n.includes("tomat") || n.includes("tomato"))
    return { icon: "rose-outline", bg: "#d4c4c4", color: "#584040" };

  if (n.includes("timun") || n.includes("cucumber"))
    return { icon: "water-outline", bg: "#becccc", color: "#385050" };

  if (n.includes("bawang") || n.includes("onion"))
    return { icon: "aperture-outline", bg: "#ccc8d4", color: "#484458" };

  if (n.includes("sawi") || n.includes("cabbage") || n.includes("bayam") || n.includes("spinach"))
    return { icon: "leaf-outline", bg: "#c4ccbc", color: "#3c5038" };

  if (n.includes("labu") || n.includes("pumpkin"))
    return { icon: "triangle-outline", bg: "#d0c8b0", color: "#524828" };

  // ── Makanan berkuah & lainnya ──
  if (n.includes("bakso") || n.includes("meatball"))
    return { icon: "ellipse-outline", bg: "#cccccc", color: "#484848" };

  if (n.includes("sup") || n.includes("soup") || n.includes("kuah"))
    return { icon: "cafe-outline", bg: "#ccc8c0", color: "#484440" };

  if (n.includes("gado"))
    return { icon: "leaf-outline", bg: "#c8ccbc", color: "#3e5038" };

  if (n.includes("yogurt") || n.includes("susu") || n.includes("milk"))
    return { icon: "disc-outline", bg: "#d0cecc", color: "#4a4848" };

  return { icon: "fast-food-outline", bg: "#ccc9be", color: "#4a4f42" };
}
