export function formatMoney(n) {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return `$${num.toFixed(2)}`;
}