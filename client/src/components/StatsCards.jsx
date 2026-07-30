import { useEffect, useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

function StatsCards() {
  const [stats, setStats] = useState({
    total: 0,
    avgRating: 0,
    productAreas: 0,
    sources: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/feedback");

      const feedbacks = data.feedbacks;

      const total = feedbacks.length;

      const avgRating =
        feedbacks.reduce((sum, item) => sum + Number(item.rating || 0), 0) /
        total;

      const productAreas = new Set(
        feedbacks.map((item) => item.productArea)
      ).size;

      const sources = new Set(
        feedbacks.map((item) => item.source)
      ).size;

      setStats({
        total,
        avgRating: avgRating.toFixed(1),
        productAreas,
        sources,
      });
    } catch {
      toast.error("Failed to load stats");
    }
  };

  const cardClass =
    "bg-white rounded-xl shadow p-6 text-center";

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <div className={cardClass}>
        <h2 className="text-gray-500">Total Feedback</h2>
        <p className="text-3xl font-bold text-blue-600">
          {stats.total}
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-gray-500">Average Rating</h2>
        <p className="text-3xl font-bold text-green-600">
          ⭐ {stats.avgRating}
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-gray-500">Product Areas</h2>
        <p className="text-3xl font-bold text-purple-600">
          {stats.productAreas}
        </p>
      </div>

      <div className={cardClass}>
        <h2 className="text-gray-500">Sources</h2>
        <p className="text-3xl font-bold text-orange-600">
          {stats.sources}
        </p>
      </div>
    </div>
  );
}

export default StatsCards;