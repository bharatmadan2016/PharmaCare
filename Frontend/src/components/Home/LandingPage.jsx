import React, { useState, useEffect } from "react";
import { MapPin, Search, Sparkles, Navigation, ShoppingBag, Info, IndianRupee } from "lucide-react";
import PharmaHeader from "../Layout/PharmaHeader.jsx";
import PharmaFooter from "../Layout/PharmaFooter.jsx";
import { useLocation } from "../../context/LocationContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import { fetchNearbyPharmacies, compareMedicinePrices } from "../../services/pharmacy.service.js";

export default function LandingPage() {
  const { location, error: locError, loading: locLoading, detectLocation } = useLocation();
  const { addToCart, cartItems } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [pharmacies, setPharmacies] = useState([]);
  const [comparisonResults, setComparisonResults] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (location) {
      loadNearby();
    }
  }, [location]);

  const loadNearby = async () => {
    if (!location) return;
    console.log("Loading nearby pharmacies for:", location);
    try {
      const data = await fetchNearbyPharmacies(location.longitude, location.latitude, 50000); 
      console.log("Nearby pharmacies results (unwrapped):", data);
      // data is already the array of pharmacies because handleResponse returns body.data
      setPharmacies(data || []);
    } catch (err) {
      console.error("Failed to load pharmacies", err);
      setPharmacies([]);
    }
  };

  const handleSearch = async (queryOverride) => {
    const finalSearch = queryOverride || searchTerm;
    if (!finalSearch) {
      setComparisonResults([]);
      return;
    }
    console.log("Searching for medicine:", finalSearch, "at location:", location);
    setIsSearching(true);
    setComparisonResults([]); 
    try {
      const data = await compareMedicinePrices(finalSearch, location?.longitude, location?.latitude);
      console.log("Search results received (unwrapped):", data);
      setComparisonResults(data || []);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setIsSearching(false);
    }
  };

  const filteredComparison = comparisonResults.filter(
    item => item.price >= minPrice && item.price <= maxPrice
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <PharmaHeader activePage="home" cartCount={cartItems.length} />

      <main className="mx-auto flex max-w-7xl flex-col gap-10 px-6 py-12">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-[3rem] bg-gradient-to-br from-[#06C48D] to-[#047857] p-12 text-white shadow-2xl">
          <div className="relative z-10 max-w-3xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-2 text-sm font-bold uppercase tracking-wider">
              <Sparkles size={18} className="text-yellow-300" />
              Smart Health Search
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
              Medicines delivered <br />
              <span className="text-emerald-200">from your neighborhood.</span>
            </h1>
            <p className="max-w-xl text-lg text-emerald-50 leading-relaxed mb-10">
              Get real-time prices from pharmacies near you. Compare, save, and stay healthy with PharmaCare's hyper-local delivery network.
            </p>
            
            <button
              onClick={detectLocation}
              disabled={locLoading}
              className="inline-flex items-center gap-3 rounded-2xl bg-white px-8 py-5 text-lg font-bold text-emerald-800 shadow-2xl transition hover:scale-105 active:scale-95 disabled:opacity-70"
            >
              <Navigation size={22} className={locLoading ? "animate-spin" : ""} />
              {location ? "Location Verified" : "Auto-detect My Location"}
            </button>
            
            {location && (
              <p className="mt-4 text-emerald-100 flex items-center gap-2 font-medium">
                <MapPin size={16} /> 
                Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
              </p>
            )}

            {locError && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-400/50 text-red-100 flex items-center gap-2 text-sm font-bold">
                <Info size={16} />
                {locError}
              </div>
            )}
          </div>
          {/* Decorative shapes */}
          <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full bg-white/10 blur-3xl"></div>
          <div className="absolute -bottom-20 right-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-2xl"></div>
        </section>

        {/* Search & Compare Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-2 space-y-6">
            <div className="rounded-[2.5rem] bg-white p-10 shadow-xl border border-slate-100">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-14 w-14 flex items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <Search size={28} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-slate-800 tracking-tight">Price Comparison</h3>
                  <p className="text-slate-500 font-medium">Find the lowest price for any medicine</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search medicine (e.g. Paracetamol)..."
                    className="w-full bg-slate-50 rounded-2xl border-2 border-transparent focus:border-emerald-500 focus:bg-white px-14 py-5 text-lg outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => handleSearch()}
                  className="rounded-2xl bg-emerald-600 px-10 py-5 text-lg font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Try searching:</span>
                {['Paracetamol', 'Azithromycin', 'Ibuprofen'].map(suggest => (
                  <button 
                    key={suggest}
                    onClick={() => { setSearchTerm(suggest); handleSearch(suggest); }}
                    className="text-xs font-bold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 transition"
                  >
                    {suggest}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display */}
            {searchTerm && (
              <div className="space-y-4">
                <h4 className="text-xl font-bold flex items-center gap-2">
                  Results for "{searchTerm}" 
                  <span className="text-slate-400 text-sm font-medium">({filteredComparison.length} found)</span>
                </h4>
                
                {filteredComparison.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredComparison.map((item, idx) => (
                      <div key={item._id} className={`p-6 rounded-3xl bg-white border-2 transition-all ${idx === 0 ? 'border-emerald-500 shadow-emerald-50 ring-4 ring-emerald-50' : 'border-slate-100 shadow-md'}`}>
                        {idx === 0 && (
                          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-black text-white uppercase tracking-widest">
                            Best Deal
                          </div>
                        )}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h5 className="font-bold text-xl text-slate-800">{item.name}</h5>
                            <p className="text-sm text-emerald-600 font-bold flex items-center gap-1">
                              <MapPin size={14} /> {item.vendorId?.pharmacyName}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-black text-slate-900 flex items-center justify-end">
                              <IndianRupee size={20} />{item.price}
                            </p>
                            <p className="text-xs text-slate-400 font-medium">{item.category}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => addToCart(item, item.vendorId)}
                          className="w-full py-4 rounded-xl font-bold transition bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white flex items-center justify-center gap-2"
                        >
                          <ShoppingBag size={18} />
                          Add to Order
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-12 text-center rounded-[3rem] bg-slate-100 border-2 border-dashed border-slate-200">
                    <Info className="mx-auto text-slate-400 mb-4" size={48} />
                    <p className="text-slate-500 font-bold text-lg">No matches found within your filters.</p>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Filters Sidebar */}
          <section className="space-y-8">
            <div className="rounded-[2.5rem] bg-slate-900 p-8 text-white shadow-2xl">
              <h3 className="text-2xl font-black mb-8 tracking-tight">Filters</h3>
              
              <div className="space-y-10">
                <div>
                  <label className="text-sm font-black text-slate-400 uppercase tracking-widest block mb-4">Price Range (₹)</label>
                  <div className="flex justify-between text-lg font-black mb-2">
                    <span>₹{minPrice}</span>
                    <span>₹{maxPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="50"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(parseInt(e.target.value))}
                    className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                  />
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                  <p className="text-xs text-slate-400 leading-relaxed font-medium">
                    Showing results within your current price filters. Reset filters to see all available options.
                  </p>
                </div>
              </div>
            </div>

            {/* Nearby Pharmacies Snapshot */}
            <div className="rounded-[2.5rem] bg-white p-8 shadow-xl border border-slate-100 italic">
              <h4 className="text-xl font-black text-slate-800 mb-6 flex items-center gap-2">
                <MapPin size={22} className="text-emerald-500" />
                Nearby Pharmacies
              </h4>
              <div className="space-y-4">
                {pharmacies.length > 0 ? (
                  pharmacies.slice(0, 5).map(pharma => (
                    <div key={pharma._id} className="flex justify-between items-center p-3 rounded-2xl hover:bg-slate-50 transition border border-transparent hover:border-slate-100">
                      <span className="font-bold text-slate-700">{pharma.pharmacyName}</span>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-lg font-black">
                        {(pharma.distance / 1000).toFixed(1)} km
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-4">
                    <p className="text-slate-400 text-sm font-medium">Detect location to see nearby stores.</p>
                    {location && pharmacies.length === 0 && (
                      <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 text-[11px] text-orange-700 font-bold leading-tight">
                        No pharmacies found within 50km of your location. Try updating your vendor store locations in Settings.
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>

      <PharmaFooter />
    </div>
  );
}
