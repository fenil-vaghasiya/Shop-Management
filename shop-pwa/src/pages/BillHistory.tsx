import { useEffect, useState } from "react";
import { getOfflineBills } from "../offline/bill.read";
import { getOfflineCustomers } from "../offline/customer.offline";
import { Link } from "react-router-dom";

export default function BillHistory() {
  const [bills, setBills] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setBills(await getOfflineBills());
      setCustomers(await getOfflineCustomers());
    };
    load();
  }, []);

  const getCustomerName = (id: number) =>
    customers.find(c => c.id === id)?.name || "Unknown";

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      {/* PAGE TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">
        Bill History
      </h1>

      {bills.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-500 text-sm">
          No bills found
        </div>
      )}

      <div className="space-y-3">
        {bills
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .map(b => {
          const isLoss = b.profit < 0;

          return (
            <Link
              key={b.id}
              to={`/bill/${b.id}`}
              className="
                block
                bg-white
                border border-slate-200
                rounded-xl
                p-4
                shadow-sm
                hover:border-blue-400
                transition
              "
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium text-slate-900">
                    {getCustomerName(b.customerId)}
                  </div>
                  <div className="text-sm text-slate-600">
                    {new Date(b.createdAt).toLocaleString()}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">
                    Profit
                  </div>
                  <div
                    className={`font-semibold ${
                      isLoss ? "text-red-600" : "text-emerald-700"
                    }`}
                  >
                    ₹{b.profit}
                  </div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
