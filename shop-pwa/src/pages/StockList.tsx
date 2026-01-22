import { useEffect, useState } from "react";
import { getOfflineProducts } from "../offline/product.offline";
import { getOfflineStockByProduct } from "../offline/stock.offline";

type StockBatch = {
  quantity: number;
  purchasePrice: number;
  purchaseDate: string;
};

type StockItem = {
  product: {
    id: number;
    name: string;
  };
  totalQty: number;
  batches: StockBatch[];
};

export default function StockList() {
  const [data, setData] = useState<StockItem[]>([]);

  useEffect(() => {
    const load = async () => {
      const products = await getOfflineProducts();
      const result: StockItem[] = [];

      for (const p of products) {
        const stocks = await getOfflineStockByProduct(p.id);

        const totalQty = stocks.reduce(
          (sum: number, s: any) => sum + Number(s.quantity),
          0
        );

        if (totalQty > 0) {
          result.push({
            product: p,
            totalQty,
            batches: stocks.map((s: any) => ({
              quantity: Number(s.quantity),
              purchasePrice: Number(s.purchasePrice),
              purchaseDate: s.purchaseDate,
            })),
          });
        }
      }

      setData(result);
    };

    load();
  }, []);

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">
        Stock Summary
      </h1>

      {data.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-500 text-sm">
          No stock available
        </div>
      )}

      <div className="space-y-3">
        {data.map((item) => (
          <div
            key={item.product.id}
            className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-2"
          >
            {/* HEADER (UNCHANGED) */}
            <div className="flex justify-between items-center">
              <div className="font-medium text-slate-900">
                {item.product.name}
              </div>
              <div className="text-sm text-slate-700">
                Total:{" "}
                <span className="font-semibold">
                  {item.totalQty}
                </span>
              </div>
            </div>

            {/* BATCH DETAILS */}
            <div className="border-t border-slate-200 pt-2 space-y-1 text-sm">
              {item.batches.map((b, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center text-slate-600"
                >
                  {/* LEFT: DATE + QTY */}
                  <div>
                    <div className="text-xs text-slate-500">
                      {new Date(b.purchaseDate).toLocaleDateString()}
                    </div>
                  </div>

                  {/* RIGHT: PRICE */}
                  <div className="font-medium">
                      Qty: {b.quantity} ₹{b.purchasePrice}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
