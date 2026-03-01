export function getCategories(products) {
  return [
    "all",
    ...Array.from(
      new Set(products.map((p) => p.category).filter(Boolean)),
    ).sort((a, b) => a.localeCompare(b)),
  ];
}

export function filterProducts(products, { q, category }) {
  const query = (q || "").trim().toLowerCase();
  let list = products;

  if (category && category !== "all") {
    list = list.filter((p) => p.category === category);
  }

  if (query) {
    list = list.filter((p) => {
      const title = (p.title || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      return title.includes(query) || brand.includes(query);
    });
  }

  return list;
}

export function sortProducts(list, sort) {
  const copy = [...list];

  switch (sort) {
    case "new":
      copy.sort((a, b) => Number(b.id) - Number(a.id));
      break;
    case "rating":
      copy.sort((a, b) => Number(b.rating) - Number(a.rating));
      break;
    case "price_asc":
      copy.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price_desc":
      copy.sort((a, b) => Number(b.price) - Number(a.price));
      break;
  }

  return copy;
}
