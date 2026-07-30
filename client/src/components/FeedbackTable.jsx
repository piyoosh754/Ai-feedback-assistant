import { useEffect, useState } from "react";

function FeedbackTable({ feedbacks, onDelete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (feedbacks) {
      setLoading(false);
    }
  }, [feedbacks]);

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow mt-6">Loading...</div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow mt-6 overflow-x-auto">
      <table className="w-full">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="p-3 text-left">Feedback</th>
            <th className="p-3 text-left">Source</th>
            <th className="p-3 text-left">User Type</th>
            <th className="p-3 text-left">Product Area</th>
            <th className="p-3 text-left">Rating</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {feedbacks.length > 0 ? (
            feedbacks.map((item) => (
              <tr key={item._id} className="border-b hover:bg-gray-100">
                <td className="p-3">{item.feedbackText}</td>
                <td className="p-3">{item.source}</td>
                <td className="p-3">{item.userType}</td>
                <td className="p-3">{item.productArea}</td>
                <td className="p-3">{item.rating}</td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => {
                      const ok = window.confirm(
                        "Are you sure you want to delete this feedback?",
                      );

                      if (ok) {
                        onDelete(item._id);
                      }
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center p-5">
                No feedback found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default FeedbackTable;
