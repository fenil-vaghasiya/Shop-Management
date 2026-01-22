import { useEffect, useState } from "react";
import type { Customer } from "../../../hooks/useCustomers";
import Button from "../Button";
import { toast } from "react-toastify";

type Props = {
  onAdd: (customer: Customer) => void;
  onUpdate?: (customer: Customer) => void;
  editingCustomer?: Customer | null;
  loading?: boolean;
};

export default function CustomerForm({ onAdd, onUpdate, editingCustomer, loading }: Props) {
  const [name, setName] = useState(editingCustomer?.name || "");
  const [phone, setPhone] = useState(editingCustomer?.phone || "");
  const [address, setAddress] = useState(editingCustomer?.address || "");
  const [gstNumber, setGstNumber] = useState(editingCustomer?.gstNumber || "");

  useEffect(() => {
    if (editingCustomer) {
      setName(editingCustomer.name);
      setPhone(editingCustomer.phone);
      setAddress(editingCustomer.address || "");
      setGstNumber(editingCustomer.gstNumber || "");
    }
  }, [editingCustomer]);

  const submit = () => {
    if (!name || !phone) {
      toast.error("Name & phone required");
      return;
    }

    if (editingCustomer && onUpdate) {
      onUpdate({
        id: editingCustomer.id,
        name,
        phone,
        address,
        gstNumber
      });
    } else {
      onAdd({ name, phone, address, gstNumber });
    }

    setName("");
    setPhone("");
    setAddress("");
    setGstNumber("");
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
      <input
        placeholder="Customer Name"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
      />

      <input
        placeholder="Phone Number"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
      />

      <textarea
        placeholder="Address (optional)"
        value={address}
        onChange={e => setAddress(e.target.value)}
        rows={2}
        className="w-full p-3 rounded-xl border border-slate-300 resize-none focus:ring-2 focus:ring-blue-600"
      />

      <input
        placeholder="GST Number (optional)"
        value={gstNumber}
        onChange={e => setGstNumber(e.target.value)}
        className="w-full p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-600"
      />

      <Button onClick={submit} loading={loading}>
        {editingCustomer ? "Update Customer" : "Add Customer"}
      </Button>
    </div>
  );
}
