import { useEffect, useState } from "react";
import { getProductTypes, addProductType } from "../api/productType.api";
import {
  getOfflineProductTypes,
  addOfflineProductType
} from "../offline/productType.offline";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";

type ProductType = {
  id: number;
  name: string;
};

export default function ProductTypes() {
  const [types, setTypes] = useState<ProductType[]>([]);
  const [name, setName] = useState("");

  const loadTypes = async () => {
    if (navigator.onLine) {
      try {
        const data = await getProductTypes();
        setTypes(data);
        return;
      } catch {
        // fallback to offline
      }
    }

    setTypes(await getOfflineProductTypes());
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      return toast.error("Type name required");
    }

    const payload = { name };

    if (navigator.onLine) {
      try {
        await addProductType(payload);
      } catch {
        await addOfflineProductType(payload);
      }
    } else {
      await addOfflineProductType(payload);
    }

    setName("");
    loadTypes();
  };

  useEffect(() => {
    loadTypes();
  }, []);

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">
        Product Types
      </h1>

      {/* ADD TYPE */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        <h2 className="text-sm font-medium text-slate-700">
          Add New Product Type
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
          placeholder="Type name (e.g. Zinc)"
          value={name}
          onChange={e => setName(e.target.value)}
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
          Add Product Type
        </Button>
      </div>

      {/* TYPE LIST */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm">
        <div className="p-4 border-b border-slate-200">
          <h2 className="text-sm font-medium text-slate-700">
            Type List
          </h2>
        </div>

        {types.length === 0 && (
          <div className="p-4 text-sm text-slate-500">
            No product types added yet
          </div>
        )}

        <ul className="divide-y divide-slate-200">
          {types
            .sort((a, b) => (a.id! > b.id! ? -1 : 1))
            .map(t => (
            <li
              key={t.id}
              className="p-4 text-slate-900 font-medium"
            >
              {t.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
