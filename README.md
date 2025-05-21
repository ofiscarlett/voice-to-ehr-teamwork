# Voice-to-EHR

This is an end-to-end medical transcription and structured documentation platform. It allows doctors to use **voice input**, automatically **transcribes it**, sends it to an **AI (GPT-4)** for analysis, and finally stores the result in a structured format compliant with **openEHR (via EHRbase)**.

---

## 🚀 Features

- 🎙 **Voice-to-Text** using DeepSeeker speech engines
- 🧠 **AI-based Text Structuring** using Azure OpenAI GPT-4
- 💾 **Structured EHR Storage** in openEHR via EHRbase backend (not yet)
- 🧑‍⚕️ **Doctor Review Interface**: edit, approve, and save
- 🔗 **REST API Integration** between frontend/backend and EHRbase

---

## 🧱 Architecture Diagram

```mermaid
graph TD
  A[Voice Recorder (DeepSeeker)] --> B[Transcribed Text]
  B --> C[AI Analysis via GPT-4]
  C --> D[Structured EHR JSON]
  D --> E[Doctor Review UI]
  E --> F[Save to EHRbase via REST API]


## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Backend**: Flask, Python
- **Voice Processing**: Web Audio API, SpeechRecognition
- **Data Format**: JSON

## ⚙️ Installation
✅ Requirements
Node.js v18+
Docker Desktop
Azure OpenAI API Key
(Optional) Supabase or a local PostgreSQL DB

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev
```

The frontend will run on http://localhost:3000

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend-node.js
```
2. Install dependencies:
```bash
npm install
```
3. Run the development server:
```bash
npm run dev

The backend will run on http://localhost:5000
