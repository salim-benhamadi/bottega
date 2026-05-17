# Bottega — HR Platform for the AI Era

Bottega is a functional AI Orchestration platform built for SMB managers. It treats AI agents as a workforce to be hired, managed, and grown over time, rather than software to be configured. 

## 🚀 How to Run the App

### Prerequisites
1. **Node.js & npm** (for the frontend)
2. **Python 3.10+** (for the backend)
3. **MongoDB:** A local instance running on default port `27017` (or modify `MONGO_URL` in the backend).
4. **Gemini API Key:** Required for all agent interactions and orchestration.

### 1. Setup the Backend
Open a terminal and navigate to the `backend` folder:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
```

Copy the provided `.env.example` file to create your own `.env` file:
```powershell
copy .env.example .env
```
Then, open the `.env` file and add your keys:
```text
GEMINI_API_KEY=your_actual_gemini_api_key_here
MONGO_URL=mongodb://localhost:27017  # Change this if using MongoDB Atlas
```

Start the FastAPI server:
```powershell
uvicorn main:app --reload
```
*(The API will run on `http://localhost:8000`)*

### 2. Setup the Frontend
Open a new terminal and navigate to the `frontend` folder:
```powershell
cd frontend
npm install
npm run dev
```
*(The React app will run on `http://localhost:5173`)*

---

## ✅ What is Implemented

The application has been upgraded from a pitch-deck mock to a fully functional AI orchestration tool.

- **Authentication & Security:** Full JWT-based authentication flow with user registration, login, and protected routes. Passwords are cryptographically hashed using bcrypt.
- **Persistent Database:** MongoDB natively stores Users, Marketplace Agents templates, specific User Hired Agents, and Task History.
- **Real Task Execution:** Users can assign custom, natural-language tasks to hired agents. The backend dynamically constructs system prompts combining the agent's role, skills, and specific company dossier, then streams it to the Gemini API.
- **The "Growth Engine" (Dossier System):** After every executed task, a secondary background AI process analyzes the interaction to extract new preferences and business facts. These are saved persistently to the agent's "Dossier" (memory), meaning the agent actively learns and improves specific to the user over time.
- **Dynamic Daily Standups:** The dashboard dynamically fetches real tasks completed by the user's team in the last 24 hours, feeds them into an AI orchestrator, and generates a manager-friendly natural-language briefing.
- **Autonomous Delegation Trigger:** Agents are configured with strict system instructions to recognize tasks outside their domain (e.g., a Proposal Writer asked to translate German). When detected, the agent autonomously halts, triggers the hiring of the correct specialist (Translator Pro DE) from the marketplace to your team, and notifies the manager.
- **Continuous Multi-Agent Workflows (A2A Swarms):** Delegation is now a continuous pipeline. If an agent realizes it needs help, it streams its drafted output directly into the newly hired specialist's input, completing the multi-step pipeline invisibly and returning the final result to the user.
- **Marketplace Creator Portal:** The "Creator Studio" is now live on the dashboard, allowing any user to build, price, and publish their own custom agents directly to the MongoDB marketplace, completing the Creator Economy flywheel.

---

## ❌ What is NOT Implemented

While the core agentic logic is real, several features meant for a full V1 launch are deferred:

- **Real Credit Billing (Stripe):** Agents cost "credits" to hire, but there is no actual Stripe checkout or credit-deduction math tied to the MongoDB user account yet.
- **Production Deployment:** No Dockerfiles, CI/CD pipelines, or cloud hosting (e.g., Vultr/GCP) configurations have been written. The app is strictly configured for `localhost`.

---

## 🔌 APIs and Stack Used

**External APIs:**
- **Google GenAI (Gemini 2.5 Flash):** Used as the core cognitive engine for agent task execution, dossier fact extraction, and standup generation.

**Tech Stack:**
- **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM.
- **Backend:** Python, FastAPI, Pydantic, Python-JOSE (for JWTs), Passlib (for bcrypt).
- **Database:** MongoDB (using the `motor` asynchronous python driver).
