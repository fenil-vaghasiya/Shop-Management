import { useEffect, useState } from "react";
import { getOfflineBills } from "../offline/bill.read";

type ReportItem = {
  count: number;
  sales: number;
  profit: number;
};

export default function Reports() {
  const [daily, setDaily] = useState<Record<string, ReportItem>>({});
  const [monthly, setMonthly] = useState<Record<string, ReportItem>>({});

  useEffect(() => {
    const load = async () => {
      const bills = await getOfflineBills();

      const dailyMap: Record<string, ReportItem> = {};
      const monthlyMap: Record<string, ReportItem> = {};

      bills.forEach(b => {
        const dateKey = new Date(b.createdAt).toLocaleDateString();
        const monthKey = new Date(b.createdAt).toLocaleString("default", {
          month: "long",
          year: "numeric"
        });

        const grossSale = b.totalAmount;

        // DAILY
        if (!dailyMap[dateKey]) {
          dailyMap[dateKey] = { count: 0, sales: 0, profit: 0 };
        }
        dailyMap[dateKey].count += 1;
        dailyMap[dateKey].sales += grossSale;
        dailyMap[dateKey].profit += b.profit;

        // MONTHLY
        if (!monthlyMap[monthKey]) {
          monthlyMap[monthKey] = { count: 0, sales: 0, profit: 0 };
        }
        monthlyMap[monthKey].count += 1;
        monthlyMap[monthKey].sales += grossSale;
        monthlyMap[monthKey].profit += b.profit;
      });

      setDaily(dailyMap);
      setMonthly(monthlyMap);
    };

    load();
  }, []);

  return (
    <div className="p-4 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-semibold text-slate-900">
        Reports
      </h1>

      {/* DAILY REPORT */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-slate-800">
          Daily Report
        </h2>

        {Object.keys(daily).length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
            No daily data available
          </div>
        )}

        <div className="space-y-3">
          {Object.entries(daily)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([date, r]) => (
              <div
                key={date}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-slate-900">
                    {date}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.count} bills
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="Bills" value={r.count} />
                  <Metric
                    label="Sales"
                    value={`₹${r.sales.toFixed(2)}`}
                  />
                  <Metric
                    label="Profit"
                    value={`₹${r.profit.toFixed(2)}`}
                    highlight={r.profit >= 0}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>

      {/* MONTHLY REPORT */}
      <section className="space-y-3">
        <h2 className="text-base font-medium text-slate-800">
          Monthly Report
        </h2>

        {Object.keys(monthly).length === 0 && (
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-500">
            No monthly data available
          </div>
        )}

        <div className="space-y-3">
          {Object.entries(monthly)
            .sort(([a], [b]) => b.localeCompare(a))
            .map(([month, r]) => (
              <div
                key={month}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm"
              >
                <div className="flex justify-between items-center mb-3">
                  <div className="text-sm font-medium text-slate-900">
                    {month}
                  </div>
                  <div className="text-xs text-slate-500">
                    {r.count} bills
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <Metric label="Bills" value={r.count} />
                  <Metric
                    label="Sales"
                    value={`₹${r.sales.toFixed(2)}`}
                  />
                  <Metric
                    label="Profit"
                    value={`₹${r.profit.toFixed(2)}`}
                    highlight={r.profit >= 0}
                  />
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  );
}

/* -------- METRIC COMPONENT -------- */

function Metric({
  label,
  value,
  highlight
}: {
  label: string;
  value: number | string;
  highlight?: boolean;
}) {
  return (
    <div>
      <div className="text-xs text-slate-500">{label}</div>
      <div
        className={`font-semibold ${
          highlight === undefined
            ? "text-slate-900"
            : highlight
            ? "text-emerald-700"
            : "text-red-600"
        }`}
      >
        {value}
      </div>
    </div>
  );
}
