import { useEffect, useState } from "react";
import { getProducts } from "../api/product.api";
import { addStock } from "../api/stock.api";
import { addOfflineStock } from "../offline/stock.offline";
import { getOfflineProducts } from "../offline/product.offline";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

type Product = {
  id: number;
  name: string;
};

export default function StockEntry() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [purchasePrice, setPurchasePrice] = useState("");
  const [purchaseDate, setPurchaseDate] = useState(
    new Date().toISOString().split("T")[0] // ✅ today
  );

  useEffect(() => {
    const loadProducts = async () => {
      if (navigator.onLine) {
        try {
          const data = await getProducts();
          setProducts(data);
          return;
        } catch {
          console.warn("Online products fetch failed, using offline");
        }
      }

      setProducts(await getOfflineProducts());
    };

    loadProducts();
  }, []);

  const handleAdd = async () => {
    if (!productId || !quantity || !purchasePrice) {
      toast.error("All fields required");
      return;
    }

    const payload = {
      productId: Number(productId),
      quantity: Number(quantity),
      purchasePrice: Number(purchasePrice),
      purchaseDate: new Date(purchaseDate).toISOString(), // ✅ normalized
    };

    if (navigator.onLine) {
      try {
        await addStock(payload);
      } catch {
        await addOfflineStock(payload);
      }
    } else {
      await addOfflineStock(payload);
    }

    setProductId("");
    setQuantity("");
    setPurchasePrice("");
    setPurchaseDate(new Date().toISOString().split("T")[0]);
    toast.success("Stock added successfully");
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-semibold text-slate-900">
        Stock Entry
      </h1>

      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-medium text-slate-700">
          Add New Stock
        </h2>

        <Select
          value={productId}
          onChange={setProductId}
          placeholder="Select product"
          options={products.map(p => ({
            label: p.name,
            value: p.id,
          }))}
        />

        <input
          type="number"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
        />

        <input
          type="number"
          placeholder="Purchase price"
          value={purchasePrice}
          onChange={e => setPurchasePrice(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
        />

        {/* ✅ PURCHASE DATE */}
        <input
          type="date"
          value={purchaseDate}
          onChange={e => setPurchaseDate(e.target.value)}
          className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-600"
        />

        <Button
          onClick={handleAdd}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold"
        >
          Add Stock
        </Button>
      </div>
    </div>
  );
}
