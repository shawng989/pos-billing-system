import { useEffect, useState } from "react";
import { Search, BookOpen, Plus, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { createLedgerEntry, getLedgerEntries } from "../api/api";

function Ledger() {
  const [entries, setEntries] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ entry_type: "income", description: "", amount: "" });

  const load = async () => {
    try {
      const data = await getLedgerEntries();
      setEntries(Array.isArray(data) ? data : data.results || []);
    } catch (err) {
      alert("Unable to load ledger. Start the backend.");
    }
  };
  useEffect(() => { load(); }, []);

  const filtered = entries.filter((e) =>
    `${e.description} ${e.entry_type}`.toLowerCase().includes(search.toLowerCase())
  );
  const credit = entries.filter((e) => e.entry_type === "income").reduce((s, e) => s + Number(e.amount), 0);
  const debit = entries.filter((e) => e.entry_type === "expense").reduce((s, e) => s + Number(e.amount), 0);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount) return alert("Fill all fields.");
    try {
      await createLedgerEntry({ ...form, amount: Number(form.amount) });
      setForm({ entry_type: "income", description: "", amount: "" });
      setShowForm(false);
      load();
    } catch (err) {
      alert(err.message || "Unable to create entry.");
    }
  };

  return (
    <div className="ledger-page">
      <div className="page-header">
        <div><h1>Ledger</h1><p>Track sales, refunds and business expenses.</p></div>
        <button className="primary-button" onClick={() => setShowForm(true)}><Plus size={18} /> Add Entry</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card"><div className="stat-icon"><ArrowUpCircle size={22} /></div><div><span>Total Credit</span><h2>₹{credit.toLocaleString("en-IN")}</h2><small>Money received</small></div></div>
        <div className="stat-card"><div className="stat-icon"><ArrowDownCircle size={22} /></div><div><span>Total Debit</span><h2>₹{debit.toLocaleString("en-IN")}</h2><small>Money spent/refunded</small></div></div>
        <div className="stat-card"><div className="stat-icon"><BookOpen size={22} /></div><div><span>Current Balance</span><h2>₹{(credit - debit).toLocaleString("en-IN")}</h2><small>Net ledger balance</small></div></div>
      </div>

      <div className="products-toolbar">
        <div className="product-search"><Search size={18} /><input placeholder="Search ledger..." value={search} onChange={(e) => setSearch(e.target.value)} /></div>
        <div className="product-count"><BookOpen size={18} /> {filtered.length} Entries</div>
      </div>

      <div className="dashboard-card"><div className="table-container">
        <table><thead><tr><th>Date</th><th>Description</th><th>Type</th><th>Amount</th></tr></thead>
        <tbody>{filtered.map((e) => <tr key={e.id}><td>{new Date(e.created_at).toLocaleDateString("en-IN")}</td><td><strong>{e.description}</strong></td><td><span className={e.entry_type === "income" ? "status-paid" : "status-low"}>{e.entry_type}</span></td><td><strong>{e.entry_type === "income" ? "+" : "-"} ₹{Number(e.amount).toLocaleString("en-IN")}</strong></td></tr>)}</tbody></table>
      </div></div>

      {showForm && <div className="modal-overlay"><div className="modal">
        <div className="modal-header"><div><h2>Add Ledger Entry</h2><p>Record income or expense.</p></div><button className="modal-close" onClick={() => setShowForm(false)}>×</button></div>
        <form onSubmit={submit}><div className="form-grid">
          <div className="form-group"><label>Type</label><select value={form.entry_type} onChange={(e) => setForm({ ...form, entry_type: e.target.value })}><option value="income">Income</option><option value="expense">Expense</option></select></div>
          <div className="form-group"><label>Amount</label><input type="number" min="0" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} /></div>
          <div className="form-group"><label>Description</label><input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
        </div><div className="modal-actions"><button type="button" className="cancel-button" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-button">Save Entry</button></div></form>
      </div></div>}
    </div>
  );
}
export default Ledger;
