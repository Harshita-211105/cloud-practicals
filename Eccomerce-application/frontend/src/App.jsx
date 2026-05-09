import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const API_URL = "http://localhost:8004";

  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");

  const fetchProducts = async () => {
    const res = await axios.get(`${API_URL}/products`);
    setProducts(res.data);
  };

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item._id === product._id);

    if (existingItem) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const totalAmount = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) {
      alert("Cart is empty.");
      return;
    }

    if (!customerName.trim() || !address.trim()) {
      alert("Please enter customer name and address.");
      return;
    }

    await axios.post(`${API_URL}/orders`, {
      customerName,
      address,
      products: cart.map((item) => ({
        name: item.name,
        price: item.price,
        quantity: item.quantity
      })),
      totalAmount
    });

    alert("Order placed successfully.");

    setCart([]);
    setCustomerName("");
    setAddress("");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="app">
      <nav className="navbar">
        <h2>CloudShop</h2>
        <p>Full Stack MERN E-Commerce Application</p>
      </nav>

      <section className="hero">
        <div>
          <span>Cloud Hosted Shopping Platform</span>
          <h1>Browse products and make purchases easily.</h1>
          <p>
            A sample e-commerce web application where users can view products,
            add items to cart and place orders stored in MongoDB Atlas.
          </p>
        </div>
      </section>

      <main className="main">
        <section className="products-section">
          <h2>Featured Products</h2>

          <div className="products-grid">
            {products.map((product) => (
              <div className="product-card" key={product._id}>
                <img src={product.image} alt={product.name} />

                <div className="product-content">
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>

                  <div className="product-bottom">
                    <strong>₹{product.price}</strong>
                    <button onClick={() => addToCart(product)}>
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <aside className="cart-section">
          <h2>Cart</h2>

          {cart.length === 0 ? (
            <div className="empty">No items added yet.</div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item._id}>
                <div>
                  <h4>{item.name}</h4>
                  <p>
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>

                <button onClick={() => removeFromCart(item._id)}>
                  Remove
                </button>
              </div>
            ))
          )}

          <div className="total-box">
            <span>Total</span>
            <strong>₹{totalAmount}</strong>
          </div>

          <input
            type="text"
            placeholder="Customer Name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <textarea
            placeholder="Delivery Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button className="checkout-btn" onClick={placeOrder}>
            Place Order
          </button>
        </aside>
      </main>
    </div>
  );
}

export default App;