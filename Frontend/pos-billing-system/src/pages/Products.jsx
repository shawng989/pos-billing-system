import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/api";

function Products() {

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    price: "",
    stock: "",
  });


  const loadProducts = async () => {

    try {

      setLoading(true);
      setError("");

      const data = await getProducts();


      if (Array.isArray(data)) {
        setProducts(data);
      } else if (data.results) {
        setProducts(data.results);
      } else {
        setProducts([]);
      }

    } catch (err) {

      console.error("Failed to load products:", err);

      setError(
        "Unable to connect to the Django server."
      );

    } finally {

      setLoading(false);
    }
  };

useEffect(() => {
    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getProducts();

            if (Array.isArray(data)) {
                setProducts(data);
            } else if (data.results) {
                setProducts(data.results);
            } else {
                setProducts([]);
            }
        } catch (err) {
            console.error("Failed to load products:", err);

            setError("Unable to connect to the Django server.");
        } finally {
            setLoading(false);
        }
    };

    fetchProducts();
}, []);

  const filteredProducts = products.filter((product) => {

    const searchText = search.toLowerCase();

    return (
      String(product.name || "")
        .toLowerCase()
        .includes(searchText) ||

      String(product.sku || "")
        .toLowerCase()
        .includes(searchText) ||

      String(product.category || "")
        .toLowerCase()
        .includes(searchText)
    );

  });

  const handleChange = (event) => {

    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

  };


  const openAddModal = () => {

    setEditingProduct(null);

    setFormData({
      name: "",
      sku: "",
      category: "",
      price: "",
      stock: "",
    });

    setShowModal(true);
  };

  const openEditModal = (product) => {

    setEditingProduct(product);

    setFormData({
      name: product.name || "",
      sku: product.sku || "",
      category: product.category || "",
      price: product.price || "",
      stock: product.stock || "",
    });

    setShowModal(true);
  };



  const handleSubmit = async (event) => {

    event.preventDefault();

    try {

      setError("");

      if (editingProduct) {

        await updateProduct(
          editingProduct.id,
          formData
        );

      } else {

        await createProduct(formData);

      }

      setShowModal(false);

      await loadProducts();

    } catch (err) {

      console.error(err);

      setError(
        "Unable to save product. Check your Product model fields."
      );
    }
  };


 

  const handleDelete = async (id) => {

    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {

      await deleteProduct(id);

      await loadProducts();

    } catch (err) {

      console.error(err);

      setError(
        "Unable to delete product."
      );
    }
  };



  return (
    <div
      style={{
        padding: "30px",
        background: "#f5f7fb",
        minHeight: "100vh",
      }}
    >

      

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "25px",
        }}
      >

        <div>

          <h1
            style={{
              margin: 0,
              color: "#172033",
              fontSize: "28px",
            }}
          >
            Products
          </h1>

          <p
            style={{
              color: "#7b8497",
              marginTop: "6px",
            }}
          >
            Manage your products and inventory
          </p>

        </div>


        <button
          onClick={openAddModal}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "12px 20px",
            borderRadius: "8px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          + Add Product
        </button>

      </div>



      {error && (

        <div
          style={{
            background: "#fee2e2",
            color: "#b91c1c",
            padding: "12px 15px",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          {error}
        </div>

      )}



      <div
        style={{
          background: "white",
          padding: "15px",
          borderRadius: "10px",
          marginBottom: "20px",
          border: "1px solid #e5e7eb",
        }}
      >

        <input
          type="text"
          placeholder="Search by product name, SKU or category..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          style={{
            width: "100%",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "7px",
            outline: "none",
            fontSize: "14px",
            boxSizing: "border-box",
          }}
        />

      </div>



      {loading && (

        <div
          style={{
            textAlign: "center",
            padding: "50px",
            color: "#64748b",
          }}
        >
          Loading products...
        </div>

      )}


      
      {!loading && (

        <div
          style={{
            background: "white",
            borderRadius: "12px",
            overflow: "hidden",
            border: "1px solid #e5e7eb",
          }}
        >

          <div
            style={{
              overflowX: "auto",
            }}
          >

            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >

              <thead>

                <tr
                  style={{
                    background: "#f8fafc",
                  }}
                >

                  <th style={thStyle}>
                    ID
                  </th>

                  <th style={thStyle}>
                    Product
                  </th>

                  <th style={thStyle}>
                    SKU
                  </th>

                  <th style={thStyle}>
                    Category
                  </th>

                  <th style={thStyle}>
                    Price
                  </th>

                  <th style={thStyle}>
                    Stock
                  </th>

                  <th style={thStyle}>
                    Actions
                  </th>

                </tr>

              </thead>


              <tbody>

                {filteredProducts.length === 0 ? (

                  <tr>

                    <td
                      colSpan="7"
                      style={{
                        textAlign: "center",
                        padding: "40px",
                        color: "#64748b",
                      }}
                    >
                      No products found.
                    </td>

                  </tr>

                ) : (

                  filteredProducts.map((product) => (

                    <tr
                      key={product.id}
                      style={{
                        borderTop:
                          "1px solid #eef0f3",
                      }}
                    >

                      <td style={tdStyle}>
                        {product.id}
                      </td>

                      <td
                        style={{
                          ...tdStyle,
                          fontWeight: "600",
                          color: "#172033",
                        }}
                      >
                        {product.name || "-"}
                      </td>

                      <td style={tdStyle}>
                        {product.sku || "-"}
                      </td>

                      <td style={tdStyle}>
                        {product.category || "-"}
                      </td>

                      <td style={tdStyle}>
                        ₹{product.price || "0"}
                      </td>

                      <td style={tdStyle}>
                        {product.stock ?? "0"}
                      </td>

                      <td style={tdStyle}>

                        <button
                          onClick={() =>
                            openEditModal(product)
                          }
                          style={{
                            marginRight: "8px",
                            padding: "7px 12px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#dbeafe",
                            color: "#1d4ed8",
                            cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>


                        <button
                          onClick={() =>
                            handleDelete(product.id)
                          }
                          style={{
                            padding: "7px 12px",
                            border: "none",
                            borderRadius: "6px",
                            background: "#fee2e2",
                            color: "#dc2626",
                            cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      )}



      {showModal && (

        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "20px",
          }}
        >

          <div
            style={{
              background: "white",
              width: "100%",
              maxWidth: "500px",
              borderRadius: "12px",
              padding: "25px",
              boxShadow:
                "0 20px 50px rgba(0,0,0,0.2)",
            }}
          >

            <h2
              style={{
                marginTop: 0,
                color: "#172033",
              }}
            >
              {editingProduct
                ? "Edit Product"
                : "Add Product"}
            </h2>


            <form onSubmit={handleSubmit}>

              <input
                name="name"
                placeholder="Product name"
                value={formData.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="sku"
                placeholder="SKU"
                value={formData.sku}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="category"
                placeholder="Category"
                value={formData.category}
                onChange={handleChange}
                style={inputStyle}
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={handleChange}
                required
                style={inputStyle}
              />

              <input
                name="stock"
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={handleChange}
                required
                style={inputStyle}
              />


              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >

                <button
                  type="submit"
                  style={{
                    flex: 1,
                    background: "#2563eb",
                    color: "white",
                    border: "none",
                    padding: "12px",
                    borderRadius: "7px",
                    cursor: "pointer",
                    fontWeight: "600",
                  }}
                >
                  {editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>


                <button
                  type="button"
                  onClick={() =>
                    setShowModal(false)
                  }
                  style={{
                    flex: 1,
                    background: "#e5e7eb",
                    color: "#374151",
                    border: "none",
                    padding: "12px",
                    borderRadius: "7px",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}




const thStyle = {
  textAlign: "left",
  padding: "14px 16px",
  fontSize: "13px",
  color: "#64748b",
  fontWeight: "600",
};


const tdStyle = {
  padding: "14px 16px",
  fontSize: "14px",
  color: "#475569",
};


const inputStyle = {
  width: "100%",
  padding: "11px",
  marginTop: "10px",
  border: "1px solid #d1d5db",
  borderRadius: "7px",
  boxSizing: "border-box",
  fontSize: "14px",
};

export default Products;