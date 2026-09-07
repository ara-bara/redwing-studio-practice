type PricingResult = {
  oldPrice: number;
  discount: number;
  hasDiscount: boolean;
  priceNow: number;
};

export function calcPricing(
  price: number,
  discountPercentage: number = 0,
): PricingResult {
  const oldPrice = Number(price);
  const discount = Number(discountPercentage || 0);
  const hasDiscount = Number.isFinite(discount) && discount > 0;

  const priceNow = hasDiscount ? oldPrice * (1 - discount / 100) : oldPrice;

  return { oldPrice, discount, hasDiscount, priceNow };
}
