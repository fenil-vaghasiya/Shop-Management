import { useEffect, useState } from "react";
import { getProducts, addProduct } from "../api/product.api";
import { getProductTypes } from "../api/productType.api";
import {
  getOfflineProducts,
  addOfflineProduct,
} from "../offline/product.offline";
import { getOfflineProductTypes } from "../offline/productType.offline";
import Select from "../components/ui/Select";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

type Product = {
  id: number;
  name: string;
  companyName: string;
  productTypeId: number;
};

type ProductType = {
  id: number;
  name: string;
};

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [types, setTypes] = useState<ProductType[]>([]);
  const [name, setName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [productTypeId, setProductTypeId] = useState("");

  const loadData = async () => {
    if (navigator.onLine) {
      try {
        const [p, t] = await Promise.all([
          getProducts(),
          getProductTypes(),
        ]);
        setProducts(p);
        setTypes(t);
        return;
      } catch {
        console.warn("Online fetch failed, using offline data");
      }
    }

    setProducts(await getOfflineProducts());
    setTypes(await getOfflineProductTypes());
  };

  const handleAdd = async () => {
    if (!name || !companyName || !productTypeId) {
      toast.error("All fields are required");
      return;
    }

    const payload = {
      name,
      companyName,
      productTypeId: Number(productTypeId),
    };

    if (navigator.onLine) {
      try {
        await addProduct(payload);
      } catch {
        await addOfflineProduct(payload);
      }
    } else {
      await addOfflineProduct(payload);
    }

    setName("");
    setCompanyName("");
    setProductTypeId("");
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  const getTypeName = (typeId: number) =>
    types.find(t => t.id === typeId)?.name || "Unknown";

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">
        Products
      </h1>

      {/* ADD PRODUCT */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-medium text-slate-700">
          Add New Product
        </h2>

        <input
          className="
            w-full p-3 rounded-lg
            border border-slate-300
            text-slate-900
            placeholder-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-600
          "
          placeholder="Product name (e.g. Zinc)"
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <input
          className="
            w-full p-3 rounded-lg
            border border-slate-300
            text-slate-900
            placeholder-slate-400
            focus:outline-none
            focus:ring-2 focus:ring-blue-600
          "
          placeholder="Company name (e.g. ABC Chemicals)"
          value={companyName}
          onChange={e => setCompanyName(e.target.value)}
        />

        <Select
          value={productTypeId}
          onChange={setProductTypeId}
          placeholder="Select product type"
          options={types.map(t => ({
            label: t.name,
            value: t.id,
          }))}
        />

        <Button
          onClick={handleAdd}
          className="
            w-full
            bg-blue-700 hover:bg-blue-800
            text-white
            py-3
            rounded-lg
            font-semibold
            transition
          "
        >
          Add Product
        </Button>
      </div>

      {/* PRODUCT LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-medium text-slate-700">
            Product List
          </h2>
        </div>

        {products.length === 0 && (
          <div className="p-4 text-sm text-slate-500">
            No products added yet
          </div>
        )}

        <ul className="divide-y divide-slate-200">
          {products.map(p => (
            <li
              key={p.id}
              className="p-4 flex justify-between items-center"
            >
              <div>
                <div className="font-medium text-slate-900">
                  {p.name}
                </div>
                <div className="text-sm text-slate-600">
                  {p.companyName} · {getTypeName(p.productTypeId)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
