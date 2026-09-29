import { useState } from "react";
import {
  Search,
  BookOpen,
  Plus,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";

function Ledger() {
  const [search, setSearch] = useState("");

  const ledgerEntries = [
    {
      id: 1,
      date: "29 Sep 2026",
      reference: "INV-1001",
      description: "Sale - Cotton Shirt",
      type: "Credit",
      category: "Sales",
      amount: 2450,
    },
    {
      id: 2,
      date: "29 Sep 2026",
      reference: "PUR-2001",
      description: "Purchase from Kerala Textiles",
      type: "Debit",
      category: "Purchase",
      amount: 12000,
    },
    {
      id: 3,
      date: "29 Sep 2026",
      reference: "INV-1002",
      description: "Sale - Denim Jeans",
      type: "Credit",
      category: "Sales",
      amount: 3850,
    },
    {
      id: 4,
      date: "28 Sep 2026",
      reference: "EXP-3001",
      description: "Shop Electricity Bill",
      type: "Debit",
      category: "Expense",
      amount: 3200,
    },
    {
      id: 5,
      date: "28 Sep 2026",
      reference: "INV-1003",
      description: "Sale - Silk Saree",
      type: "Credit",
      category: "Sales",
      amount: 5200,
    },
    {
      id: 6,
      date: "27 Sep 2026",
      reference: "PUR-2002",
      description: "Purchase from Fashion Fabrics",
      type: "Debit",
      category: "Purchase",
      amount: 8500,
    },
  ];

  const filteredEntries = ledgerEntries.filter(
    (entry) =>
      entry.reference
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      entry.description
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      entry.category
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const totalCredit = ledgerEntries
    .filter((entry) => entry.type === "Credit")
    .reduce((total, entry) => total + entry.amount, 0);

  const totalDebit = ledgerEntries
    .filter((entry) => entry.type === "Debit")
    .reduce((total, entry) => total + entry.amount, 0);

  const balance = totalCredit - totalDebit;

  return (
    <div className="ledger-page">



      <div className="page-header">

        <div>
          <h1>Ledger</h1>
          <p>
            Track sales, purchases and business expenses.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            alert(
              "New ledger entry will be connected to the backend."
            )
          }
        >
          <Plus size={18} />
          Add Entry
        </button>

      </div>

  

      <div className="stats-grid">

        <div className="stat-card">

          <div className="stat-icon">
            <ArrowUpCircle size={22} />
          </div>

          <div>
            <span>Total Credit</span>

            <h2>
              ₹{totalCredit.toLocaleString("en-IN")}
            </h2>

            <small>Money received</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <ArrowDownCircle size={22} />
          </div>

          <div>
            <span>Total Debit</span>

            <h2>
              ₹{totalDebit.toLocaleString("en-IN")}
            </h2>

            <small>Money spent</small>
          </div>

        </div>

        <div className="stat-card">

          <div className="stat-icon">
            <BookOpen size={22} />
          </div>

          <div>
            <span>Current Balance</span>

            <h2>
              ₹{balance.toLocaleString("en-IN")}
            </h2>

            <small>Net ledger balance</small>
          </div>

        </div>

      </div>

     

      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search ledger..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="product-count">

          <BookOpen size={18} />

          {filteredEntries.length} Entries

        </div>

      </div>

   

      <div className="dashboard-card">

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>

            </thead>

            <tbody>

              {filteredEntries.map((entry) => (

                <tr key={entry.id}>

                  <td>{entry.date}</td>

                  <td>
                    <strong>
                      {entry.reference}
                    </strong>
                  </td>

                  <td>
                    {entry.description}
                  </td>

                  <td>
                    <span className="payment-badge">
                      {entry.category}
                    </span>
                  </td>

                  <td>

                    <span
                      className={
                        entry.type === "Credit"
                          ? "status-paid"
                          : "status-low"
                      }
                    >
                      {entry.type}
                    </span>

                  </td>

                  <td>

                    <strong>
                      {entry.type === "Credit"
                        ? "+"
                        : "-"}{" "}
                      ₹
                      {entry.amount.toLocaleString(
                        "en-IN"
                      )}
                    </strong>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
export default Ledger;