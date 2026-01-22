export const groupBillsByDate = (bills: any[]) => {
  const map: Record<string, { sales: number; profit: number; count: number }> = {};

  for (const b of bills) {
    const date = new Date(b.createdAt).toISOString().slice(0, 10); // YYYY-MM-DD
    const saleAmount = b.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.sellingPrice,
      0
    );

    if (!map[date]) {
      map[date] = { sales: 0, profit: 0, count: 0 };
    }

    map[date].sales += saleAmount;
    map[date].profit += b.profit;
    map[date].count += 1;
  }

  return map;
};

export const groupBillsByMonth = (bills: any[]) => {
  const map: Record<string, { sales: number; profit: number; count: number }> = {};

  for (const b of bills) {
    const d = new Date(b.createdAt);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    const saleAmount = b.items.reduce(
      (sum: number, i: any) => sum + i.quantity * i.sellingPrice,
      0
    );

    if (!map[key]) {
      map[key] = { sales: 0, profit: 0, count: 0 };
    }

    map[key].sales += saleAmount;
    map[key].profit += b.profit;
    map[key].count += 1;
  }

  return map;
};
