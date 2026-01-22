import KebabMenu from "../KebabMenu";


export type Customer = {
  id?: number;
  name: string;
  phone: string;
  address?: string;
  gstNumber?: string;
};

type Props = {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (id?: number) => void;
};

export default function CustomerItem({
  customer,
  onEdit,
  onDelete
}: Props) {
  return (
    <li className="p-4 flex justify-between items-start">
      <div className="space-y-1">
        <div className="font-medium text-slate-900">
          {customer.name}
        </div>

        <div className="text-sm text-slate-600">
          📞 {customer.phone}
        </div>

        {customer.gstNumber && (
          <div className="text-sm text-slate-600">
            🔢 {customer.gstNumber}
          </div>
        )}

        {customer.address && (
          <div className="text-sm text-slate-500">
            📍 {customer.address}
          </div>
        )}
      </div>

      <KebabMenu
        actions={[
          {
            label: "Edit",
            onClick: () => onEdit(customer),
          },
          {
            label: "Delete",
            danger: true,
            onClick: () => onDelete(customer.id),
          },
        ]}
      />
    </li>
  );
}
