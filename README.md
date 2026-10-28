# HelpDeskProject

A full-stack IT help desk ticket management application built with React, FastAPI, SQLAlchemy, and SQLite.

The application allows users to create, manage, track, and delete IT support tickets through an interactive dashboard.

## Features

- **Ticket Dashboard:** View all support tickets and summary statistics.
- **Create Tickets:** Submit new support requests with a title, category, and priority.
- **Update Ticket Status:** Change ticket status between Open, In Progress, and Resolved.
- **Delete Tickets:** Remove tickets with a confirmation prompt.
- **Search and Filtering:** Find tickets by search and filter them by category and status.
- **Database Persistence:** Store tickets in SQLite so changes remain after refreshing the page.
- **REST API:** Connect the React frontend to a FastAPI backend.

## Tech Stack

**Frontend**
- React
- JavaScript
- CSS
- Vite

**Backend**
- Python
- FastAPI
- SQLAlchemy
- SQLite

**Version Control**
- Git and GitHub

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Ioanna-Z/HelpDeskProject.git
cd HelpDeskProject
```

### 2. Run the backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn sqlalchemy
python -m uvicorn main:app --reload
```

The API will run at `http://127.0.0.1:8000`.

API documentation is available at `http://127.0.0.1:8000/docs`.

### 3. Run the frontend

Open a second terminal in the project directory:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/tickets` | Retrieve all tickets |
| POST | `/tickets` | Create a ticket |
| PATCH | `/tickets/{ticket_id}` | Update ticket status |
| DELETE | `/tickets/{ticket_id}` | Delete a ticket |

## Project Status

Core CRUD functionality completed and integrated with the SQLite database.

Future improvements may include user authentication, additional ticket fields, and deployment.