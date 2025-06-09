# ♻️ AdaSampah ML API

**AdaSampah-ML-API** adalah backend API berbasis Hapi.js yang menggunakan model TensorFlow.js untuk memproses prediksi gambar. API ini memiliki dua fitur utama:

1. **Prediksi Kebersihan Gambar**  
   Menentukan apakah suatu gambar termasuk gambar lingkungan yang *bersih* atau *kotor*.

2. **Prediksi Jenis Sampah dan Rekomendasi**  
   Mengklasifikasi gambar sampah (plastik, organik, logam, dll) dan memberikan:
   - Rekomendasi cara daur ulang
   - Artikel edukatif terkait

---

## 🚀 Teknologi yang Digunakan

- **Node.js** & **Hapi.js** – Web framework backend
- **TensorFlow.js (tfjs-node)** – Untuk inference model Machine Learning

---

## ⚙️ Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/AdaSampah/AdaSampah-ML-API.git
cd AdaSampah-ML-API
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Jalankan Server

```bash
node server.js
```

Server akan berjalan di: `http://localhost:3000`

---

## 📡 Endpoint API

### 🔍 1. Prediksi Gambar Bersih / Kotor

**POST** `/predictModel1`

**Form-Data:**
- `image`: file gambar (jpg/png)

**Response:**
```json
{
  "success": true,
  "predictedLabel": "kotor",
  "scores": 0.99 
}
```

---

### 🔍 2. Prediksi Jenis Sampah + Rekomendasi

**POST** `/predictModel2`

**Form-Data:**
- `image`: file gambar (jpg/png)

**Response:**
```json
{
  "success": true,
  "predictedLabel": "organik",
  "scores": 0.88,
  "detail": {
      "handling": "Kumpulkan dalam komposter atau wadah tertutup. Hindari mencampur dengan sampah anorganik. Cocok untuk dijadikan kompos.",
      "reuse_recommendations": [
        "Dibuat kompos untuk pupuk organik",
        "Digunakan sebagai bahan biogas",
        "Dijadikan pakan maggot",
        "Digunakan untuk proyek kebun rumah",
        "Dijadikan cairan eco-enzyme",
        "Fermentasi untuk bioaktivator tanah"
      ],
      "articles": [
        {
        "title": "Membuat Kompos dari Sampah Organik",
        "link": "https://dlh.palangkaraya.go.id/membuat-kompos-dari-sampah-organik/",
        "image": "https://blogpictures.99.co/g-tips-and-ideas-how-to-make-compost-MAIN.jpg",
        "description": "Panduan lengkap tentang cara pembuatan kompos, serta identifikasi sampah yang bisa dan tidak bisa dijadikan kompos."
        }
        ]
      }
}
```

---

## 📦 Dependency Utama

- `@hapi/hapi`
- `@tensorflow/tfjs-node`

---
