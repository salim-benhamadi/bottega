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

- **Frontend:** React, Vite, Tailwind CSS v4, React Router DOM.
- **Backend:** Python, FastAPI, Pydantic, Python-JOSE (for JWTs), Passlib (for bcrypt).
- **Database:** MongoDB (using the `motor` asynchronous python driver).
