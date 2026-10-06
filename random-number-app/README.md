# Random Number Generator (FastAPI + React)

A simple full-stack app: a React landing page with one "Generate" button that
calls a FastAPI backend, which returns a random integer to display.

## Project structure

```
random-number-app/
├── backend/
│   ├── main.py
│   └── requirements.txt
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        └── index.css
```

## Quick start (one command)

After installing dependencies once (see steps 1 and 2 below), you can start
both servers together:

```bash
python3 run.py
```

This runs `uvicorn` (backend, port 8000) and `npm run dev` (frontend, port
5173) in parallel and shuts both down on Ctrl+C. It also works as a single
PyCharm Run Configuration (Run -> Edit Configurations -> + -> Python ->
Script path: `run.py`).

---

## 1. Run the backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be live at `http://localhost:8000`.
Test it directly: `http://localhost:8000/api/random`

You can also pass a custom range: `http://localhost:8000/api/random?min=1&max=6`

## 2. Run the frontend

In a separate terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

Click **Generate** — the page will call the FastAPI backend and display the
random number it returns.

## Notes

- CORS is already configured in `backend/main.py` to allow requests from
  `http://localhost:5173` (Vite's default dev port).
- If you change the backend port, update `API_URL` in `frontend/src/App.jsx`
  to match.
