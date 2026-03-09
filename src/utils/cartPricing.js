import { calcPricing } from "./pricing";
export function calcItemPricing(item) {
  const { priceNow, oldPrice } = calcPricing(
    item.price,
    item.discountPercentage,
  );
  const qty = Number(item.qty);
  const itemOldTotal = oldPrice * qty;
  const itemTotal = priceNow * qty;
  return { itemOldTotal, itemTotal };
}

export function calcCartSummary(items) {
  let subtotal = 0;
  let totalWithDiscount = 0;
  let totalQty = 0;
  for (let item of items) {
    const { itemOldTotal, itemTotal } = calcItemPricing(item);
    subtotal += itemOldTotal;
    totalWithDiscount += itemTotal;
    totalQty += Number(item.qty);
  }
  const totalDiscount = subtotal - totalWithDiscount;
  return { totalDiscount, subtotal, totalWithDiscount, totalQty };
}
