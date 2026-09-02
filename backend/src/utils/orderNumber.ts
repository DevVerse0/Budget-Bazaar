export function generateOrderNumber(): string {
  const y = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random()*9000);
  return `BB-${y}-${rand}`;
}
