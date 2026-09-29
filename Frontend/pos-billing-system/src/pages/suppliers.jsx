
import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Truck,
} from "lucide-react";

import {
  getSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "../api/api";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  const [form, setForm] = useState({
    name: "",
    contact: "",
    email: "",
    address: "",
  });

  // =========================================================
  // LOAD SUPPLIERS FROM DJANGO
  // =========================================================

  const loadSuppliers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSuppliers();

      // Django REST Framework pagination support
      if (Array.isArray(data)) {
        setSuppliers(data);
      } else if (data && Array.isArray(data.results)) {
        setSuppliers(data.results);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      console.error("Failed to load suppliers:", err);
      setError("Unable to connect to the Django server.");
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    const fetchInitialSuppliers = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getSuppliers();

        if (cancelled) return;

        if (Array.isArray(data)) {
          setSuppliers(data);
        } else if (data && Array.isArray(data.results)) {
          setSuppliers(data.results);
        } else {
          setSuppliers([]);
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Failed to load suppliers:", err);
          setError("Unable to connect to the Django server.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchInitialSuppliers();

    return () => {
      cancelled = true;
    };
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchText = search.toLowerCase();

    return (
      String(supplier.name || "")
        .toLowerCase()
        .includes(searchText) ||
      String(supplier.email || "")
        .toLowerCase()
        .includes(searchText) ||
      String(supplier.contact || "")
        .toLowerCase()
        .includes(searchText) ||
      String(supplier.address || "")
        .toLowerCase()
        .includes(searchText)
    );
  });

  // =========================================================
  // ADD SUPPLIER
  // =========================================================

  const openAdd = () => {
    setEditingSupplier(null);

    setForm({
      name: "",
      contact: "",
      email: "",
      address: "",
    });

    setShowModal(true);
  };

  // =========================================================
  // EDIT SUPPLIER
  // =========================================================

  const openEdit = (supplier) => {
    setEditingSupplier(supplier);

    setForm({
      name: supplier.name || "",
      contact: supplier.contact || "",
      email: supplier.email || "",
      address: supplier.address || "",
    });

    setShowModal(true);
  };

  // =========================================================
  // FORM CHANGE
  // =========================================================

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================================================
  // CREATE / UPDATE
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.contact ||
      !form.email ||
      !form.address
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setError("");

      if (editingSupplier) {
        await updateSupplier(editingSupplier.id, form);
        alert("Supplier updated successfully.");
      } else {
        await createSupplier(form);
        alert("Supplier added successfully.");
      }

      setShowModal(false);

      setForm({
        name: "",
        contact: "",
        email: "",
        address: "",
      });

      setEditingSupplier(null);

      // Refresh table from Django database
      await loadSuppliers();
    } catch (err) {
      console.error("Supplier save error:", err);
      alert("Failed to save supplier.");
    }
  };

  // =========================================================
  // DELETE SUPPLIER
  // =========================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await deleteSupplier(id);

      alert("Supplier deleted successfully.");

      // Refresh table from Django database
      await loadSuppliers();
    } catch (err) {
      console.error("Supplier delete error:", err);
      alert("Failed to delete supplier.");
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="suppliers-page">

      <div className="page-header">

        <div>
          <h1>Supplier Management</h1>

          <p>
            Manage suppliers and their product relationships.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Supplier
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div
          style={{
            padding: "12px",
            marginBottom: "15px",
            background: "#fee2e2",
            color: "#b91c1c",
            borderRadius: "8px",
          }}
        >
          {error}
        </div>
      )}

      {/* SEARCH */}

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search suppliers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

        </div>

        <div className="product-count">

          <Truck size={18} />

          {filteredSuppliers.length} Suppliers

        </div>

      </div>

      {/* TABLE */}

      <div className="dashboard-card">

        <div className="table-container">

          {loading ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              Loading suppliers...
            </div>
          ) : filteredSuppliers.length === 0 ? (
            <div
              style={{
                padding: "30px",
                textAlign: "center",
              }}
            >
              No suppliers found.
            </div>
          ) : (
            <table>

              <thead>

                <tr>
                  <th>Supplier</th>
                  <th>Contact</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Products</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredSuppliers.map((supplier) => (

                  <tr key={supplier.id}>

                    <td>
                      <strong>
                        {supplier.name}
                      </strong>
                    </td>

                    <td>
                      {supplier.contact || "-"}
                    </td>

                    <td>
                      {supplier.email || "-"}
                    </td>

                    <td>
                      {supplier.address || "-"}
                    </td>

                    <td>
                      <span className="product-badge">
                        {supplier.products ?? 0}
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button
                          className="edit-button"
                          onClick={() =>
                            openEdit(supplier)
                          }
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          className="delete-button"
                          onClick={() =>
                            handleDelete(supplier.id)
                          }
                        >
                          <Trash2 size={16} />
                        </button>

                      </div>

                    </td>

                  </tr>

                ))}

              </tbody>

            </table>
          )}

        </div>

      </div>

      {/* MODAL */}

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingSupplier
                    ? "Edit Supplier"
                    : "Add Supplier"}
                </h2>

                <p>
                  Enter supplier information.
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

                <div className="form-group">

                  <label>
                    Supplier Name
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Supplier name"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Contact Number
                  </label>

                  <input
                    name="contact"
                    value={form.contact}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="supplier@example.com"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Address
                  </label>

                  <input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Supplier address"
                  />

                </div>

              </div>

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
                  {editingSupplier
                    ? "Update Supplier"
                    : "Add Supplier"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Suppliers;


