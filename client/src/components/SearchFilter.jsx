import { useState } from "react";

function SearchFilter({ onSearch }) {
  const [keyword, setKeyword] = useState("");
  const [productArea, setProductArea] = useState("");

  return (
    <div className="bg-white shadow rounded-xl p-4 mb-6 flex gap-4 items-center">
      <input
        type="text"
        placeholder="Search feedback..."
        className="border rounded-lg p-2 flex-1"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <select
        value={productArea}
        onChange={(e) => setProductArea(e.target.value)}
        className="border rounded-lg p-2"
      >
        <option value="">All Areas</option>
        <option value="Authentication">Authentication</option>
        <option value="Dashboard">Dashboard</option>
        <option value="Payments">Payments</option>
        <option value="Notifications">Notifications</option>
        <option value="Search">Search</option>
        <option value="Performance">Performance</option>
        <option value="UI/UX">UI/UX</option>
      </select>

      <button
        onClick={() => onSearch(keyword, productArea)}
        className="bg-blue-600 text-white px-5 py-2 rounded-lg"
      >
        Search
      </button>
    </div>
  );
}

export default SearchFilter;