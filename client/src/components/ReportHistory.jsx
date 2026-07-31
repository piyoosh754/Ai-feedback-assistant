function ReportHistory({ reports, onDelete }) {
  return (
    <div className="bg-white shadow rounded-xl p-6 mt-6">
      <h2 className="text-2xl font-bold mb-5">Reviewed Reports</h2>

      {reports.length === 0 ? (
        <p>No Reports Saved Yet.</p>
      ) : (
        reports.map((report) => (
          <div
            key={report._id}
            className="border rounded-lg p-4 mb-3 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">
                {new Date(report.createdAt).toLocaleString()}
              </p>

              <p className="text-gray-500">
                Total Feedback : {report.summary.totalFeedback}
              </p>
            </div>

            <button
              onClick={() => onDelete(report._id)}
              className="bg-red-600 text-white px-4 py-2 rounded"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ReportHistory;
