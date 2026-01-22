import { useEffect, useState } from "react";
import {
  getCustomers,
  addCustomer,
  deleteCustomer as deleteCustomerApi,
  updateCustomer
} from "../api/customer.api";
import {
  getOfflineCustomers,
  addOfflineCustomer,
  deleteOfflineCustomer,
  updateOfflineCustomer
} from "../offline/customer.offline";
import { filterBySearch } from "../utils/search";

export type Customer = {
  id?: number;
  name: string;
  phone: string;
  address?: string;
  gstNumber?: string;
};

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* ---------------- LOAD ---------------- */

  const loadCustomers = async () => {
    if (navigator.onLine) {
      try {
        setCustomers(await getCustomers());
        return;
      } catch {}
    }
    setCustomers(await getOfflineCustomers());
  };

  /* ---------------- ADD ---------------- */

  const addNewCustomer = async (customer: Customer) => {
    setLoading(true);
    try {
      if (navigator.onLine) {
        await addCustomer(customer);
      } else {
        await addOfflineCustomer(customer);
      }
    } catch {
      await addOfflineCustomer(customer);
    } finally {
      setLoading(false);
      loadCustomers();
    }
  };

  /* ---------- EDIT ---------- */

  const editCustomer = async (customer: Customer) => {
    if (!customer.id) return;

    setLoading(true);
    try {
      if (navigator.onLine) {
        await updateCustomer(customer.id, customer);
      } else {
        await updateOfflineCustomer(customer.id, customer);
      }
    } catch {
      await updateOfflineCustomer(customer.id, customer);
    } finally {
      setLoading(false);
      loadCustomers();
    }
  };

  /* ---------------- DELETE ---------------- */

  const deleteCustomer = async (id?: number) => {
    if (!id) return;

    setLoading(true);
    try {
      if (navigator.onLine) {
        await deleteCustomerApi(id);
      } else {
        await deleteOfflineCustomer(id);
      }
    } catch {
      await deleteOfflineCustomer(id);
    } finally {
      setLoading(false);
      loadCustomers();
    }
  };

  /* ---------------- INIT ---------------- */

  useEffect(() => {
    loadCustomers();
  }, []);

  /* ---------------- SEARCH ---------------- */

  const filteredCustomers = filterBySearch(
    customers,
    search,
    ["name", "phone", "address", "gstNumber"]
  );

  /* ---------------- PUBLIC API ---------------- */

  return {
    customers: filteredCustomers,
    search,
    setSearch,
    addCustomer: addNewCustomer,
    editCustomer,
    deleteCustomer, // ✅ NEW
    loading
  };
}
