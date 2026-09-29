const API_BASE_URL = "https://pos-billing-system-6jjx.onrender.com/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `API Error ${response.status}: ${errorText}`
    );
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}


// =========================
// PRODUCTS
// =========================

export const getProducts = () =>
  apiRequest("/products/");

export const getProduct = (id) =>
  apiRequest(`/products/${id}/`);

export const createProduct = (product) =>
  apiRequest("/products/", {
    method: "POST",
    body: JSON.stringify(product),
  });

export const updateProduct = (id, product) =>
  apiRequest(`/products/${id}/`, {
    method: "PUT",
    body: JSON.stringify(product),
  });

export const deleteProduct = (id) =>
  apiRequest(`/products/${id}/`, {
    method: "DELETE",
  });


// =========================
// SALES
// =========================

export const getSales = () =>
  apiRequest("/sales/");

export const getSale = (id) =>
  apiRequest(`/sales/${id}/`);

export const createSale = (sale) =>
  apiRequest("/sales/", {
    method: "POST",
    body: JSON.stringify(sale),
  });

export const updateSale = (id, sale) =>
  apiRequest(`/sales/${id}/`, {
    method: "PUT",
    body: JSON.stringify(sale),
  });

export const deleteSale = (id) =>
  apiRequest(`/sales/${id}/`, {
    method: "DELETE",
  });


// =========================
// SALE ITEMS
// =========================

export const getSaleItems = () =>
  apiRequest("/sale-items/");

export const getSaleItem = (id) =>
  apiRequest(`/sale-items/${id}/`);

export const createSaleItem = (saleItem) =>
  apiRequest("/sale-items/", {
    method: "POST",
    body: JSON.stringify(saleItem),
  });

export const updateSaleItem = (id, saleItem) =>
  apiRequest(`/sale-items/${id}/`, {
    method: "PUT",
    body: JSON.stringify(saleItem),
  });

export const deleteSaleItem = (id) =>
  apiRequest(`/sale-items/${id}/`, {
    method: "DELETE",
  });


// =========================
// SUPPLIERS
// =========================

export const getSuppliers = () =>
  apiRequest("/suppliers/");

export const getSupplier = (id) =>
  apiRequest(`/suppliers/${id}/`);

export const createSupplier = (supplier) =>
  apiRequest("/suppliers/", {
    method: "POST",
    body: JSON.stringify(supplier),
  });

export const updateSupplier = (id, supplier) =>
  apiRequest(`/suppliers/${id}/`, {
    method: "PUT",
    body: JSON.stringify(supplier),
  });

export const deleteSupplier = (id) =>
  apiRequest(`/suppliers/${id}/`, {
    method: "DELETE",
  });


// =========================
// STAFF
// =========================

export const getStaff = () =>
  apiRequest("/staff/");

export const getStaffMember = (id) =>
  apiRequest(`/staff/${id}/`);

export const createStaff = (staff) =>
  apiRequest("/staff/", {
    method: "POST",
    body: JSON.stringify(staff),
  });

export const updateStaff = (id, staff) =>
  apiRequest(`/staff/${id}/`, {
    method: "PUT",
    body: JSON.stringify(staff),
  });

export const deleteStaff = (id) =>
  apiRequest(`/staff/${id}/`, {
    method: "DELETE",
  });


// =========================
// RETURNS
// =========================

export const getReturns = () =>
  apiRequest("/returns/");

export const getReturn = (id) =>
  apiRequest(`/returns/${id}/`);

export const createReturn = (returnData) =>
  apiRequest("/returns/", {
    method: "POST",
    body: JSON.stringify(returnData),
  });

export const updateReturn = (id, returnData) =>
  apiRequest(`/returns/${id}/`, {
    method: "PUT",
    body: JSON.stringify(returnData),
  });

export const deleteReturn = (id) =>
  apiRequest(`/returns/${id}/`, {
    method: "DELETE",
  });


// =========================
// TRANSACTIONS
// =========================

export const getTransactions = () =>
  apiRequest("/transactions/");

export const getTransaction = (id) =>
  apiRequest(`/transactions/${id}/`);

export const createTransaction = (transaction) =>
  apiRequest("/transactions/", {
    method: "POST",
    body: JSON.stringify(transaction),
  });

export const updateTransaction = (id, transaction) =>
  apiRequest(`/transactions/${id}/`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });

export const deleteTransaction = (id) =>
  apiRequest(`/transactions/${id}/`, {
    method: "DELETE",
  });


// =========================
// LEDGER
// =========================

export const getLedgerEntries = () =>
  apiRequest("/ledger/");

export const getLedgerEntry = (id) =>
  apiRequest(`/ledger/${id}/`);

export const createLedgerEntry = (entry) =>
  apiRequest("/ledger/", {
    method: "POST",
    body: JSON.stringify(entry),
  });

export const updateLedgerEntry = (id, entry) =>
  apiRequest(`/ledger/${id}/`, {
    method: "PUT",
    body: JSON.stringify(entry),
  });

export const deleteLedgerEntry = (id) =>
  apiRequest(`/ledger/${id}/`, {
    method: "DELETE",
  });


// =========================
// REPORTS
// =========================

export const getReports = () =>
  apiRequest("/reports/dashboard/");


// =========================
// DASHBOARD
// =========================

export const getDashboardData = async () => {
  const [
    products,
    sales,
    suppliers,
    staff,
    returns,
    transactions,
    ledger,
  ] = await Promise.all([
    getProducts(),
    getSales(),
    getSuppliers(),
    getStaff(),
    getReturns(),
    getTransactions(),
    getLedgerEntries(),
  ]);

  return {
    products,
    sales,
    suppliers,
    staff,
    returns,
    transactions,
    ledger,
  };
};


// =========================
// LOGIN
// =========================

export const loginUser = (credentials) =>
  apiRequest("/billing/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
