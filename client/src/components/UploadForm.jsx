import { useState } from "react";
import toast from "react-hot-toast";

function UploadForm() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      toast.error("Please select a CSV file");
      return;
    }

    console.log("Selected File:", file);

    const formData = new FormData();
    formData.append("file", file);

    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/feedback/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("Response:", data);

      if (response.ok) {
        toast.success(data.message);
      } else {
        toast.error(data.message || "Upload Failed");
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-semibold mb-4">
        Upload Feedback CSV
      </h2>

      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => {
            console.log(e.target.files);
            setFile(e.target.files[0]);
          }}
        />

        <br />
        <br />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default UploadForm;