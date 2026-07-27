# LegalLingo ⚖️

**LegalLingo** is an AI-powered legal jargon simplifier and contract auditor designed to help users translate dense legalese into plain English. It highlights contract risks (Risky, Caution, Safe), calculates an overall contract health score, and provides a contextual, conversational AI Copilot to help users draft counter-offers and negotiate better terms.

---

## 🚀 Key Features

* **Multi-Format Upload Zone**:
  * **Document Parsing**: Drag & Drop standard digital `.pdf` and `.docx` documents for text extraction.
  * **Image OCR (Client-Side)**: Upload images (`.png`, `.jpg`, `.jpeg`) which are parsed locally in the browser using `tesseract.js`. This preserves Gemini token limits and offloads OCR processing from the server.
  * **Raw Text Input**: Paste specific clauses directly for immediate simplification.
* **Interactive Legal Audit Dashboard**:
  * **Contract Health Score**: Visual radial progress indicator of contract safety.
  * **Interactive Severity Flags**: Categorized breakdown of clauses into **Risky** 🔴, **Caution** 🟡, and **Safe** 🟢.
  * **Side-by-Side Comparison**: View original clause text alongside simplified translations, legal explanations, and pre-drafted negotiation proposals.
* **Live AI Legal Copilot**:
  * Chatbot interface that responds with full context of the active contract (retrieved from MongoDB).
  * Maintained conversation history for coherent follow-up questions.
* **Production-Grade Fail-Safes**:
  * Automatic fallback to offline mock contract templates in case of API limits or configuration errors, guaranteeing zero downtime.
* **Secure Authentication**:
  * Secure JSON Web Token (JWT) custom authentication.
  * One-click Google OAuth2.0 sign-in integration.

---

## 🛠️ Architecture & Tech Stack

### Frontend (React App)
* **Core Framework**: React (Vite)
* **Styling**: Vanilla CSS (Tailwind Optional) with dark-mode glassmorphism and modern typography (Google Fonts - Outfit & Inter)
* **Animations**: Framer Motion for premium micro-interactions
* **Client-Side OCR**: `tesseract.js` for in-browser Optical Character Recognition
* **API Client**: Axios with interceptors for automatic JWT header propagation and token refresh triggers

### Backend (Flask Server)
* **Core API**: Flask (Python) with Blueprint routing structures
* **Text Parsers**: `pypdf` (PDF digital stream reader) and `python-docx` (Microsoft Word XML parser)
* **AI Core Client**: Direct REST integrations to Google's **Gemini 3.5 Flash** endpoint
* **Database Driver**: `pymongo` for MongoDB Atlas connections
* **Authentication**: `flask_jwt_extended` for secure JWT lifespans

---

## ⚙️ Local Development Setup

### Backend Configuration
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a Python virtual environment:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate  # Windows
   source venv/bin/activate  # macOS/Linux
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Create a `.env` file in the `backend/` folder:
   ```env
   MONGO_URI=mongodb+srv://...your_mongodb_connection_uri
   JWT_SECRET_KEY=your_jwt_secret_key
   GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:5173
   GEMINI_API_KEY=your_google_ai_studio_gemini_api_key
   PORT=5000
   ```
5. Run the Flask server:
   ```bash
   python app.py
   ```

### Frontend Configuration
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install package dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend/` folder:
   ```env
   VITE_API_URL=http://localhost:5000
   VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
   ```
4. Start the Vite dev server:
   ```bash
   npm run dev
   ```

---

## 🌐 Production Deployment Configuration

* **Frontend Hosting (Vercel)**:
  * Deploy root directory: `/frontend`
  * Add Environment Variables: `VITE_API_URL` (pointing to your Render server link) and `VITE_GOOGLE_CLIENT_ID`.
  * Preserves React Router history fallbacks via `vercel.json` rewrites.
* **Backend Hosting (Render)**:
  * Deploy root directory: `/backend`
  * Add Environment Variables: `MONGO_URI`, `JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, and `GEMINI_API_KEY`.
  * Ensure standard `gunicorn app:app` WSGI commands are bound during startup.
