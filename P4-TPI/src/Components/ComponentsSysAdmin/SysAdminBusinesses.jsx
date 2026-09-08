import { useState, useEffect } from "react";
import { fetchGlobalBusinesses, fetchBusinessTypes } from "../../services/businessService";
import BusinessCard from "./BusinessCard";

const ALL = "All";

const SysAdminBusinesses = () => {
  const [businesses, setBusinesses] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(ALL);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(false);
    try {
      const [businessList, typeList] = await Promise.all([fetchGlobalBusinesses(), fetchBusinessTypes()]);
      setBusinesses(Array.isArray(businessList) ? businessList : []);
      setTypes(Array.isArray(typeList) ? typeList : []);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [businessList, typeList] = await Promise.all([fetchGlobalBusinesses(), fetchBusinessTypes()]);
        if (!cancelled) {
          setBusinesses(Array.isArray(businessList) ? businessList : []);
          setTypes(Array.isArray(typeList) ? typeList : []);
        }
      } catch {
        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="size-8 animate-spin rounded-full border-2 border-[#1a1a2e] border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-[#e2ddd8] p-8 text-center mt-8">
        <p className="text-sm text-[#9a9a9a] mb-4">Couldn't load the businesses</p>
        <button
          onClick={load}
          className="bg-[#1a1a2e] text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-[#2d2d44] transition-colors cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  const filtered = selectedCategory === ALL
    ? businesses
    : businesses.filter((b) => b.category === selectedCategory);

  return (
    <div className="pt-8 flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-[#1a1a2e] mb-1">Businesses</h2>
        <p className="text-sm text-[#9a9a9a]">All businesses registered on the platform.</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory(ALL)}
          className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
            selectedCategory === ALL
              ? "bg-[#1a1a2e] text-white"
              : "bg-white border border-[#e2ddd8] text-[#5a5a6e] hover:bg-[#f0ede8]"
          }`}
        >
          All
        </button>
        {types.map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedCategory(type.name)}
            className={`text-xs font-semibold px-3.5 py-2 rounded-xl transition-colors ${
              selectedCategory === type.name
                ? "bg-[#1a1a2e] text-white"
                : "bg-white border border-[#e2ddd8] text-[#5a5a6e] hover:bg-[#f0ede8]"
            }`}
          >
            {type.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#e2ddd8] py-16 text-center text-sm text-[#9a9a9a]">
          No businesses found for this category.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {filtered.map((business) => (
            <BusinessCard key={business.id} business={business} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SysAdminBusinesses;
