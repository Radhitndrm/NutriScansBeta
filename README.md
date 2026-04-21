# NutriScan 🥗

Aplikasi **nutrition scanner** untuk masyarakat Indonesia berbasis React Native + Expo. Dirancang khusus untuk dua kategori pengguna: **ibu hamil** dan **orang tua dengan balita**, dengan standar gizi mengacu pada AKG Kemenkes 2019.

---

## Daftar Isi

- [Tentang Aplikasi](#tentang-aplikasi)
- [Tech Stack](#tech-stack)
- [Kategori Pengguna](#kategori-pengguna)
- [Fitur](#fitur)
- [Halaman & Navigasi](#halaman--navigasi)
- [Roadmap Pengembangan](#roadmap-pengembangan)
- [Struktur Folder](#struktur-folder)
- [Setup & Instalasi](#setup--instalasi)
- [Environment Variables](#environment-variables)
- [Kontribusi](#kontribusi)

---

## Tentang Aplikasi

NutriScan membantu ibu hamil dan orang tua balita memantau kecukupan gizi harian melalui:

- Deteksi makanan otomatis menggunakan foto (Roboflow AI)
- Pencocokan data gizi dari database TKPI lokal
- Pemantauan progress harian terhadap target AKG personal
- Rekomendasi makanan jika gizi harian kurang dari target
- Laporan mingguan berbasis grafik

---

## Tech Stack

| Komponen | Teknologi |
|---|---|
| Framework | React Native + Expo (Expo Go) |
| AI Deteksi Makanan | Roboflow API |
| Database Gizi | TKPI (Tabel Komposisi Pangan Indonesia) — lokal JSON |
| Autentikasi | Firebase Authentication (email + password) |
| Penyimpanan Lokal | AsyncStorage |
| Notifikasi | Expo Notifications |
| Grafik | react-native-chart-kit |
| Navigasi | React Navigation v6 (Stack + Bottom Tabs) |

---

## Kategori Pengguna

### Ibu Hamil
Target AKG disesuaikan per trimester (Trimester 1, 2, 3) berdasarkan standar Kemenkes 2019. Nutrien prioritas: folat, zat besi, kalsium, vitamin D, protein.

### Balita (dikelola orang tua)
Target AKG disesuaikan berdasarkan usia anak (0–5 tahun). Nutrien prioritas: protein, kalsium, vitamin A, zat besi, energi total.

---

## Fitur

### ✅ Sudah Ada
- Login & Register dengan Firebase Authentication
- Scan makanan via kamera / galeri → Roboflow → hasil gizi
- History Screen (placeholder)
- Profile Screen + logout (placeholder)

### 🔄 Dalam Pengembangan

#### Fase 1 — Core & Profil
- [ ] **Pilih kategori user** saat registrasi (ibu hamil / balita, usia, trimester)
- [ ] **Data AKG Kemenkes 2019** per kategori dalam format JSON lokal
- [ ] **ProfileScreen** — tampilkan target AKG + ring progress harian
- [ ] **HistoryScreen** — log makanan harian + progress bar per nutrien

#### Fase 2 — Analisis & Rekomendasi
- [ ] **Rekomendasi makanan** jika gizi harian di bawah target AKG
- [ ] **Laporan mingguan** — grafik bar 7 hari per nutrien
- [ ] **Info Gizi Makanan** — detail nutrien + manfaat dari TKPI
- [ ] **Porsi Manual** — edit estimasi porsi setelah scan, kalkulasi ulang otomatis

#### Fase 3 — Konten & Notifikasi
- [ ] **Tips Gizi Harian** — konten per kategori (ibu hamil / balita)
- [ ] **Artikel Kesehatan** — konten dari Kemenkes, bisa search & filter
- [ ] **Tambah Manual** — input makanan tanpa foto, search dari TKPI
- [ ] **Alert Gizi Kurang** — push notifikasi pukul 15.00 jika gizi < 50% AKG

---

## Halaman & Navigasi

### Auth
| Halaman | Tujuan | Fitur Utama |
|---|---|---|
| `LoginScreen` | Masuk akun | Email + password, Firebase Auth |
| `RegisterScreen` | Buat akun baru | Pilih kategori, usia, trimester / usia anak |

### Scan
| Halaman | Tujuan | Fitur Utama |
|---|---|---|
| `ScanScreen` | Deteksi makanan | Kamera / galeri → Roboflow |
| `ScanResultScreen` | Tampil hasil gizi | Tabel gizi TKPI, % AKG, simpan ke histori |
| `PorsiManualScreen` | Koreksi porsi | Slider gram, kalkulasi ulang gizi |
| `TambahManualScreen` | Input tanpa foto | Search TKPI, pilih porsi, simpan |

### Histori & Laporan
| Halaman | Tujuan | Fitur Utama |
|---|---|---|
| `HistoryScreen` | Log makanan harian | List per tanggal, total gizi, progress bar AKG |
| `HistoryDetailScreen` | Detail satu hari | List makanan + waktu makan, breakdown nutrien |
| `LaporanMingguanScreen` | Tren gizi mingguan | Grafik bar 7 hari, rata-rata vs target AKG |

### Profil
| Halaman | Tujuan | Fitur Utama |
|---|---|---|
| `ProfileScreen` | Dashboard AKG + progress | Ring chart harian, target per nutrien |
| `EditProfilScreen` | Edit data diri | Ubah kategori, usia, trimester / usia anak |

### Informasi & Tips
| Halaman | Tujuan | Fitur Utama |
|---|---|---|
| `InfoGiziScreen` | Detail gizi makanan | Profil nutrien, manfaat, saran porsi per kategori |
| `RekomendasiScreen` | Saran saat gizi kurang | Gap AKG, list makanan pengganti |
| `TipsListScreen` | Tips gizi harian | Filter per kategori user |
| `TipsDetailScreen` | Baca tips lengkap | Konten, ilustrasi, referensi |
| `ArtikelListScreen` | Artikel kesehatan | Konten Kemenkes, search, filter |
| `ArtikelDetailScreen` | Baca artikel penuh | Konten panjang, share, bookmark |

### Sistem
| Komponen | Tujuan | Detail |
|---|---|---|
| `AlertGiziSystem` | Notifikasi gizi kurang | Cek pukul 15.00, push notif jika < 50% AKG, deep link ke Rekomendasi |

---

## Roadmap Pengembangan

```
Fase 1 (Minggu 1–4)     Fase 2 (Minggu 5–8)     Fase 3 (Minggu 9–12)
─────────────────────   ─────────────────────   ──────────────────────
RegisterScreen update   Rekomendasi makanan     Tips Gizi Harian
Data AKG Kemenkes       Laporan Mingguan        Artikel Kesehatan
ProfileScreen AKG       Info Gizi detail        Tambah Manual
HistoryScreen log       Porsi Manual            Alert Gizi Kurang
```

### Fase 1 — Core & Profil *(estimasi: 3–4 minggu)*
Fokus pada fondasi: registrasi dengan kategori, data AKG lokal, profil target, dan log histori harian. Setelah fase ini, pengguna bisa melakukan scan dan memantau progress gizi harian.

### Fase 2 — Analisis & Rekomendasi *(estimasi: 3–4 minggu)*
Fokus pada analisis gizi: rekomendasi makanan saat gizi kurang, laporan tren mingguan, detail info gizi, dan koreksi porsi manual.

### Fase 3 — Konten & Notifikasi *(estimasi: 3–4 minggu)*
Fokus pada kelengkapan konten dan pengalaman proaktif: tips & artikel edukasi, input manual, dan alert otomatis berbasis data gizi harian.

---

## Struktur Folder

```
nutriscan/
├── App.js                        # Entry point + providers
├── app.json                      # Expo config
├── .env                          # API keys (jangan di-commit!)
├── babel.config.js
├── package.json
│
└── src/
    ├── navigation/
    │   ├── AppNavigator.jsx       # Root: auth vs main
    │   ├── AuthNavigator.jsx      # Stack: login, register
    │   ├── MainTabNavigator.jsx   # Bottom tabs
    │   └── ScanStackNavigator.jsx # Stack di dalam tab scan
    │
    ├── screens/
    │   ├── auth/
    │   │   ├── LoginScreen.jsx
    │   │   └── RegisterScreen.jsx
    │   ├── scan/
    │   │   ├── ScanScreen.jsx
    │   │   ├── ScanResultScreen.jsx
    │   │   ├── PorsiManualScreen.jsx
    │   │   └── TambahManualScreen.jsx
    │   ├── history/
    │   │   ├── HistoryScreen.jsx
    │   │   ├── HistoryDetailScreen.jsx
    │   │   └── LaporanMingguanScreen.jsx
    │   ├── profile/
    │   │   ├── ProfileScreen.jsx
    │   │   └── EditProfilScreen.jsx
    │   └── info/
    │       ├── InfoGiziScreen.jsx
    │       ├── RekomendasiScreen.jsx
    │       ├── TipsListScreen.jsx
    │       ├── TipsDetailScreen.jsx
    │       ├── ArtikelListScreen.jsx
    │       └── ArtikelDetailScreen.jsx
    │
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── Card.jsx
    │   │   ├── LoadingOverlay.jsx
    │   │   └── NutriProgressBar.jsx
    │   ├── scan/
    │   │   ├── FoodCard.jsx
    │   │   └── NutriTable.jsx
    │   ├── history/
    │   │   ├── DayRow.jsx
    │   │   └── WeeklyChart.jsx
    │   └── profile/
    │       ├── AkgRingChart.jsx
    │       └── CategoryBadge.jsx
    │
    ├── hooks/
    │   ├── useAuth.js             # Firebase auth state
    │   ├── useHistory.js          # Baca/tulis AsyncStorage
    │   ├── useAkg.js              # Hitung target AKG
    │   ├── useRoboflow.js         # Panggil Roboflow API
    │   └── useNotification.js     # Expo Notifications
    │
    ├── services/
    │   ├── firebaseConfig.js      # Init Firebase
    │   ├── authService.js         # Login, register, logout
    │   ├── roboflowService.js     # Upload foto → deteksi
    │   ├── storageService.js      # CRUD AsyncStorage
    │   └── notificationService.js # Schedule alert gizi
    │
    ├── data/
    │   ├── tkpi.json              # Database TKPI lokal
    │   ├── akg.json               # AKG Kemenkes 2019
    │   ├── tips.json              # Tips per kategori
    │   └── artikel.json           # Konten Kemenkes
    │
    ├── utils/
    │   ├── akgCalculator.js       # Hitung % AKG harian
    │   ├── nutritionMapper.js     # Roboflow → TKPI lookup
    │   ├── dateHelper.js          # Format tanggal
    │   └── constants.js           # Warna, key storage, dll
    │
    └── context/
        ├── AuthContext.js
        └── UserProfileContext.js  # Kategori + target AKG
```

---

## Setup & Instalasi

### Prasyarat
- Node.js >= 18
- Expo CLI: `npm install -g expo-cli`
- Akun Firebase (untuk Auth)
- API Key Roboflow (untuk deteksi makanan)

### Langkah Instalasi

```bash
# Clone repositori
git clone https://github.com/username/nutriscan.git
cd nutriscan

# Install dependencies
npm install

# Salin file environment
cp .env.example .env
# Isi variabel di .env (lihat bagian Environment Variables)

# Jalankan di Expo Go
npx expo start
```

Scan QR code di Expo Go (Android/iOS) untuk menjalankan aplikasi.

---

## Environment Variables

Buat file `.env` di root proyek:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_ROBOFLOW_API_KEY=your_roboflow_api_key
EXPO_PUBLIC_ROBOFLOW_MODEL_URL=https://detect.roboflow.com/your-model/version
```

> ⚠️ Jangan pernah commit file `.env` ke repositori. Pastikan `.env` sudah masuk ke `.gitignore`.

---

## Kontribusi

1. Fork repositori ini
2. Buat branch fitur: `git checkout -b fitur/nama-fitur`
3. Commit perubahan: `git commit -m "feat: deskripsi singkat"`
4. Push ke branch: `git push origin fitur/nama-fitur`
5. Buat Pull Request ke branch `develop`

### Konvensi Commit

| Prefix | Kegunaan |
|---|---|
| `feat:` | Fitur baru |
| `fix:` | Perbaikan bug |
| `docs:` | Perubahan dokumentasi |
| `refactor:` | Refactor kode tanpa perubahan fungsional |
| `style:` | Perubahan UI/styling |
| `chore:` | Konfigurasi, dependency, dll |

---

## Referensi

- [Tabel Komposisi Pangan Indonesia (TKPI)](http://www.panganku.org)
- [Angka Kecukupan Gizi 2019 — Kemenkes RI](https://www.kemkes.go.id)
- [Roboflow Documentation](https://docs.roboflow.com)
- [Expo Documentation](https://docs.expo.dev)
- [Firebase Auth — React Native](https://rnfirebase.io/auth/usage)

---

*NutriScan — Gizi Terpantau, Generasi Sehat* 🇮🇩
