import { useState } from "react";
import {
  Search,
  Eye,
  Receipt,
  Download,
} from "lucide-react";

function Transactions() {
  const [search, setSearch] = useState("");

  const transactions = [
    {
      id: "TXN-1001",
      invoice: "INV-1001",
      customer: "Rahul Kumar",
      staff: "Admin User",
      amount: 2450,
      payment: "Cash",
      status: "Completed",
      date: "29 Sep 2026",
    },
    {
      id: "TXN-1002",
      invoice: "INV-1002",
      customer: "Anjali Menon",
      staff: "John Staff",
      amount: 3850,
      payment: "UPI",
      status: "Completed",
      date: "29 Sep 2026",
    },
    {
      id: "TXN-1003",
      invoice: "INV-1003",
      customer: "Vishnu Raj",
      staff: "John Staff",
      amount: 1250,
      payment: "Card",
      status: "Completed",
      date: "28 Sep 2026",
    },
    {
      id: "TXN-1004",
      invoice: "INV-1004",
      customer: "Arun Thomas",
      staff: "Admin User",
      amount: 5200,
      payment: "UPI",
      status: "Completed",
      date: "28 Sep 2026",
    },
    {
      id: "TXN-1005",
      invoice: "INV-1005",
      customer: "Meera Nair",
      staff: "John Staff",
      amount: 1800,
      payment: "Cash",
      status: "Refunded",
      date: "27 Sep 2026",
    },
  ];

  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.id
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.invoice
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      transaction.customer
        .toLowerCase()
        .includes(search.toLowerCase())
  );

  const viewTransaction = (transaction) => {
    alert(
      `Transaction Details\n\n` +
      `Transaction: ${transaction.id}\n` +
      `Invoice: ${transaction.invoice}\n` +
      `Customer: ${transaction.customer}\n` +
      `Staff: ${transaction.staff}\n` +
      `Amount: ₹${transaction.amount.toLocaleString("en-IN")}\n` +
      `Payment: ${transaction.payment}\n` +
      `Status: ${transaction.status}`
    );
  };

  return (
    <div className="transactions-page">


      <div className="page-header">

        <div>
          <h1>Transactions</h1>
          <p>
            View and manage all billing transactions.
          </p>
        </div>

        <button
          className="primary-button"
          onClick={() =>
            alert("Export feature will be connected to the backend.")
          }
        >
          <Download size={18} />
          Export
        </button>

      </div>


      <div className="products-toolbar">

        <div className="product-search">

          <Search size={18} />

          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        <div className="product-count">

          <Receipt size={18} />

          {filteredTransactions.length} Transactions

        </div>

      </div>



      <div className="dashboard-card">

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Transaction</th>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Staff</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>

            </thead>

            <tbody>

              {filteredTransactions.map(
                (transaction) => (

                  <tr key={transaction.id}>

                    <td>
                      <strong>
                        {transaction.id}
                      </strong>
                    </td>

                    <td>
                      {transaction.invoice}
                    </td>

                    <td>
                      {transaction.customer}
                    </td>

                    <td>
                      {transaction.staff}
                    </td>

                    <td>
                      <strong>
                        ₹
                        {transaction.amount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    <td>
                      <span className="payment-badge">
                        {transaction.payment}
                      </span>
                    </td>

                    <td>

                      <span
                        className={
                          transaction.status ===
                          "Completed"
                            ? "status-paid"
                            : "status-low"
                        }
                      >
                        {transaction.status}
                      </span>

                    </td>

                    <td>
                      {transaction.date}
                    </td>

                    <td>

                      <button
                        className="edit-button"
                        title="View transaction"
                        onClick={() =>
                          viewTransaction(
                            transaction
                          )
                        }
                      >
                        <Eye size={16} />
                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}
export default Transactions;