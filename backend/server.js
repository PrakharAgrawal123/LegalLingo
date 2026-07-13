import express from "express";
import cors from "cors";
import multer from "multer";
import { mockContracts } from "./data/mockData.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Configure Multer with memory storage (no need to fill local disk with mock docs)
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "LegalLingo API Server is running smoothly",
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Analyze Document Endpoint
// Uses upload.single("file") to handle binary file uploads, 
// while also allowing text fields (filename, templateKey) via req.body
app.post("/api/analyze", upload.single("file"), (req, res) => {
  const filename = req.body.filename || (req.file ? req.file.originalname : "Uploaded_Contract.pdf");
  let templateKey = req.body.templateKey;

  console.log(`[API] Analyzing document: "${filename}"`);

  // If templateKey is not explicitly set, try to guess based on filename keywords
  if (!templateKey) {
    const nameLower = filename.toLowerCase();
    if (nameLower.includes("offer") || nameLower.includes("employee") || nameLower.includes("job") || nameLower.includes("work") || nameLower.includes("employment")) {
      templateKey = "employment_contract";
    } else if (nameLower.includes("saas") || nameLower.includes("term") || nameLower.includes("service") || nameLower.includes("cloud")) {
      templateKey = "saas_terms";
    } else {
      templateKey = "rent_agreement"; // default fallback
    }
  }

  // Load appropriate mock analysis dataset
  const analysisResult = mockContracts[templateKey] || mockContracts.rent_agreement;

  // Clone data and override the filename with the actual uploaded filename for realism
  const responseData = {
    ...analysisResult,
    name: filename
  };

  // Simulate a 1.2-second processing delay to mimic real AI computational load
  setTimeout(() => {
    console.log(`[API] Analysis completed for: "${filename}". Sending response.`);
    res.status(200).json(responseData);
  }, 1200);
});

// Start Server
app.listen(PORT, () => {
  console.log(`==================================================`);
  console.log(`⚖️  LegalLingo API Server running on port ${PORT}`);
  console.log(`🚀 API Base URL: http://localhost:${PORT}/api`);
  console.log(`==================================================`);
});
