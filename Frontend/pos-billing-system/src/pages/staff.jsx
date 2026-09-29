import { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Users,
} from "lucide-react";

function Staff() {
  const [staff, setStaff] = useState([
    {
      id: 1,
      name: "Arun Kumar",
      email: "arun@pos.com",
      phone: "9876543210",
      role: "Cashier",
      status: "Active",
    },
    {
      id: 2,
      name: "Meera Nair",
      email: "meera@pos.com",
      phone: "9876543211",
      role: "Manager",
      status: "Active",
    },
    {
      id: 3,
      name: "Rahul Das",
      email: "rahul@pos.com",
      phone: "9876543212",
      role: "Cashier",
      status: "Inactive",
    },
  ]);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    role: "Cashier",
  });

  const filteredStaff = staff.filter(
    (person) =>
      person.name
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      person.email
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditingStaff(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      role: "Cashier",
    });

    setShowModal(true);
  };

  const openEdit = (person) => {
    setEditingStaff(person);

    setForm({
      name: person.name,
      email: person.email,
      phone: person.phone,
      role: person.role,
    });

    setShowModal(true);
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.phone) {
      alert("Please fill all fields.");
      return;
    }

    if (editingStaff) {
      setStaff(
        staff.map((person) =>
          person.id === editingStaff.id
            ? {
                ...person,
                ...form,
              }
            : person
        )
      );
    } else {
      setStaff([
        ...staff,
        {
          id: Date.now(),
          ...form,
          status: "Active",
        },
      ]);
    }

    setShowModal(false);
  };

  const deleteStaff = (id) => {
    if (window.confirm("Delete this staff member?")) {
      setStaff(
        staff.filter((person) => person.id !== id)
      );
    }
  };

  const toggleStatus = (id) => {
    setStaff(
      staff.map((person) =>
        person.id === id
          ? {
              ...person,
              status:
                person.status === "Active"
                  ? "Inactive"
                  : "Active",
            }
          : person
      )
    );
  };

  return (
    <div className="staff-page">

      <div className="page-header">
        <div>
          <h1>Staff Management</h1>
          <p>Manage staff accounts and access.</p>
        </div>

        <button
          className="primary-button"
          onClick={openAdd}
        >
          <Plus size={18} />
          Add Staff
        </button>
      </div>

      <div className="products-toolbar">

        <div className="product-search">
          <Search size={18} />

          <input
            type="text"
            placeholder="Search staff..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <div className="product-count">
          <Users size={18} />
          {filteredStaff.length} Staff
        </div>

      </div>

      <div className="dashboard-card">

        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Staff Member</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredStaff.map((person) => (

                <tr key={person.id}>

                  <td>
                    <strong>{person.name}</strong>
                  </td>

                  <td>{person.email}</td>

                  <td>{person.phone}</td>

                  <td>{person.role}</td>

                  <td>
                    <button
                      className={
                        person.status === "Active"
                          ? "status-paid"
                          : "status-low"
                      }
                      onClick={() =>
                        toggleStatus(person.id)
                      }
                    >
                      {person.status}
                    </button>
                  </td>

                  <td>
                    <div className="action-buttons">

                      <button
                        className="edit-button"
                        onClick={() =>
                          openEdit(person)
                        }
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        className="delete-button"
                        onClick={() =>
                          deleteStaff(person.id)
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

        </div>

      </div>

      {showModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingStaff
                    ? "Edit Staff"
                    : "Add Staff"}
                </h2>

                <p>
                  Manage staff account details.
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
                  <label>Name</label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Staff name"
                  />
                </div>

                <div className="form-group">
                  <label>Email</label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="staff@example.com"
                  />
                </div>

                <div className="form-group">
                  <label>Phone</label>

                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                  />
                </div>

                <div className="form-group">
                  <label>Role</label>

                  <select
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option>Cashier</option>
                    <option>Manager</option>
                    <option>Admin</option>
                  </select>
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
                  {editingStaff
                    ? "Update Staff"
                    : "Add Staff"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Staff;