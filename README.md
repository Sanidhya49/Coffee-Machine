# Coffee Machine Management & Approval Portal

A full-stack application for managing and approving an inventory of coffee machines.

## Architecture

This project is divided into two distinct parts:
1. **Backend (FastAPI, SQLite, SQLAlchemy)**: Provides a robust RESTful API and handles database interactions.
2. **Frontend (React, Vite, Tailwind CSS)**: A modern, highly responsive UI simulating different user roles for a multi-tier approval workflow.

### User Roles & Workflow
* **L1 Reviewer**: Edits newly added machines (status: "New") and escalates them (status: "Pending Level 2").
* **L2 Reviewer**: Reviews escalated machines and formally approves or rejects them.
* **Administrator**: Can add new machines to the system and has visibility/bypass over all actions.

---

## Getting Started

### 1. Structure
* `/backend`: FastAPI Python application
* `/frontend`: React application created with Vite

### 2. Running the Backend

Open a terminal and navigate to the backend directory:
```bash
cd backend
```

**Setup Virtual Environment & Install Dependencies:**
```bash
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

pip install -r requirements.txt
```

**Run the FastAPI Server:**
```bash
uvicorn main:app --reload
```
* Note: The seeding script runs automatically on startup. The first time the backend boots, it will populate the SQLite database with 30 realistic mock coffee machines.
* The API will be available at `http://localhost:8000`. Test the docs at `http://localhost:8000/docs`.

### 3. Running the Frontend

Open a **separate** terminal and navigate to the frontend directory:
```bash
cd frontend
```

**Install Dependencies:**
```bash
npm install
```

**Start the React Development Server:**
```bash
npm run dev
```
* The UI will be available at `http://localhost:5173`. Simply select your desired role from the user dropdown in the top right to test the tiered approval workflow!

---
*Built for Antigravity.*
