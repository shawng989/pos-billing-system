import { useState } from "react";
import {
  Search,
  Plus,
  Minus,
  Trash2,
  CreditCard,
  Banknote,
  Smartphone,
  Printer,
} from "lucide-react";

const products = [
  {
    id: 1,
    name: "Cotton Shirt",
    price: 850,
    stock: 24,
  },
  {
    id: 2,
    name: "Denim Jeans",
    price: 1500,
    stock: 12,
  },
  {
    id: 3,
    name: "Silk Saree",
    price: 3200,
    stock: 5,
  },
  {
    id: 4,
    name: "Cotton T-Shirt",
    price: 550,
    stock: 35,
  },
  {
    id: 5,
    name: "Formal Shirt",
    price: 1200,
    stock: 18,
  },
  {
    id: 6,
    name: "Ladies Kurti",
    price: 950,
    stock: 20,
  },
];

function Billing() {
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [discount, setDiscount] = useState(0);
  const [billCompleted, setBillCompleted] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    const existing = cart.find(
      (item) => item.id === product.id
    );

    if (existing) {
      setCart(
        cart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        )
      );
    } else {
      setCart([
        ...cart,
        {
          ...product,
          quantity: 1,
        },
      ]);
    }
  };

  const increaseQuantity = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      )
    );
  };

  const decreaseQuantity = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart(
      cart.filter((item) => item.id !== id)
    );
  };

  const subtotal = cart.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const tax = (subtotal - discount) * 0.05;

  const total = subtotal - discount + tax;

  const completePayment = () => {
    if (cart.length === 0) {
      alert("Please add products to the bill.");
      return;
    }

    setBillCompleted(true);
  };

  const printBill = () => {
    window.print();
  };

  const newBill = () => {
    setCart([]);
    setDiscount(0);
    setBillCompleted(false);
    setPaymentMethod("Cash");
  };

  return (
    <div className="billing-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Billing</h1>
          <p>Create and process customer bills.</p>
        </div>

        <div className="invoice-number">
          Invoice: <strong>#INV-1005</strong>
        </div>

      </div>

      <div className="billing-layout">

        {/* PRODUCTS */}

        <div className="billing-products">

          <div className="billing-card">

            <div className="billing-card-header">
              <h3>Select Products</h3>
              <span>
                {filteredProducts.length} products
              </span>
            </div>

            <div className="billing-search">

              <Search size={18} />

              <input
                type="text"
                placeholder="Search product..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

            </div>

            <div className="product-grid">

              {filteredProducts.map((product) => (

                <button
                  className="billing-product"
                  key={product.id}
                  onClick={() =>
                    addToCart(product)
                  }
                >

                  <div className="product-icon">
                    🛍️
                  </div>

                  <div className="billing-product-info">

                    <strong>
                      {product.name}
                    </strong>

                    <span>
                      ₹
                      {product.price.toLocaleString(
                        "en-IN"
                      )}
                    </span>

                    <small>
                      Stock: {product.stock}
                    </small>

                  </div>

                  <div className="add-product">
                    <Plus size={18} />
                  </div>

                </button>

              ))}

            </div>

          </div>

        </div>

        {/* BILL */}

        <div className="billing-cart">

          <div className="billing-card bill-card">

            <div className="billing-card-header">

              <div>
                <h3>Current Bill</h3>
                <span>
                  {cart.length} items
                </span>
              </div>

              {cart.length > 0 && (
                <button
                  className="clear-cart"
                  onClick={() => setCart([])}
                >
                  Clear
                </button>
              )}

            </div>

            <div className="cart-items">

              {cart.length === 0 ? (

                <div className="empty-cart">

                  <div className="empty-cart-icon">
                    🛒
                  </div>

                  <h3>Cart is empty</h3>

                  <p>
                    Select products to create a bill.
                  </p>

                </div>

              ) : (

                cart.map((item) => (

                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div className="cart-item-info">

                      <strong>
                        {item.name}
                      </strong>

                      <span>
                        ₹
                        {item.price.toLocaleString(
                          "en-IN"
                        )}
                      </span>

                    </div>

                    <div className="quantity-controls">

                      <button
                        onClick={() =>
                          decreaseQuantity(item.id)
                        }
                      >
                        <Minus size={14} />
                      </button>

                      <span>
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          increaseQuantity(item.id)
                        }
                      >
                        <Plus size={14} />
                      </button>

                    </div>

                    <strong>
                      ₹
                      {(
                        item.price *
                        item.quantity
                      ).toLocaleString("en-IN")}
                    </strong>

                    <button
                      className="remove-item"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>

                ))

              )}

            </div>

            {/* TOTALS */}

            <div className="bill-summary">

              <div>
                <span>Subtotal</span>
                <strong>
                  ₹{subtotal.toLocaleString("en-IN")}
                </strong>
              </div>

              <div className="discount-row">

                <span>Discount</span>

                <input
                  type="number"
                  min="0"
                  value={discount}
                  onChange={(e) =>
                    setDiscount(
                      Number(e.target.value)
                    )
                  }
                />

              </div>

              <div>
                <span>Tax (5%)</span>
                <strong>
                  ₹{tax.toFixed(2)}
                </strong>
              </div>

              <div className="total-row">
                <span>Total</span>
                <strong>
                  ₹{total.toFixed(2)}
                </strong>
              </div>

            </div>

            {/* PAYMENT */}

            <div className="payment-section">

              <h4>Payment Method</h4>

              <div className="payment-methods">

                <button
                  className={
                    paymentMethod === "Cash"
                      ? "payment-method active"
                      : "payment-method"
                  }
                  onClick={() =>
                    setPaymentMethod("Cash")
                  }
                >
                  <Banknote size={18} />
                  Cash
                </button>

                <button
                  className={
                    paymentMethod === "UPI"
                      ? "payment-method active"
                      : "payment-method"
                  }
                  onClick={() =>
                    setPaymentMethod("UPI")
                  }
                >
                  <Smartphone size={18} />
                  UPI
                </button>

                <button
                  className={
                    paymentMethod === "Card"
                      ? "payment-method active"
                      : "payment-method"
                  }
                  onClick={() =>
                    setPaymentMethod("Card")
                  }
                >
                  <CreditCard size={18} />
                  Card
                </button>

              </div>

            </div>

            {!billCompleted ? (

              <button
                className="complete-payment"
                onClick={completePayment}
              >
                Complete Payment ₹
                {total.toFixed(2)}
              </button>

            ) : (

              <div className="payment-success">

                <div className="success-icon">
                  ✓
                </div>

                <h3>Payment Successful</h3>

                <p>
                  Paid using {paymentMethod}
                </p>

                <div className="bill-actions">

                  <button
                    className="print-button"
                    onClick={printBill}
                  >
                    <Printer size={18} />
                    Print Bill
                  </button>

                  <button
                    className="new-bill-button"
                    onClick={newBill}
                  >
                    New Bill
                  </button>

                </div>

              </div>

            )}

          </div>

        </div>

      </div>

    </div>
  );
}

export default Billing;