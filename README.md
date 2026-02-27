# Coffee Machine Approval Portal

A full-stack approval and inventory management system for a premium coffee machine fleet. Built with a React frontend and a FastAPI (Python) backend using SQLite.

## How it Works

The portal allows users to manage a fleet of coffee machines (Espresso, Drip, Pour Over, Pod, etc.) through a strict two-level approval process before they go live in the main inventory.

**The Three Roles:**
- **L1 Reviewer:** Can add new machines and edit existing ones. Any changes they make go into a "Pending Level 2" state. They can also request to delete machines, or directly delete rejected ones.
- **L2 Reviewer:** The approvers. They review changes or deletion requests made by L1. They can approve (publishing the changes) or reject them. They can also permanently delete rejected machines.
- **Admin:** Has all the permissions of both L1 and L2 combined.

## Tech Stack Overview

### Frontend
- **React + Vite:** For a fast, modern single-page application experience.
- **Tailwind CSS:** Used heavily for custom, responsive, and aesthetic styling. We built a custom "Coffee" color palette in the config to give the app a premium look.
- **React Router:** For handling navigation between the Dashboard, Add Machine, Compare, and Review pages.
- **Lucide React:** For clean, consistent iconography.

### Backend
- **FastAPI:** A modern Python framework for building APIs quickly.
- **SQLAlchemy:** The ORM used to interact with the database using Python objects instead of raw SQL.
- **SQLite:** A lightweight database stored locally (in `coffee_machines.db`) for easy setup without needing a separate server.
- **Uvicorn:** The ASGI web server used to run the FastAPI app.

## Running the Project

You need two terminal windows open to run this application locally.

### 1. Start the Backend (API)
1. Open a terminal and navigate to the `backend` folder.
2. Install the requirements: `pip install -r requirements.txt`
3. Run the server: `uvicorn main:app --reload`
*The API will start running on `http://127.0.0.1:8000`*

### 2. Start the Frontend (UI)
1. Open a second terminal and navigate to the `frontend` folder.
2. Install dependencies: `npm install`
3. Run the dev server: `npm run dev`
*The React app will usually start on `http://localhost:5173`*

## Features

- **Responsive Design:** Completely mobile-first layouts, ensuring the complex comparison tables and dashboards look great on phones and desktops.
- **Role-Based Views:** The UI adapts based on the role selected in the top right navbar.
- **Compare Tool:** Select up to 4 machines and compare their specs side-by-side in a detailed table.
- **Live Search & Filtering:** Filter the inventory instantly by text search, machine type, or approval status.
- **Aesthetic UI:** Floating action bars, fade-in animations, custom color palettes, and glassmorphism effects.
