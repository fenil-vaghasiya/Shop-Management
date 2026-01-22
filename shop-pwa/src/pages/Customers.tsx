import { useState } from "react";
import CustomerForm from "../components/ui/customers/CustomerForm";
import CustomerList from "../components/ui/customers/CustomerList";
import SearchInput from "../components/ui/SearchInput";
import { useCustomers, type Customer } from "../hooks/useCustomers";

export default function Customers() {
  const {
    customers,
    search,
    setSearch,
    addCustomer,
    editCustomer,
    deleteCustomer,
    loading
  } = useCustomers();

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleDelete = (id?: number) => {
    if (!id) return;

    const ok = window.confirm("Are you sure you want to delete this customer?");
    if (!ok) return;

    deleteCustomer(id);
  };
  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      <h1 className="text-xl font-semibold text-slate-900">
        Customers
      </h1>

      <CustomerForm onAdd={addCustomer}
      onUpdate={editCustomer}
      editingCustomer={editingCustomer}
      loading={loading} />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search by name, phone or address"
      />

      <CustomerList customers={customers} onEdit={setEditingCustomer} onDelete={handleDelete} />
    </div>
  );
}
