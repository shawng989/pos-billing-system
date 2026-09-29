const API_BASE_URL = "http://127.0.0.1:8000/api";

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(`API Error ${response.status}: ${errorText}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

// ==================== PRODUCTS ====================

export const getProducts = () => {
  return apiRequest("/products/");
};

export const getProduct = (id) => {
  return apiRequest(`/products/${id}/`);
};

export const createProduct = (product) => {
  return apiRequest("/products/", {
    method: "POST",
    body: JSON.stringify(product),
  });
};

export const updateProduct = (id, product) => {
  return apiRequest(`/products/${id}/`, {
    method: "PUT",
    body: JSON.stringify(product),
  });
};

export const deleteProduct = (id) => {
  return apiRequest(`/products/${id}/`, {
    method: "DELETE",
  });
};

// ==================== SALES ====================

export const getSales = () => {
  return apiRequest("/sales/");
};

export const getSale = (id) => {
  return apiRequest(`/sales/${id}/`);
};

export const createSale = (sale) => {
  return apiRequest("/sales/", {
    method: "POST",
    body: JSON.stringify(sale),
  });
};

export const updateSale = (id, sale) => {
  return apiRequest(`/sales/${id}/`, {
    method: "PUT",
    body: JSON.stringify(sale),
  });
};

export const deleteSale = (id) => {
  return apiRequest(`/sales/${id}/`, {
    method: "DELETE",
  });
};

// ==================== SALE ITEMS ====================

export const getSaleItems = () => {
  return apiRequest("/sale-items/");
};

export const getSaleItem = (id) => {
  return apiRequest(`/sale-items/${id}/`);
};

export const createSaleItem = (saleItem) => {
  return apiRequest("/sale-items/", {
    method: "POST",
    body: JSON.stringify(saleItem),
  });
};

export const updateSaleItem = (id, saleItem) => {
  return apiRequest(`/sale-items/${id}/`, {
    method: "PUT",
    body: JSON.stringify(saleItem),
  });
};

export const deleteSaleItem = (id) => {
  return apiRequest(`/sale-items/${id}/`, {
    method: "DELETE",
  });
};

// ==================== SUPPLIERS ====================

export const getSuppliers = () => {
  return apiRequest("/suppliers/");
};

export const getSupplier = (id) => {
  return apiRequest(`/suppliers/${id}/`);
};

export const createSupplier = (supplier) => {
  return apiRequest("/suppliers/", {
    method: "POST",
    body: JSON.stringify(supplier),
  });
};

export const updateSupplier = (id, supplier) => {
  return apiRequest(`/suppliers/${id}/`, {
    method: "PUT",
    body: JSON.stringify(supplier),
  });
};

export const deleteSupplier = (id) => {
  return apiRequest(`/suppliers/${id}/`, {
    method: "DELETE",
  });
};

// ==================== STAFF ====================

export const getStaff = () => {
  return apiRequest("/staff/");
};

export const getStaffMember = (id) => {
  return apiRequest(`/staff/${id}/`);
};

export const createStaff = (staff) => {
  return apiRequest("/staff/", {
    method: "POST",
    body: JSON.stringify(staff),
  });
};

export const updateStaff = (id, staff) => {
  return apiRequest(`/staff/${id}/`, {
    method: "PUT",
    body: JSON.stringify(staff),
  });
};

export const deleteStaff = (id) => {
  return apiRequest(`/staff/${id}/`, {
    method: "DELETE",
  });
};

// ==================== RETURNS ====================

export const getReturns = () => {
  return apiRequest("/returns/");
};

export const getReturn = (id) => {
  return apiRequest(`/returns/${id}/`);
};

export const createReturn = (returnData) => {
  return apiRequest("/returns/", {
    method: "POST",
    body: JSON.stringify(returnData),
  });
};

export const updateReturn = (id, returnData) => {
  return apiRequest(`/returns/${id}/`, {
    method: "PUT",
    body: JSON.stringify(returnData),
  });
};

export const deleteReturn = (id) => {
  return apiRequest(`/returns/${id}/`, {
    method: "DELETE",
  });
};

export const approveReturn = (id) => {
  return apiRequest(`/returns/${id}/approve/`, {
    method: "POST",
  });
};

export const rejectReturn = (id) => {
  return apiRequest(`/returns/${id}/reject/`, {
    method: "POST",
  });
};

// ==================== TRANSACTIONS ====================

export const getTransactions = () => {
  return apiRequest("/transactions/");
};

export const getTransaction = (id) => {
  return apiRequest(`/transactions/${id}/`);
};

export const createTransaction = (transaction) => {
  return apiRequest("/transactions/", {
    method: "POST",
    body: JSON.stringify(transaction),
  });
};

export const updateTransaction = (id, transaction) => {
  return apiRequest(`/transactions/${id}/`, {
    method: "PUT",
    body: JSON.stringify(transaction),
  });
};

export const deleteTransaction = (id) => {
  return apiRequest(`/transactions/${id}/`, {
    method: "DELETE",
  });
};

// ==================== LEDGER ====================

export const getLedgerEntries = () => {
  return apiRequest("/ledger/");
};

export const getLedgerEntry = (id) => {
  return apiRequest(`/ledger/${id}/`);
};

export const createLedgerEntry = (entry) => {
  return apiRequest("/ledger/", {
    method: "POST",
    body: JSON.stringify(entry),
  });
};

export const updateLedgerEntry = (id, entry) => {
  return apiRequest(`/ledger/${id}/`, {
    method: "PUT",
    body: JSON.stringify(entry),
  });
};

export const deleteLedgerEntry = (id) => {
  return apiRequest(`/ledger/${id}/`, {
    method: "DELETE",
  });
};

// ==================== REPORTS ====================

export const getReports = () => {
  return apiRequest("/reports/dashboard/");
};

// ==================== DASHBOARD ====================

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

// ==================== LOGIN ====================

export const loginUser = (credentials) => {
  return apiRequest("/billing/login/", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
};