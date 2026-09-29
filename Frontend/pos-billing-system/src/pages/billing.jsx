import { useEffect, useMemo, useState } from "react";
import {
  Search, Plus, Minus, Trash2, CreditCard, Banknote, Smartphone, Printer,
} from "lucide-react";
import { createSale, getProducts } from "../api/api";

const makeInvoice = () => `INV-${Date.now().toString().slice(-8)}`;

function Billing() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [discount, setDiscount] = useState(0);
  const [invoice, setInvoice] = useState(makeInvoice());
  const [billCompleted, setBillCompleted] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(Array.isArray(data) ? data : data.results || []);
    } catch {
      setError("Unable to load products. Start the Django server first.");
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const filteredProducts = products.filter((p) =>
    p.is_active !== false &&
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (product) => {
    if (product.stock <= 0) return alert("This product is out of stock.");
    setCart((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert("No more stock available.");
          return current;
        }
        return current.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
  };

  const changeQuantity = (id, delta) => {
    setCart((current) =>
      current
        .map((item) => {
          if (item.id !== id) return item;
          const next = item.quantity + delta;
          if (next > item.stock) {
            alert("Quantity cannot exceed available stock.");
            return item;
          }
          return { ...item, quantity: next };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const subtotal = useMemo(
    () => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0),
    [cart]
  );
  const safeDiscount = Math.min(Math.max(Number(discount) || 0, 0), subtotal);
  const tax = (subtotal - safeDiscount) * 0.05;
  const total = subtotal - safeDiscount + tax;

  const completePayment = async () => {
    if (!cart.length) return alert("Please add products to the bill.");
    setSaving(true);
    setError("");

    try {
      await createSale({
        invoice_number: invoice,
        customer_name: "Walk-in Customer",
        staff: null,
        subtotal: subtotal.toFixed(2),
        tax: tax.toFixed(2),
        discount: safeDiscount.toFixed(2),
        total: total.toFixed(2),
        payment_method: paymentMethod,
        items: cart.map((item) => ({
          product: item.id,
          quantity: item.quantity,
          price: item.price,
          subtotal: (Number(item.price) * item.quantity).toFixed(2),
        })),
      });
      setBillCompleted(true);
      await loadProducts();
    } catch (err) {
      setError(err.message || "Unable to complete payment.");
    } finally {
      setSaving(false);
    }
  };

  const newBill = () => {
    setCart([]);
    setDiscount(0);
    setBillCompleted(false);
    setPaymentMethod("cash");
    setInvoice(makeInvoice());
    setError("");
  };

  return (
    <div className="billing-page">
      <div className="page-header">
        <div>
          <h1>Billing</h1>
          <p>Create, pay and print customer bills.</p>
        </div>
        <div className="invoice-number">Invoice: <strong>#{invoice}</strong></div>
      </div>

      {error && <div className="api-error">{error}</div>}

      <div className="billing-layout">
        <div className="billing-products">
          <div className="billing-card">
            <div className="billing-card-header">
              <h3>Select Products</h3>
              <span>{filteredProducts.length} products</span>
            </div>
            <div className="billing-search">
              <Search size={18} />
              <input
                placeholder="Search product..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <button
                  className="billing-product"
                  key={product.id}
                  onClick={() => addToCart(product)}
                  disabled={product.stock <= 0}
                >
                  <div className="product-icon">🛍️</div>
                  <div className="billing-product-info">
                    <strong>{product.name}</strong>
                    <span>₹{Number(product.price).toLocaleString("en-IN")}</span>
                    <small>Stock: {product.stock}</small>
                  </div>
                  <div className="add-product"><Plus size={18} /></div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="billing-cart">
          <div className="billing-card bill-card">
            <div className="billing-card-header">
              <div><h3>Current Bill</h3><span>{cart.length} items</span></div>
              {cart.length > 0 && <button className="clear-cart" onClick={() => setCart([])}>Clear</button>}
            </div>

            <div className="cart-items">
              {!cart.length ? (
                <div className="empty-cart"><div className="empty-cart-icon">🛒</div><h3>Cart is empty</h3><p>Select products to create a bill.</p></div>
              ) : cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    <span>₹{Number(item.price).toLocaleString("en-IN")}</span>
                  </div>
                  <div className="quantity-controls">
                    <button onClick={() => changeQuantity(item.id, -1)}><Minus size={14} /></button>
                    <span>{item.quantity}</span>
                    <button onClick={() => changeQuantity(item.id, 1)}><Plus size={14} /></button>
                  </div>
                  <strong>₹{(Number(item.price) * item.quantity).toLocaleString("en-IN")}</strong>
                  <button className="remove-item" onClick={() => setCart(cart.filter((x) => x.id !== item.id))}><Trash2 size={16} /></button>
                </div>
              ))}
            </div>

            <div className="bill-summary">
              <div><span>Subtotal</span><strong>₹{subtotal.toFixed(2)}</strong></div>
              <div className="discount-row"><span>Discount</span><input type="number" min="0" max={subtotal} value={discount} onChange={(e) => setDiscount(e.target.value)} /></div>
              <div><span>Tax (5%)</span><strong>₹{tax.toFixed(2)}</strong></div>
              <div className="total-row"><span>Total</span><strong>₹{total.toFixed(2)}</strong></div>
            </div>

            {!billCompleted ? (
              <>
                <div className="payment-section">
                  <h4>Payment Method</h4>
                  <div className="payment-methods">
                    {[
                      ["cash", "Cash", Banknote],
                      ["upi", "UPI", Smartphone],
                      ["card", "Card", CreditCard],
                    ].map(([value, label, Icon]) => (
                      <button
                        key={value}
                        className={paymentMethod === value ? "payment-method active" : "payment-method"}
                        onClick={() => setPaymentMethod(value)}
                      >
                        <Icon size={18} /> {label}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="complete-payment" onClick={completePayment} disabled={saving}>
                  {saving ? "Processing..." : `Complete Payment ₹${total.toFixed(2)}`}
                </button>
              </>
            ) : (
              <div className="payment-success">
                <div className="success-icon">✓</div>
                <h3>Payment Successful</h3>
                <p>Invoice {invoice} • Paid using {paymentMethod.toUpperCase()}</p>
                <div className="bill-actions">
                  <button className="print-button" onClick={() => window.print()}><Printer size={18} /> Print Bill</button>
                  <button className="new-bill-button" onClick={newBill}>New Bill</button>
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
