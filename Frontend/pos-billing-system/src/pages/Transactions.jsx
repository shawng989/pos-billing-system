import { useEffect, useMemo, useState } from "react";
import { Search, Eye, Receipt, Download } from "lucide-react";
import { getTransactions } from "../api/api";

function Transactions() {
  const [transactions, setTransactions] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getTransactions()
      .then((data) => setTransactions(Array.isArray(data) ? data : data.results || []))
      .catch(() => alert("Unable to load transactions."));
  }, []);

  const filtered = useMemo(() => transactions.filter((t) =>
    `${t.transaction_id} ${t.payment_method} ${t.status}`.toLowerCase().includes(search.toLowerCase())
  ), [transactions, search]);

  const exportCsv = () => {
    const rows = [["Transaction", "Sale", "Amount", "Payment", "Status", "Date"]];
    filtered.forEach((t) => rows.push([t.transaction_id, t.sale, t.amount, t.payment_method, t.status, t.created_at]));
    const blob = new Blob([rows.map((r) => r.join(",")).join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob); const a = document.createElement("a");
    a.href = url; a.download = "transactions.csv"; a.click(); URL.revokeObjectURL(url);
  };

  return (
    <div className="transactions-page">
      <div className="page-header"><div><h1>Transactions</h1><p>Live billing transactions from the database.</p></div><button className="primary-button" onClick={exportCsv}><Download size={18} /> Export</button></div>
      <div className="products-toolbar"><div className="product-search"><Search size={18} /><input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} /></div><div className="product-count"><Receipt size={18} /> {filtered.length} Transactions</div></div>
      <div className="dashboard-card"><div className="table-container"><table><thead><tr><th>Transaction</th><th>Sale ID</th><th>Amount</th><th>Payment</th><th>Status</th><th>Date</th><th>Action</th></tr></thead>
        <tbody>{filtered.map((t) => <tr key={t.id}><td><strong>{t.transaction_id}</strong></td><td>{t.sale}</td><td>₹{Number(t.amount).toLocaleString("en-IN")}</td><td><span className="payment-badge">{t.payment_method}</span></td><td><span className={t.status === "paid" ? "status-paid" : "status-low"}>{t.status}</span></td><td>{new Date(t.created_at).toLocaleString("en-IN")}</td><td><button className="edit-button" onClick={() => alert(`Transaction ${t.transaction_id}\nAmount: ₹${t.amount}\nPayment: ${t.payment_method}\nStatus: ${t.status}`)}><Eye size={16} /></button></td></tr>)}</tbody>
      </table></div></div>
    </div>
  );
}
export default Transactions;
