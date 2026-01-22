import { useEffect, useMemo, useState } from "react";
import { getOfflineBills } from "../offline/bill.read";
import { getOfflineCustomers } from "../offline/customer.offline";
import { updateOfflineBillPayment } from "../offline/bill.update";
import Button from "../components/ui/Button";
import SearchInput from "../components/ui/SearchInput";
import { toast } from "react-toastify/unstyled";

const GST_PERCENT = 18;

type PendingBill = {
  id: number;
  customerId: number;
  customerName: string;
  totalAmount: number; // GST INCLUDED
  paidAmount: number;
  balance: number;
  createdAt: string;
  _pay?: number;
};

type CustomerGroup = {
  customerId: number;
  customerName: string;
  totalBalance: number;
  bills: PendingBill[];
};

export default function PendingPayments() {
  const [groups, setGroups] = useState<CustomerGroup[]>([]);
  const [search, setSearch] = useState("");
  const [expandedCustomerId, setExpandedCustomerId] =
    useState<number | null>(null);

  /* ---------------- LOAD DATA ---------------- */

  const reloadData = async () => {
    const bills = await getOfflineBills();
    const customers = await getOfflineCustomers();

    const pendingBills: PendingBill[] = bills
      .filter(b => b.paymentStatus === "PENDING")
      .map(b => {
        const customer = customers.find(c => c.id === b.customerId);

        // 🔥 GST CALCULATION (SIMPLE & CORRECT)
        const gstAmount = +(b.totalAmount * GST_PERCENT / 100).toFixed(2);
        const grossTotal = b.totalAmount + gstAmount;

        return {
          ...b,
          customerName: customer?.name || "Unknown",
          totalAmount: grossTotal,                 // GST INCLUDED
          balance: grossTotal - b.paidAmount,     // CORRECT BALANCE
          _pay: 0
        };
      });

    // GROUP BY CUSTOMER
    const map = new Map<number, CustomerGroup>();

    pendingBills.forEach(b => {
      if (!map.has(b.customerId)) {
        map.set(b.customerId, {
          customerId: b.customerId,
          customerName: b.customerName,
          totalBalance: 0,
          bills: []
        });
      }

      const group = map.get(b.customerId)!;
      group.totalBalance += b.balance;
      group.bills.push(b);
    });

    setGroups(Array.from(map.values()));
  };

  useEffect(() => {
    reloadData();
  }, []);

  /* ---------------- PAYMENT ---------------- */

  const handlePay = async (billId: number, amount: number) => {
    if (!amount || amount <= 0) {
      toast.error("Enter valid amount");
      return;
    }

    await updateOfflineBillPayment(billId, amount);
    toast.success("Payment updated successfully");
    reloadData();
  };

  /* ---------------- SEARCH ---------------- */

  const filteredGroups = useMemo(() => {
    if (!search.trim()) return groups;
    return groups.filter(g =>
      g.customerName.toLowerCase().includes(search.toLowerCase())
    );
  }, [groups, search]);

  /* ---------------- SUMMARY ---------------- */

  const totalPendingAmount = filteredGroups.reduce(
    (sum, g) => sum + g.totalBalance,
    0
  );

  const totalPendingBills = filteredGroups.reduce(
    (sum, g) => sum + g.bills.length,
    0
  );

  /* ---------------- UI ---------------- */

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-semibold text-slate-900">
        Pending Payments
      </h1>

      {/* SUMMARY */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex justify-between">
        <div>
          <div className="text-xs text-slate-500">Total Pending (incl. GST)</div>
          <div className="text-lg font-semibold text-red-600">
            ₹{totalPendingAmount.toFixed(2)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Pending Bills</div>
          <div className="text-lg font-semibold text-slate-900">
            {totalPendingBills}
          </div>
        </div>
      </div>

      {/* SEARCH */}
      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search customer..."
      />

      {filteredGroups.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-4 text-slate-600 text-sm">
          No pending payments 🎉
        </div>
      )}

      {/* CUSTOMER GROUPS */}
      <div className="space-y-3">
        {filteredGroups.map(group => {
          const expanded = expandedCustomerId === group.customerId;

          return (
            <div
              key={group.customerId}
              className="bg-white border border-slate-200 rounded-xl shadow-sm"
            >
              {/* CUSTOMER HEADER */}
              <button
                type="button"
                onClick={() =>
                  setExpandedCustomerId(
                    expanded ? null : group.customerId
                  )
                }
                className="w-full p-4 flex justify-between items-center text-left"
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {group.customerName}
                  </div>
                  <div className="text-sm text-slate-600">
                    {group.bills.length} pending bill(s)
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs text-slate-500">Balance</div>
                  <div className="font-semibold text-red-600">
                    ₹{group.totalBalance.toFixed(2)}
                  </div>
                </div>
              </button>

              {/* BILL DETAILS */}
              {expanded && (
                <div className="border-t border-slate-200 p-4 space-y-4">
                  {group.bills.map(b => (
                    <div
                      key={b.id}
                      className="border border-slate-200 rounded-lg p-3 space-y-2"
                    >
                      <div className="flex justify-between text-sm">
                        <div>
                          <div className="text-slate-600">
                            {new Date(b.createdAt).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-slate-500">
                            Bill ID: {b.id}
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="text-xs text-slate-500">
                            Balance (incl. GST)
                          </div>
                          <div className="font-semibold text-red-600">
                            ₹{b.balance.toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className="text-xs text-blue-700 underline"
                        onClick={() => {
                          b._pay = b.balance;
                          setGroups([...groups]);
                        }}
                      >
                        Pay full ₹{b.balance.toFixed(2)}
                      </button>

                      <input
                        type="number"
                        placeholder="Pay amount"
                        value={b._pay || ""}
                        onChange={e => {
                          b._pay = Number(e.target.value);
                          setGroups([...groups]);
                        }}
                        className="w-full p-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-emerald-600"
                      />

                      <Button
                        disabled={!b._pay || b._pay <= 0}
                        onClick={() => handlePay(b.id, b._pay || 0)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Mark as Paid
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
