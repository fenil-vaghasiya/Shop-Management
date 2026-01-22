import CustomerItem, { type Customer } from "./CustomerItem";

type Props = {
  customers: Customer[];
  onEdit: (c: Customer) => void;
  onDelete: (id?: number) => void;
};

export default function CustomerList({
  customers,
  onEdit,
  onDelete,
}: Props) {
  if (customers.length === 0) {
    return (
      <div className="bg-white border rounded-xl p-4 text-slate-500">
        No customers found
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <ul className="divide-y divide-slate-200">
        {customers.map((c) => (
          <CustomerItem
            key={c.id}
            customer={c}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    </div>
  );
}
