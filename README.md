# Blogi - Fullstack Assignment

## Overview
This repository contains both the frontend and backend implementations for "Blogi," a blogging platform that allows users to create and manage blog posts. The frontend is built using Next.js, and the backend is implemented using FastAPI with PostgreSQL.

# Frontend - Blogi
## Background
The frontend of "Blogi" is developed using **Next.js** and interacts with the FastAPI backend via API calls.

## Tech Stack
- **Frontend:** Next.js
- **State Management:** Zustand
- **UI Library:** Tailwind CSS
- **API Calls:** Axios
- **Authentication:** JWT (localStorage)

## Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Amankumar321/datachecks.git
cd datachecks/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Update API_BASE_URL in .env file

# Run the development server
npm run dev
```

---

# Backend - Blogi
## Background
The backend is built with **FastAPI** and **PostgreSQL**, providing API endpoints for authentication and blog post management.

## Setup & Installation
### Prerequisites
- Python 3.10+
- PostgreSQL installed and running

### Installation
```bash
# Navigate to the backend folder
cd datachecks/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Update DATABASE_URL in .env file

# Start the FastAPI server
uvicorn main:app --reload
```

## API Documentation
Once the backend is running, API docs will be available at:
- Swagger UI: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- ReDoc: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)