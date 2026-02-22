export async function getProducts(limit = 12) {
  const response = await fetch(`https://dummyjson.com/products?limit=${limit}`);
  if (!response.ok) {
    throw new Error("Ops! Something went wrong.");
  }
  const data = await response.json();
  return data.products;
}
export async function getProductsById(id) {
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  if (!response.ok) {
    throw new Error("Ops! Something went wrong.");
  }
  const data = await response.json();
  return data;
}
