import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getOfflineBillById } from '../offline/bill.read';
import { getOfflineCustomers } from '../offline/customer.offline';
import { getOfflineProducts } from '../offline/product.offline';

const CGST_PERCENT = 9;
const SGST_PERCENT = 9;

export default function BillInvoice() {
  const { id } = useParams();
  const [bill, setBill] = useState<any>(null);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      setBill(await getOfflineBillById(Number(id)));
      setCustomers(await getOfflineCustomers());
      setProducts(await getOfflineProducts());
    };
    load();
  }, [id]);

  if (!bill) {
    return (
      <div className="p-4 text-slate-600">
        Loading invoice…
      </div>
    );
  }

  const customer = customers.find(c => c.id === bill.customerId);

  const getProductName = (id: number) =>
    products.find(p => p.id === id)?.name || 'Unknown';

  /* ---------------- CALCULATIONS ---------------- */

  const subTotal = bill.items.reduce(
    (sum: number, i: any) => sum + i.quantity * i.sellingPrice,
    0
  );

  const cgst = +(subTotal * CGST_PERCENT / 100).toFixed(2);
  const sgst = +(subTotal * SGST_PERCENT / 100).toFixed(2);

  const grossTotal = subTotal + cgst + sgst;
  const roundedTotal = Math.round(grossTotal);
  const roundOff = +(roundedTotal - grossTotal).toFixed(2);

  /* ------------------------------------------------ */

  return (
    <div className="min-h-screen bg-white p-4 space-y-4">
      {/* HEADER */}
      <div className="border-b border-slate-200 pb-3">
        <h1 className="text-xl font-semibold text-slate-900">
          Invoice
        </h1>
        <p className="text-sm text-slate-500">
          Date: {new Date(bill.createdAt).toLocaleString()}
        </p>
      </div>

      {/* CUSTOMER INFO */}
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
        <div className="text-sm text-slate-600">Billed To</div>
        <div className="font-medium text-slate-900">
          {customer?.name}
        </div>
        <div className="text-sm text-slate-600">
          Payment: {bill.paymentMode}
        </div>
      </div>

      {/* ITEMS TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border border-slate-200 rounded-lg overflow-hidden">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="px-3 py-2 text-left">Product</th>
              <th className="px-3 py-2 text-center">Qty</th>
              <th className="px-3 py-2 text-right">Rate</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {bill.items.map((i: any, idx: number) => (
              <tr key={idx}>
                <td className="px-3 py-2">
                  {getProductName(i.productId)}
                </td>
                <td className="px-3 py-2 text-center">
                  {i.quantity}
                </td>
                <td className="px-3 py-2 text-right">
                  ₹{i.sellingPrice}
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  ₹{i.quantity * i.sellingPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* SUMMARY */}
      <div className="border-t border-slate-200 pt-3 space-y-1 text-sm">
        <SummaryRow label="Sub Total" value={subTotal} />
        <SummaryRow label={`CGST (${CGST_PERCENT}%)`} value={cgst} />
        <SummaryRow label={`SGST (${SGST_PERCENT}%)`} value={sgst} />
        <SummaryRow label="Round Off" value={roundOff} />
        <SummaryRow
          label="Grand Total"
          value={roundedTotal}
          bold
        />
        <SummaryRow
          label="Profit"
          value={bill.profit}
          highlight={bill.profit >= 0}
        />
      </div>

      {/* PRINT BUTTON */}
      <button
        onClick={() => window.print()}
        className="
          w-full
          bg-blue-700 hover:bg-blue-800
          text-white
          py-3
          rounded-lg
          font-semibold
          transition
          print:hidden
        "
      >
        Print Invoice
      </button>
    </div>
  );
}

/* ---------- SMALL HELPER COMPONENT ---------- */

function SummaryRow({
  label,
  value,
  bold,
  highlight
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
}) {
  return (
    <div
      className={`flex justify-between ${
        bold ? 'font-semibold text-base' : ''
      } ${
        highlight === undefined
          ? 'text-slate-700'
          : highlight
          ? 'text-emerald-700'
          : 'text-red-600'
      }`}
    >
      <span>{label}</span>
      <span>₹{value.toFixed(2)}</span>
    </div>
  );
}
