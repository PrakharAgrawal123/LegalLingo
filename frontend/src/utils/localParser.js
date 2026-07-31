import API from "../services/api";

export async function extractTextFromFileLocal(file) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await API.post("/api/parse-text", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
    return res.data.text;
  } catch (err) {
    const errMsg = err.response?.data?.error || err.message || "Failed to parse document";
    throw new Error(errMsg);
  }
}
