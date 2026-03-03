import React, { useState } from "react";
import { uploadPDF } from "../services/api";

function FileUpload({ sessionId }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    await uploadPDF(file, sessionId);
    setLoading(false);

    alert("PDF Uploaded Successfully!");
  };

  return (
    <div className="upload-box">
      <input type="file" accept="application/pdf" onChange={handleUpload} />
      {loading && <p>Processing PDF...</p>}
    </div>
  );
}

export default FileUpload;