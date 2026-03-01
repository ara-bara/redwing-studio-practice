export function calcPricing(price, discountPercentage = 0) {
  const oldPrice = Number(price);
  const discount = Number(discountPercentage || 0);
  const hasDiscount = Number.isFinite(discount) && discount > 0;

  const priceNow = hasDiscount ? oldPrice * (1 - discount / 100) : oldPrice;

  return { oldPrice, discount, hasDiscount, priceNow };
}
