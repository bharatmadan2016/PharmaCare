import React, { useState } from "react";
import { Lock, Package2, ShoppingCart, Trash2, IndianRupee, CheckCircle, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import BackButton from "../Layout/BackButton.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { getStoredUser } from "../../services/auth.service.js";
import { placeOrder } from "../../services/pharmacy.service.js";

export default function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalAmount } = useCart();
  const user = getStoredUser();
  const isCustomerLoggedIn = Boolean(user && (user.role === "User" || user.role === "Customer"));
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const handleCheckout = async () => {
    if (!isCustomerLoggedIn) {
      navigate("/signin");
      return;
    }

    if (cartItems.length === 0) return;

    setIsOrdering(true);
    try {
      // Group items by pharmacy to create separate orders if necessary, 
      // or just send one bulk order if backend supports it.
      // Current backend createOrder expects items and pharmacyId.
      // For simplicity, we'll assume one pharmacy at a time or the first pharmacy's ID.
      const pharmacyId = cartItems[0].pharmacyId;
      
      const orderData = {
        customerId: user._id,
        pharmacyId: pharmacyId,
        items: cartItems.map(item => ({
          productId: item._id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: totalAmount,
        paymentMethod: "Cash on Delivery"
      };

      await placeOrder(orderData);
      setOrderSuccess(true);
      clearCart();
    } catch (err) {
      console.error("Checkout failed", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsOrdering(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-[#F0FDF4] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl max-w-lg border border-emerald-100 italic">
          <div className="flex h-24 w-24 mx-auto items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-8">
            <CheckCircle size={48} />
          </div>
          <h1 className="text-4xl font-black text-slate-800 mb-4 tracking-tight">Order Confirmed!</h1>
          <p className="text-slate-500 font-bold text-lg leading-relaxed mb-4">
            Thank you for choosing PharmaCare. Your medicine order has been sent to the pharmacy and is being prepared for delivery.
          </p>
          <div className="mb-10 p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold">
             Payment Method: <span className="font-black">Cash on Delivery (COD)</span>
          </div>
          <button 
            onClick={() => navigate("/")}
            className="w-full bg-emerald-600 text-white font-black py-5 rounded-2xl text-xl shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-3"
          >
            Go Back Home <ArrowRight size={24} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <PharmaHeader activePage="cart" cartCount={cartItems.length} showCustomerMenu={isCustomerLoggedIn} />

      <main className="mx-auto max-w-7xl px-6 py-12">
        <BackButton label="Continue Shopping" onClick={() => navigate("/")} />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-4 mb-8">
              <div className="h-16 w-16 flex items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xl">
                <ShoppingCart size={32} />
              </div>
              <div>
                <h1 className="text-5xl font-black text-slate-800 tracking-tight">Your Cart</h1>
                <p className="text-slate-500 font-bold text-lg">{cartItems.length} items ready for checkout</p>
              </div>
            </div>

            {cartItems.length > 0 ? (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={`${item._id}-${item.pharmacyId}`} className="group relative bg-white p-6 rounded-3xl shadow-md border border-slate-100 flex items-center gap-6 transition hover:shadow-xl">
                    <div className="h-20 w-20 flex-shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600 font-black text-2xl border border-slate-100">
                      {item.name.charAt(0)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-black text-xl text-slate-800">{item.name}</h3>
                      <p className="text-sm text-emerald-600 font-black uppercase tracking-widest">{item.pharmacyName}</p>
                      <div className="mt-2 flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item._id, item.pharmacyId, -1)}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white transition text-slate-600 font-black"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-black text-slate-800">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item._id, item.pharmacyId, 1)}
                            className="h-8 w-8 flex items-center justify-center rounded-md hover:bg-white transition text-slate-600 font-black"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-slate-300">|</span>
                        <span className="text-emerald-700 font-black flex items-center gap-0.5">
                          <IndianRupee size={16} />{item.price} each
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-black text-slate-900 flex items-center justify-end">
                        <IndianRupee size={22} />{item.price * item.quantity}
                      </p>
                      <button 
                        onClick={() => removeFromCart(item._id, item.pharmacyId)}
                        className="mt-2 text-rose-500 hover:text-rose-700 transition p-2 rounded-lg hover:bg-rose-50"
                        title="Remove from cart"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                ))}
                
                <button 
                  onClick={clearCart}
                  className="text-slate-400 font-bold hover:text-rose-500 transition-colors px-4 py-2"
                >
                  Clear All Items
                </button>
              </div>
            ) : (
              <div className="p-16 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                  <Package2 size={64} className="mx-auto text-slate-200 mb-6" />
                  <h2 className="text-3xl font-black text-slate-800 mb-4">Cart is Feeling Light</h2>
                  <p className="text-slate-400 font-medium text-lg mb-8">Browse pharmacies near you to find the best medicine deals.</p>
                  <button 
                    onClick={() => navigate("/")}
                    className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black shadow-lg hover:bg-slate-800 transition"
                  >
                    Start Shopping
                  </button>
              </div>
            )}
          </section>

          {/* Checkout sidebar */}
          <section>
            <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl sticky top-32">
              <h2 className="text-3xl font-black mb-10 tracking-tight">Summary</h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between text-slate-400 font-bold">
                  <span>Subtotal</span>
                  <span className="text-white flex items-center"><IndianRupee size={14} />{totalAmount}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold">
                  <span>Delivery Fee</span>
                  <span className="text-emerald-400 font-black">FREE</span>
                </div>
                <div className="h-px bg-slate-800 my-6"></div>
                <div className="flex justify-between text-xl font-black">
                  <span>Total</span>
                  <span className="flex items-center text-emerald-400"><IndianRupee size={22} />{totalAmount}</span>
                </div>
              </div>

              {!isCustomerLoggedIn && (
                 <div className="mb-8 p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-bold flex items-start gap-3">
                   <Lock size={20} className="shrink-0" />
                   Please login with a customer account to place this order.
                 </div>
              )}

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0 || isOrdering}
                className="w-full bg-emerald-500 text-slate-900 font-black py-5 rounded-2xl text-xl shadow-lg hover:bg-emerald-400 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {isOrdering ? "Processing..." : "Place Order"}
              </button>

              <p className="mt-6 text-center text-xs text-slate-500 font-medium">
                By placing an order, you agree to PharmaCare's Terms of Service and Privacy Policy.
              </p>
            </div>
          </section>
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
