# Redwing Studio Practice

A React e-commerce practice project built to improve frontend development skills and simulate a real online store experience.

The project focuses on working with API data, React hooks, routing, reusable UI components, cart logic, recently viewed products, and recommendation blocks similar to real e-commerce stores.

## Live Demo

https://ara-bara.github.io/redwing-studio-practice/

## Repository

https://github.com/ara-bara/redwing-studio-practice

---

# Features

- Product catalog loaded from API
- Product details page
- Shopping cart with:
  - add to cart
  - remove items
  - quantity controls
- Recently viewed products
- Recommended products
- Quick add-to-cart action on product cards
- Automatic discount calculation
- Product reviews section
- Responsive layout for desktop, tablet, and mobile
- Data persistence using localStorage

---

# Tech Stack

- React
- React Router
- JavaScript
- SCSS Modules
- Vite
- Context API
- localStorage
- DummyJSON API

---

# API

The project uses the public DummyJSON API:

https://dummyjson.com/products

The API provides product data such as:

- title
- description
- price
- discountPercentage
- images
- rating
- category
- stock
- reviews

---

# Project Structure

```
src
├── components
│   ├── Cart
│   │   ├── Cart.jsx
│   │   └── Cart.module.scss
│   │
│   └── Header
│       ├── Header.jsx
│       └── Header.module.scss
│
├── context
│   └── CartContext.jsx
│
├── pages
│   ├── Home
│   │   ├── Home.jsx
│   │   └── Home.module.scss
│   │
│   └── Product
│       ├── Product.jsx
│       ├── Product.module.scss
│       └── ProductSkeleton.jsx
│
├── utils
│   ├── cartPricing.js
│   ├── formatMoney.js
│   ├── pricing.js
│   ├── productApi.js
│   └── products.js
│
├── layouts
│
├── ScrollToTop.jsx
├── App.jsx
├── main.jsx
└── index.css
```

---

# Pages

## Home

Displays the product catalog loaded from the API.

Each product is rendered as a responsive product card.

## Product

Displays detailed product information including:

- product image
- title
- price
- discount
- category
- brand
- stock
- description
- reviews

Also includes:

- Recently viewed products
- Recommended products

## Cart

Displays products added to the cart and includes:

- quantity controls
- remove item
- subtotal calculation
- total order price

---

# Main Functionality

## Product Catalog

Products are fetched from the API and rendered as reusable product cards.

## Product Details

Each product has its own page using React Router dynamic routes.

## Cart Logic

Cart functionality is implemented with React Context and includes:

- adding products
- increasing quantity
- decreasing quantity
- removing items
- storing cart data in localStorage

## Recently Viewed

Viewed products are stored in localStorage and displayed on the product page.

## Recommended for You

The recommendation block is generated from the full product list by:

- excluding the current product
- filtering by the same category
- sorting by closest price
- displaying relevant items

## Automatic Discounts

The project calculates and displays:

- current price
- original price
- saved percentage

---

# Utility Functions

The `utils` folder contains reusable helper functions used across the project:

- **cartPricing.js** – cart calculations
- **formatMoney.js** – price formatting
- **pricing.js** – discount logic
- **productApi.js** – API requests
- **products.js** – product filtering and sorting

---

# Responsive Design

The project is fully responsive and adapted for:

- desktop
- tablet
- mobile devices

---

# Installation

Clone the repository:

```
git clone https://github.com/ara-bara/redwing-studio-practice.git
```

Move into the project folder:

```
cd redwing-studio-practice
```

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build production version:

```
npm run build
```

Preview production build:

```
npm run preview
```

---

# Learning Goals

This project was built as practice to improve skills in:

- React fundamentals
- component-based architecture
- React Router
- Context API
- working with external APIs
- conditional rendering
- derived state using useMemo
- responsive UI development
- e-commerce interface design

---

# Future Improvements

- search functionality
- advanced filtering
- sorting controls
- toast notifications for cart actions
- skeleton loaders for all product sections
- reusable product card component
- wishlist / favorites feature

---

# Author

Developed by **Dmytro Valetskyi**

GitHub  
https://github.com/ara-bara