import { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { downloadPDF } from "../utils/pdfReport";

function AISummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [editableResult, setEditableResult] = useState(null);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/feedback/synthesis");

      console.log(data.result);

      setResult(data.result);

      const report = {
        ...data.result,
        themes: data.result.themes.map((theme) => ({
          ...theme,
          status: "Pending",
        })),
      };

      setEditableResult(report);

      toast.success("AI Report Generated");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Generation Failed");
    } finally {
      setLoading(false);
    }
  };

  const saveReviewedReport = async () => {
    try {
      await api.post("/feedback/report", {
        summary: editableResult,
      });

      toast.success("Reviewed Report Saved");
    } catch (error) {
      toast.error("Save Failed");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 mt-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">AI Feedback Insights</h2>

        <div className="flex gap-3">
          <button
            onClick={generateSummary}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg"
          >
            {loading ? "Generating..." : "Generate AI Report"}
          </button>

          {result && (
            <button
              onClick={() => downloadPDF(editableResult)} 
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
              
            >
              Download PDF
              
              
            </button>
            
          )}
        </div>
        <button onClick={saveReviewedReport} 
       className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">

          Save Reviewed Report
        </button>
      </div>

      {!result && (
        <p className="mt-6 text-gray-500">
          Click the button to generate AI insights.
        </p>
      )}

      {result && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold">Summary</h3>
            <textarea
              rows={4}
              className="w-full border rounded-lg p-3 mt-2"
              value={editableResult?.summary || ""}
              onChange={(e) =>
                setEditableResult({
                  ...editableResult,
                  summary: e.target.value,
                })
              }
            />
          </div>

          <div>
            <h3 className="text-xl font-semibold">Recurring Problems</h3>

            <ul className="list-disc ml-6 mt-2">
              {result.recurringProblems?.map((problem, index) => (
                <li key={index}>{problem}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Themes</h3>

            <div className="space-y-4 mt-4">
              {result?.themes?.map((theme, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <input
                    className="border rounded-lg px-3 py-2 w-full font-bold"
                    value={theme.theme}
                    onChange={(e) => {
                      const updated = { ...editableResult };

                      updated.themes[index].theme = e.target.value;

                      setEditableResult(updated);
                    }}
                  />

                  <p>Occurrences: {theme.occurrences}</p>

                  <div className="mt-3 flex items-center gap-3">
                    <span
                      className={`font-semibold ${
                        theme.status === "Approved"
                          ? "text-green-600"
                          : theme.status === "Rejected"
                            ? "text-red-600"
                            : "text-yellow-600"
                      }`}
                    >
                      {theme.status}
                    </span>

                    <button
                      className="bg-green-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        const updated = { ...editableResult };

                        updated.themes[index].status = "Approved";

                        setEditableResult(updated);
                      }}
                    >
                      Approve
                    </button>

                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => {
                        const updated = { ...editableResult };

                        updated.themes[index].status = "Rejected";

                        setEditableResult(updated);
                      }}
                    >
                      Reject
                    </button>
                  </div>

                  <ul className="list-disc ml-6 mt-2">
                    {theme.examples?.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold">Recommended Actions</h3>

            <ul className="list-disc ml-6 mt-2">
              {result?.recommendedActions?.map((action, index) => (
                <li key={index}>
                  <input
                    className="border rounded-lg w-full p-2"
                    value={action}
                    onChange={(e) => {
                      const updated = { ...editableResult };

                      updated.recommendedActions[index] = e.target.value;

                      setEditableResult(updated);
                    }}
                  />
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AISummary;
