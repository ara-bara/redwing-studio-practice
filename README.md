# Redwing Studio — Practice (React + Vite)

Міні **інтернет-магазин (practice project)** на **React + Vite** з роутингом, сторінкою списку товарів і сторінкою товару. Дані підтягуються з **DummyJSON API**. :contentReference[oaicite:0]{index=0}

## 🔗 Demo
GitHub Pages: **https://ara-bara.github.io/redwing-studio-practice/** :contentReference[oaicite:1]{index=1}

---

## ✨ Функціонал

### 🏠 Products (Home)
- Завантаження товарів з API (ліміт) :contentReference[oaicite:2]{index=2}  
- Пошук по **назві** або **бренду** :contentReference[oaicite:3]{index=3}  
- Фільтр по **категорії** (генерується зі списку товарів) :contentReference[oaicite:4]{index=4}  
- Сортування:
  - Featured (як є)
  - New (по id ↓)
  - Top rated
  - Price: low → high / high → low :contentReference[oaicite:5]{index=5}  
- Відображення знижки (badge `-%`) і “LOW” при малому залишку :contentReference[oaicite:6]{index=6}  
- Перехід на сторінку товару (`/product/:id`) :contentReference[oaicite:7]{index=7}  

### 📦 Product page
- Отримання товару по `id` з API :contentReference[oaicite:8]{index=8}  
- Показ ціни зі знижкою + стара ціна :contentReference[oaicite:9]{index=9}  
- Опис, категорія, бренд, рейтинг, stock :contentReference[oaicite:10]{index=10}  
- Додаткові “Details” (теги/параметри, якщо є) та прев’ю відгуків :contentReference[oaicite:11]{index=11}  

### 🛒 Cart
- Поки що **заглушка сторінки** (в процесі) :contentReference[oaicite:12]{index=12}  

---

## 🧰 Стек
- **React 19**, **Vite**
- **React Router DOM**
- **SCSS / Sass**
- **react-loading-skeleton** :contentReference[oaicite:13]{index=13}

---

## 📁 Структура (коротко)
- `src/pages/Home` — список товарів + фільтри/пошук/сортування :contentReference[oaicite:14]{index=14}  
- `src/pages/Product` — сторінка товару + skeleton :contentReference[oaicite:15]{index=15}  
- `src/services/productApi.js` — запити до API :contentReference[oaicite:16]{index=16}  

---

## ▶️ Запуск локально

```bash
npm i
npm run dev