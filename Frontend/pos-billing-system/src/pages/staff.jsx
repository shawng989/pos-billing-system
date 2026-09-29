import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, X, Users } from "lucide-react";
import { getStaff, createStaff, updateStaff, deleteStaff } from "../api/api";

const roleLabels = { admin: "Admin", manager: "Manager", cashier: "Cashier", staff: "Staff" };

function Staff() {
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "cashier", is_active: true });

  const load = async () => {
    const data = await getStaff();
    setStaff(Array.isArray(data) ? data : data.results || []);
  };
  useEffect(() => { load().catch(() => alert("Unable to load staff.")); }, []);

  const filtered = staff.filter((p) =>
    `${p.name} ${p.email} ${p.phone}`.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", role: "cashier", is_active: true });
    setShowModal(true);
  };

  const openEdit = (person) => {
    setEditing(person);
    setForm({ name: person.name || "", email: person.email || "", phone: person.phone || "", role: person.role || "staff", is_active: person.is_active !== false });
    setShowModal(true);
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name is required.");
    try {
      if (editing) await updateStaff(editing.id, form);
      else await createStaff(form);
      setShowModal(false);
      load();
    } catch (err) {
      alert(err.message || "Unable to save staff.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    await deleteStaff(id);
    load();
  };

  const toggle = async (person) => {
    await updateStaff(person.id, { ...person, is_active: !person.is_active });
    load();
  };

  return (
    <div className="staff-page">
      <div className="page-header"><div><h1>Staff Management</h1><p>Manage staff accounts and access roles.</p></div><button className="primary-button" onClick={openAdd}><Plus size={18} /> Add Staff</button></div>
      <div className="products-toolbar"><div className="product-search"><Search size={18} /><input placeholder="Search staff..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="product-count"><Users size={18} /> {filtered.length} Staff</div></div>
      <div className="dashboard-card"><div className="table-container"><table><thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Role</th><th>Status</th><th>Actions</th></tr></thead>
      <tbody>{filtered.map((p) => <tr key={p.id}><td><strong>{p.name}</strong></td><td>{p.email || "-"}</td><td>{p.phone || "-"}</td><td>{roleLabels[p.role] || p.role}</td><td><button className={p.is_active ? "status-paid" : "status-low"} onClick={() => toggle(p)}>{p.is_active ? "Active" : "Inactive"}</button></td><td><div className="action-buttons"><button className="edit-button" onClick={() => openEdit(p)}><Edit size={16} /></button><button className="delete-button" onClick={() => remove(p.id)}><Trash2 size={16} /></button></div></td></tr>)}</tbody>
      </table></div></div>

      {showModal && <div className="modal-overlay"><div className="modal"><div className="modal-header"><div><h2>{editing ? "Edit Staff" : "Add Staff"}</h2><p>Enter staff account details.</p></div><button className="modal-close" onClick={() => setShowModal(false)}><X size={20} /></button></div>
        <form onSubmit={submit}><div className="form-grid">
          <div className="form-group"><label>Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="form-group"><label>Email</label><input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="form-group"><label>Phone</label><input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="form-group"><label>Role</label><select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}><option value="cashier">Cashier</option><option value="manager">Manager</option><option value="staff">Staff</option><option value="admin">Admin</option></select></div>
        </div><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowModal(false)}>Cancel</button><button className="primary-button">{editing ? "Update Staff" : "Add Staff"}</button></div></form>
      </div></div>}
    </div>
  );
}
export default Staff;
