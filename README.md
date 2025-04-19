
# Unify – Universal ERP Integration Framework

Unify is a smart, scalable, and extensible integration system designed to act as a middleware between various ERP platforms (like Oracle HCM, SAP SuccessFactors, BambooHR) and client applications. It provides a unified API layer for developers to interact with multiple ERPs through a consistent and AI-powered interface.

---

## Features

- Google OAuth2 Authentication
- AI-powered Field Mapping (Embeddings + Cosine Similarity)
- Support for Multiple ERP Systems (Oracle, SAP, BambooHR)
- Universal POST & GET Endpoints for Leave Management
- Mocked ERP Adapters using MongoDB
- Swagger/OpenAPI Documentation
- React Frontend with Dashboard & Form Interface

---

## 🔧 Technologies Used

- Backend: Node.js, Express, Passport.js, JWT
- Database: MongoDB (with Mongoose)
- Frontend: React.js (Vite), Axios
- AI Tools: HuggingFace Transformers, Python Embedding Server
- Auth: Google OAuth2
- Docs: Swagger UI, JSDoc

---

## Repository Structure

```
universal-erp-framework/
├── src/
│   ├── auth/              # Authenthication, Google OAuth2
|   ├── db/                # Database Connection Details
|   ├── docs/              # Auto Generated Swagger Docs
|   ├── integration/       # Routes for Security Configuration between ERP and Client
│   ├── ai-tools/          # Embedding, Matching Logic
│   ├── leaves/            # POST/GET routes + Adapters
│   ├── maintenance/       # Drift detection & mutation toggles
│   └── utils/             # Token handling, logging
├── public/                # Frontend assets
├── client/                # React frontend
├── .env                   # Secrets & config
```

---

## Setup Instructions

### 1. Backend

```bash
cd universal-erp-framework
npm install
npm start
```

Make sure to configure your `.env` file with:
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
JWT_SECRET=
MONGODB_URI=
```

### 2. Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Embedding Server (Python)

```bash
cd ai-embed-server
pip install -r requirements.txt
python app.py
```

---

## API Overview

- POST /api/leaves – Submit leave request using universal format
- GET /api/leaves – Fetch all leaves in normalized format
- /auth/google – Login via Google OAuth2
- /docs – View Swagger documentation

---

## Future Enhancements

- Real ERP API integrations (Oracle, SAP, etc.)
- Admin UI for schema and field mapping review
- Active learning to improve AI field match accuracy
- Multi-module ERP category support (HR, ATS, CRM, Finance)
- AI Compatibility for Custom ERP 

---

## Team

- Anup Savaliya
- Sushant Goyal
- Prakhar Prashant

