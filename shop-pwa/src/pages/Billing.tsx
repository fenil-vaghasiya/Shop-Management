import { useEffect, useState } from "react";
import { getCustomers } from "../api/customer.api";
import { getOfflineCustomers } from "../offline/customer.offline";
import { getProducts } from "../api/product.api";
import { getOfflineProducts } from "../offline/product.offline";
import { getOfflineStockByProduct } from "../offline/stock.offline";
import { createBill } from "../api/bill.api";
import { addOfflineBill } from "../offline/bill.offline";
import { consumeFIFO } from "../utils/fifo";
import { reduceOfflineStock } from "../offline/stock.reduce";
import Button from "../components/ui/Button";
import Select from "../components/ui/Select";
import Input from "../components/ui/Input";
import { toast } from "react-toastify";

type BillItem = {
  productId: number;
  quantity: number;
  sellingPrice: number;
};


export default function Billing() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customerId, setCustomerId] = useState("");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"PAID" | "PENDING">(
    "PAID"
  );
  const [items, setItems] = useState<BillItem[]>([]);

  useEffect(() => {
    const load = async () => {
      setCustomers(
        navigator.onLine
          ? await getCustomers().catch(getOfflineCustomers)
          : await getOfflineCustomers()
      );

      setProducts(
        navigator.onLine
          ? await getProducts().catch(getOfflineProducts)
          : await getOfflineProducts()
      );
    };

    load();
  }, []);

  const addItem = async () => {
    if (!productId || !qty || !price) {
      toast.error("Product, qty & price required");
      return;
    }

    const stocks = await getOfflineStockByProduct(Number(productId));

    try {
      consumeFIFO(stocks, Number(qty));
    } catch (err: any) {
      toast.error(err.message || "Insufficient stock");
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        productId: Number(productId),
        quantity: Number(qty),
        sellingPrice: Number(price),
      },
    ]);

    setQty("");
    setPrice("");
  };

  const handleBill = async () => {
    if (!customerId || items.length === 0) {
      toast.error("Customer & at least one product required");
      return;
    }

    let totalCost = 0;

    for (const item of items) {
      const stocks = await getOfflineStockByProduct(item.productId);
      const consumed = consumeFIFO(stocks, item.quantity);

      totalCost += consumed.reduce(
        (sum, c) => sum + c.usedQty * c.purchasePrice,
        0
      );

      await reduceOfflineStock(consumed);
    }

    const subTotal = items.reduce(
      (sum, i) => sum + i.quantity * i.sellingPrice,
      0
    );

    const profit = subTotal - totalCost;

    const billPayload = {
      customerId: Number(customerId),
      paymentMode: "CASH" as const,
      paymentStatus,
      items,
      totalAmount: subTotal,
      paidAmount: paymentStatus === "PAID" ? subTotal : 0,
      profit,
      createdAt: new Date().toISOString(),
    };

    try {
      if (navigator.onLine) {
        await createBill(billPayload);
      } else {
        await addOfflineBill(billPayload);
      }
    } catch {
      await addOfflineBill(billPayload);
    }

    setItems([]);
    toast.success("Bill created successfully");
  };

  return (
    <div className="p-4 space-y-4 bg-slate-50 min-h-screen">
      {/* TITLE */}
      <h1 className="text-xl font-semibold text-slate-900">Billing</h1>

      {/* FORM */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
        {/* CUSTOMER */}
        <Select
          value={customerId}
          onChange={setCustomerId}
          placeholder="Select customer"
          options={customers.map((c) => ({
            label: c.name,
            value: c.id,
          }))}
        />

        {/* PRODUCT */}
        <Select
          value={productId}
          onChange={setProductId}
          placeholder="Select product"
          options={products.map((p) => ({
            label: p.name,
            value: p.id,
          }))}
        />

        {/* QTY */}
        <Input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />

        {/* PRICE */}
        <Input
          type="number"
          placeholder="Selling price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />

        {/* PAYMENT STATUS */}
        <Select
          value={paymentStatus}
          onChange={(val) => setPaymentStatus(val as "PAID" | "PENDING")}
          placeholder="Payment status"
          options={[
            { label: "Paid", value: "PAID" },
            { label: "Pending", value: "PENDING" },
          ]}
        />
        <Button onClick={addItem}>Add Product</Button>
        <Button onClick={handleBill}>Create Bill</Button>
      </div>
    </div>
  );
}
