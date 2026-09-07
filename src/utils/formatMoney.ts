export function formatMoney(n:number):string {
  const num = Number(n);
  if (!Number.isFinite(num)) return "";
  return `$${num.toFixed(2)}`;
}