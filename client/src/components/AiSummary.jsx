import { useState } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { downloadPDF } from "../utils/pdfReport";

function AISummary() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const generateSummary = async () => {
    try {
      setLoading(true);

      const { data } = await api.post("/feedback/synthesis");

      console.log(data.result);

      setResult(data.result);

      toast.success("AI Report Generated");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Generation Failed");
    } finally {
      setLoading(false);
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
              onClick={() => downloadPDF(result)}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg"
            >
              Download PDF
            </button>
          )}
        </div>
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
            <p className="mt-2 text-gray-700">{result.summary}</p>
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
                  <h4 className="font-bold text-lg">{theme.theme}</h4>

                  <p>Occurrences: {theme.occurrences}</p>

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
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default AISummary;
