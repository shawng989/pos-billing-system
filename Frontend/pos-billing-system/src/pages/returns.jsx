
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Eye,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

function Returns() {
  const [returns, setReturns] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [form, setForm] = useState({
    sale: "",
    product: "",
    quantity: 1,
    refund_amount: "",
    reason: "",
  });

  // =========================================================
  // LOAD RETURNS
  // =========================================================

  const loadReturns = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://127.0.0.1:8000/api/returns/"
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      const data = await response.json();

      const returnData = Array.isArray(data)
        ? data
        : data.results || [];

      setReturns(returnData);
    } catch (err) {
      console.error("Failed to load returns:", err);

      setReturns([]);

      setError(
        "Unable to load return data. Make sure the Django server is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
 // LOAD DATA ONCE
useEffect(() => {
  // eslint-disable-next-line react-hooks/set-state-in-effect
  loadReturns();
}, []);
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =========================================================
  // CREATE RETURN
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.sale ||
      !form.product ||
      !form.quantity ||
      !form.refund_amount ||
      !form.reason
    ) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/returns/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sale: Number(form.sale),
            product: Number(form.product),
            quantity: Number(form.quantity),
            refund_amount: Number(
              form.refund_amount
            ),
            reason: form.reason,
            status: "pending",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.text();

        console.error(
          "Create return error:",
          errorData
        );

        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      alert("Return created successfully.");

      setForm({
        sale: "",
        product: "",
        quantity: 1,
        refund_amount: "",
        reason: "",
      });

      setShowModal(false);

      await loadReturns();
    } catch (err) {
      console.error("Create return failed:", err);

      alert(
        "Unable to create return. Check the Django server."
      );
    }
  };

  // =========================================================
  // APPROVE RETURN
  // =========================================================

  const approveReturn = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/returns/${id}/approve/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      await loadReturns();
    } catch (err) {
      console.error(
        "Approve return failed:",
        err
      );

      alert("Unable to approve return.");
    }
  };

  // =========================================================
  // REJECT RETURN
  // =========================================================

  const rejectReturn = async (id) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/returns/${id}/reject/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP error ${response.status}`
        );
      }

      await loadReturns();
    } catch (err) {
      console.error(
        "Reject return failed:",
        err
      );

      alert("Unable to reject return.");
    }
  };

  // =========================================================
  // VIEW RETURN
  // =========================================================

  const viewReturn = (item) => {
    alert(
      `Return RET-${String(item.id).padStart(
        4,
        "0"
      )}\n\n` +
        `Sale ID: ${item.sale}\n` +
        `Product ID: ${item.product}\n` +
        `Quantity: ${item.quantity}\n` +
        `Refund Amount: ₹${item.refund_amount}\n` +
        `Reason: ${item.reason}\n` +
        `Status: ${item.status}`
    );
  };

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredReturns = returns.filter(
    (item) => {
      const searchText = `
        ${item.id}
        ${item.sale}
        ${item.product}
        ${item.quantity}
        ${item.refund_amount}
        ${item.reason}
        ${item.status}
      `.toLowerCase();

      return searchText.includes(
        search.toLowerCase()
      );
    }
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="returns-page">

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>Product Returns</h1>

          <p>
            Manage customer returns and refund
            requests.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() => setShowModal(true)}
        >
          <Plus size={18} />
          New Return
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="api-error">
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search returns..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="product-count">

          <RotateCcw size={18} />

          {filteredReturns.length} Returns

        </div>

      </div>

      {/* TABLE */}

      <div className="dashboard-card">

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Return</th>
                <th>Sale</th>
                <th>Product</th>
                <th>Qty</th>
                <th>Amount</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    Loading returns...
                  </td>
                </tr>

              ) : filteredReturns.length === 0 ? (

                <tr>
                  <td
                    colSpan="8"
                    style={{
                      textAlign: "center",
                      padding: "30px",
                    }}
                  >
                    No returns found.
                  </td>
                </tr>

              ) : (

                filteredReturns.map((item) => (

                  <tr key={item.id}>

                    <td>
                      <strong>
                        RET-
                        {String(item.id).padStart(
                          4,
                          "0"
                        )}
                      </strong>
                    </td>

                    <td>
                      #{item.sale}
                    </td>

                    <td>
                      Product #{item.product}
                    </td>

                    <td>
                      {item.quantity}
                    </td>

                    <td>
                      ₹
                      {Number(
                        item.refund_amount
                      ).toLocaleString("en-IN")}
                    </td>

                    <td>
                      {item.reason}
                    </td>

                    <td>

                      <span
                        className={
                          item.status ===
                          "completed"
                            ? "status-paid"
                            : item.status ===
                              "pending"
                            ? "status-pending"
                            : "status-low"
                        }
                      >
                        {item.status}
                      </span>

                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          title="View return"
                          onClick={() =>
                            viewReturn(item)
                          }
                        >
                          <Eye size={16} />
                        </button>

                        {item.status ===
                          "pending" && (
                          <>
                            <button
                              className="approve-button"
                              title="Approve return"
                              onClick={() =>
                                approveReturn(
                                  item.id
                                )
                              }
                            >
                              <Check size={16} />
                            </button>

                            <button
                              className="delete-button"
                              title="Reject return"
                              onClick={() =>
                                rejectReturn(
                                  item.id
                                )
                              }
                            >
                              <X size={16} />
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* NEW RETURN MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>New Product Return</h2>

                <p>
                  Create a new customer return.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                {/* SALE */}

                <div className="form-group">

                  <label>
                    Sale ID
                  </label>

                  <input
                    type="number"
                    name="sale"
                    value={form.sale}
                    onChange={handleChange}
                    placeholder="Enter sale ID"
                  />

                </div>

                {/* PRODUCT */}

                <div className="form-group">

                  <label>
                    Product ID
                  </label>

                  <input
                    type="number"
                    name="product"
                    value={form.product}
                    onChange={handleChange}
                    placeholder="Enter product ID"
                  />

                </div>

                {/* QUANTITY */}

                <div className="form-group">

                  <label>
                    Quantity
                  </label>

                  <input
                    type="number"
                    min="1"
                    name="quantity"
                    value={form.quantity}
                    onChange={handleChange}
                  />

                </div>

                {/* REFUND */}

                <div className="form-group">

                  <label>
                    Refund Amount
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="refund_amount"
                    value={
                      form.refund_amount
                    }
                    onChange={handleChange}
                    placeholder="Enter refund amount"
                  />

                </div>

                {/* REASON */}

                <div className="form-group">

                  <label>
                    Reason
                  </label>

                  <select
                    name="reason"
                    value={form.reason}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select reason
                    </option>

                    <option value="UNSEALED AND DAMAGED MATERIAL">
                      Unsealed and damaged
                      material
                    </option>

                    <option value="Damaged product">
                      Damaged product
                    </option>

                    <option value="Wrong product">
                      Wrong product
                    </option>

                    <option value="Wrong size">
                      Wrong size
                    </option>

                    <option value="Customer changed mind">
                      Customer changed mind
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

              </div>

              {/* MODAL BUTTONS */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  Create Return
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Returns;
