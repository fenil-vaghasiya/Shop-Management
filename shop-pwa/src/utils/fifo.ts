export const consumeFIFO = (
  stocks: any[],
  requiredQty: number
) => {
  let remaining = requiredQty;
  const consumed: any[] = [];

  for (const s of stocks) {
    if (remaining <= 0) break;

    const used = Math.min(s.quantity, remaining);
    remaining -= used;

    consumed.push({
      stockId: s.id,
      usedQty: used,
      purchasePrice: s.purchasePrice
    });
  }

  if (remaining > 0) {
    throw new Error('Insufficient stock');
  }

  return consumed;
};
