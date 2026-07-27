<div align="center">

# ⚖️ LegalLingo

### Turn dense legalese into plain English — instantly.

**AI-powered contract auditor & jargon simplifier** that flags risky clauses, scores contract health, and gives you a negotiation copilot in your pocket.

<br/>

![React](https://img.shields.io/badge/React-Vite-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-Python-000000?style=for-the-badge&logo=flask&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-3.5_Flash-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT_%2B_OAuth2-black?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Status](https://img.shields.io/badge/status-active-success?style=flat-square)
![PRs](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

<br/>

<img src="https://img.shields.io/badge/🔴_Risky-Flagged-red?style=flat-square" />
<img src="https://img.shields.io/badge/🟡_Caution-Reviewed-yellow?style=flat-square" />
<img src="https://img.shields.io/badge/🟢_Safe-Cleared-brightgreen?style=flat-square" />

</div>

<br/>

## 📖 Table of Contents

- [Why LegalLingo?](#-why-legallingo)
- [Key Features](#-key-features)
- [Architecture & Tech Stack](#️-architecture--tech-stack)
- [Project Structure](#-project-structure)
- [Local Development Setup](#️-local-development-setup)
- [Production Deployment](#-production-deployment-configuration)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [License](#-license)

<br/>

## 💡 Why LegalLingo?

Contracts are full of clauses no one actually reads — until something goes wrong. **LegalLingo** parses your contracts, translates the legal jargon into plain English, flags what's risky, and gives you an AI copilot to push back with better terms — all before you sign.

> Upload a contract → Get a health score → See what's risky → Negotiate with confidence.

<br/>

## 🚀 Key Features

### 📤 Multi-Format Upload Zone
| Format | Method | Notes |
|---|---|---|
| `.pdf` / `.docx` | Server-side parsing | Full text extraction via `pypdf` / `python-docx` |
| `.png` / `.jpg` / `.jpeg` | **Client-side OCR** (`tesseract.js`) | Runs entirely in-browser — preserves Gemini token limits & offloads server load |
| Raw text | Direct paste | Instant simplification of a single clause |

### 📊 Interactive Legal Audit Dashboard
- **Contract Health Score** — a radial progress indicator that gives you an at-a-glance safety rating.
- **Severity Flags** — every clause categorized as 🔴 **Risky**, 🟡 **Caution**, or 🟢 **Safe**.
- **Side-by-Side View** — original clause ↔ plain-English translation ↔ legal reasoning ↔ suggested counter-proposal.

### 🤖 Live AI Legal Copilot
- Fully contextual chatbot — aware of the *entire* active contract (pulled live from MongoDB).
- Persistent conversation history for coherent, multi-turn negotiation strategy.

### 🛡️ Production-Grade Fail-Safes
- Automatic fallback to offline mock contract templates if the API hits rate limits or misconfiguration — **zero downtime, guaranteed**.

### 🔐 Secure Authentication
- Custom JWT-based auth flow.
- One-click **Google OAuth 2.0** sign-in.

<br/>

## 🏗️ Architecture & Tech Stack

```
┌─────────────────────┐        ┌──────────────────────┐        ┌────────────────────┐
│      FRONTEND        │ ⇄ REST │       BACKEND         │ ⇄ API │     GEMINI 3.5 FLASH │
│  React (Vite)         │        │  Flask (Python)        │        │  Contract Analysis   │
│  Framer Motion         │        │  Blueprint Routing      │        └────────────────────┘
│  tesseract.js (OCR)     │        │  pypdf / python-docx      │
│  Axios + JWT interceptors│      │  flask_jwt_extended         │        ┌────────────────────┐
└─────────────────────┘        │  pymongo                      │ ⇄     │   MongoDB Atlas       │
                                └──────────────────────┘        │  Contract + Chat Store │
                                                                  └────────────────────┘
```

### Frontend
| Layer | Technology |
|---|---|
| Framework | React (Vite) |
| Styling | Vanilla CSS · dark-mode glassmorphism · `Outfit` & `Inter` (Google Fonts) · Tailwind optional |
| Animations | Framer Motion |
| OCR | `tesseract.js` (client-side) |
| API Client | Axios — auto JWT header injection + token-refresh interceptors |

### Backend
| Layer | Technology |
|---|---|
| API Framework | Flask (Python), Blueprint routing |
| Text Parsing | `pypdf` (PDF) · `python-docx` (Word) |
| AI Engine | Google **Gemini 3.5 Flash** (direct REST integration) |
| Database | MongoDB Atlas via `pymongo` |
| Auth | `flask_jwt_extended` |

<br/>

## 📁 Project Structure

```
legallingo/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── .env
│   └── ...blueprints, models, routes
└── frontend/
    ├── src/
    ├── package.json
    ├── .env
    └── vercel.json
```

<br/>

## ⚙️ Local Development Setup

### 1️⃣ Backend

```bash
cd backend
```

Create and activate a virtual environment:

```bash
python -m venv venv

# Windows
.\venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create a `.env` file inside `backend/`:

```env
MONGO_URI=mongodb+srv://...your_mongodb_connection_uri
JWT_SECRET_KEY=your_jwt_secret_key
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173
GEMINI_API_KEY=your_google_ai_studio_gemini_api_key
PORT=5000
```

Run the server:

```bash
python app.py
```

### 2️⃣ Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file inside `frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
```

Start the dev server:

```bash
npm run dev
```

Your app should now be running at **http://localhost:5173** 🎉

<br/>

## 🌐 Production Deployment Configuration

### Frontend — Vercel
- Deploy root directory: `/frontend`
- Environment variables: `VITE_API_URL` (your Render backend URL), `VITE_GOOGLE_CLIENT_ID`
- React Router history fallback handled via `vercel.json` rewrites

### Backend — Render
- Deploy root directory: `/backend`
- Environment variables: `MONGO_URI`, `JWT_SECRET_KEY`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GEMINI_API_KEY`
- Start command: `gunicorn app:app`

<br/>

## 🗺️ Roadmap

- [ ] Multi-language contract support
- [ ] Exportable audit reports (PDF)
- [ ] Clause-level version diffing across contract revisions
- [ ] Team/workspace collaboration mode

<br/>

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](../../issues) or open a pull request.

1. Fork the repo
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

<br/>

## 📄 License

Distributed under the **MIT License**. See `LICENSE` for more information.

<br/>

<div align="center">

Made with ⚖️ + 🤖 by developers who read the fine print so you don't have to.

</div>
