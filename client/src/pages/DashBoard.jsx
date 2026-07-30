import { useEffect, useState } from "react";

import api from "../api/api";

import Navbar from "../components/NavBar";
import UploadForm from "../components/UploadForm";
import FeedbackTable from "../components/FeedbackTable";
import StatsCards from "../components/StatsCards";
import AISummary from "../components/AiSummary";
import BarChartComponent from "../components/charts/BarChartComponent";
import PieChartComponent from "../components/charts/PieChartComponent";
import LineChartComponent from "../components/charts/LineChartComponent";
import SearchFilter from "../components/SearchFilter";
import toast from "react-hot-toast";

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [trend, setTrend] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;

  const currentFeedbacks = feedbacks.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/feedback/stats");
      setStats(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    try {
      await api.delete(`/feedback/${id}`);

      setFeedbacks((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTrend = async () => {
    try {
      const { data } = await api.get("/feedback/trend");
      setTrend(data.trend);
    } catch (error) {
      console.log(error);
    }
  };
  const handleSearch = async (keyword, productArea) => {
    try {
      // Dono empty hain to hi sab records lao
      if (!keyword.trim() && !productArea) {
        fetchFeedbacks();
        setCurrentPage(1);
        return;
      }

      const { data } = await api.get(
        `/feedback/search?keyword=${keyword}&productArea=${productArea}`,
      );

      setFeedbacks(data.feedbacks);
      setCurrentPage(1);
    } catch (error) {
      console.log(error);
      toast.error("delete failed")
    }
  };
  const fetchFeedbacks = async () => {
    try {
      const { data } = await api.get("/feedback");
      setFeedbacks(data.feedbacks);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchStats();
    fetchTrend();
    fetchFeedbacks();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      <div className="max-w-7xl mx-auto p-8">
        <h1 className="text-4xl font-bold mb-6">AI Feedback Dashboard</h1>

        <StatsCards />

        <UploadForm />

        {stats && <BarChartComponent data={stats.productAreas} />}

        {stats && <PieChartComponent data={stats.productAreas} />}

        {trend.length > 0 && <LineChartComponent data={trend} />}
        <SearchFilter onSearch={handleSearch} />

        <AISummary />

        <FeedbackTable feedbacks={currentFeedbacks} onDelete={handleDelete}/>
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => setCurrentPage((prev) => prev - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>

          <span className="font-semibold">
            Page {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage((prev) => prev + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
