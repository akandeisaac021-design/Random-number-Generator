# Product Requirements Document
## Random Number Generator — Web App
*From concept to a working, tested full-stack application*

---

## 1. Overview

This document tracks the end-to-end journey of building a small full-stack web application: a random number generator with a FastAPI backend and a React (Vite) frontend. It covers the original requirements, the technical decisions made along the way, the features added through iteration, and the bugs found and fixed during testing and debugging.

## 2. Objective

Build a simple, working web app where a user can enter a minimum and maximum value, click a button, and receive a randomly generated integer within that range — served by a Python backend and displayed on a React frontend, runnable locally with a streamlined startup process.

## 3. Initial Requirements

- Backend built with FastAPI and Python 3.
- Frontend built with React, styled as a simple landing page.
- A single "Generate" button on the frontend.
- Clicking the button requests a random integer from the backend.
- The backend computes and returns the random integer; the frontend displays it.

## 4. Technical Architecture

| Layer | Technology | Purpose |
|---|---|---|
| Backend | FastAPI + Uvicorn (Python 3) | Serves REST endpoint(s) that generate and return a random integer |
| Frontend | React + Vite | Landing page UI; collects input and displays results |
| Communication | Fetch API over HTTP, CORS enabled | Frontend calls backend on localhost:8000 |
| Tooling | `run.py` (Python subprocess script) | Launches backend and frontend together with one command |

## 5. Development Journey

### 5.1 Initial Build

Scaffolded the project as two independent folders: `backend/` (FastAPI app with a GET endpoint returning a random integer, CORS configured for the Vite dev server) and `frontend/` (a Vite + React app with a styled card, a result display, and a Generate button wired to `fetch()` the backend).

### 5.2 Packaging for Delivery

The project was delivered as a downloadable folder. It was discovered that folders cannot be downloaded directly through the chat interface — only individual files can. The project was zipped into a single archive (`random-number-app.zip`) to make it downloadable.

### 5.3 Streamlining Local Startup

Running the backend and frontend as two separate manual commands was identified as friction. A `run.py` script was added at the project root that launches `uvicorn` and `npm run dev` as parallel subprocesses, streams their output, and shuts both down together on Ctrl+C — enabling a single command (or a single PyCharm Run Configuration) to start the whole app.

### 5.4 API Design Iteration

The API evolved through three stages as requirements became more specific:

1. **Stage 1:** `GET /api/random` with optional `min`/`max` query parameters (defaults 1–100).
2. **Stage 2:** `GET /api/{max}` — a path-parameter version with a fixed minimum of 1.
3. **Stage 3:** `GET /api/{min}/{max}` — both bounds supplied as path parameters, matching the final frontend form.

Each stage required corresponding updates to the frontend fetch URL to keep the two layers in sync.

### 5.5 UI Iteration

- Added labeled Min/Max input fields so the range is user-controlled instead of hardcoded.
- Removed native number-input increment arrows in favor of free-typed input, using `type="text"` with `inputMode="numeric"` and a digit-filtering regex on change.
- Extended input handling to accept negative numbers (a single leading minus sign, digits only after it) for both Min and Max fields.
- Enlarged the overall layout (bigger card, larger result display and button) for a more spacious, less cramped feel.
- Replaced the original purple gradient background with a dark slate-teal gradient, with matching accent colors on the result text and button, to move away from a generic "AI-template" look.

## 6. Testing & Debugging Log

Issues were found and resolved iteratively as the app was run and manually tested. The table below summarizes each issue encountered, its cause, and the fix applied.

| Issue | Root Cause | Resolution |
|---|---|---|
| `pip install` failed with "externally-managed-environment" | Ubuntu 24 blocks system-wide pip installs (PEP 668); no virtual environment was active despite a folder-name prompt suggesting otherwise | Created and activated a proper venv (`python3 -m venv venv && source venv/bin/activate`) before installing dependencies |
| New `/api/{max}` route silently conflicted with `/api/random` | Two overlapping route definitions; FastAPI matches by declaration order and would try to cast `"random"` to `int` | Removed the old query-param route when the path-param route was introduced, keeping one canonical endpoint |
| Two-argument URL request returned malformed results | `minValue` and `maxValue` were concatenated directly in the fetch URL with no separator (e.g. `"1100"` instead of `"1/100"`), and the backend only accepted one path parameter | Updated backend route to `/api/{min}/{max}` and frontend URL to use a `"/"` separator between values |
| Min/Max inputs showed literal text `"${minValue}"` instead of the value | Template-literal syntax (`${...}`) was used inside a JSX `value` attribute instead of JSX curly-brace interpolation | Changed `value="${minValue}"` to `value={minValue}` (and same for the max input's `min` attribute) |
| Generate button requested `/api/null/null` on first load | `minValue` and `maxValue` state was initialized with `useState(null)` instead of real numbers | Initialized state with sensible defaults: `useState(1)` for min and `useState(100)` for max |
| Negative numbers could not be entered | A digit-only regex (`\D`) stripped the minus sign along with all other non-digit characters | Updated regex to preserve a single leading `"-"` while still blocking all other non-digit characters |
| React app failed to compile after adding the input fields | A missing closing `</div>` after the Min value input group caused the Max input and the Generate button to be nested incorrectly, unbalancing the JSX tree | Added the missing `</div>` after each input group so the JSX structure closed correctly |

## 7. Final Product Summary

- **Backend:** FastAPI endpoint `GET /api/{min}/{max}` returning a random integer within a user-supplied range.
- **Frontend:** React landing page with typed (non-incrementing) Min and Max inputs supporting negative numbers, a Generate button, and a result display.
- **Startup:** single-command launch via `run.py`, or two manual commands (`uvicorn`, `npm run dev`) as a fallback.
- **Styling:** enlarged, centered card layout with a dark slate-teal gradient background and matching accent colors.
- **Delivery:** packaged as a downloadable zip archive containing the backend, frontend, run script, and README.

## 8. Known Follow-Ups / Future Considerations

- No validation yet for the case where `Min > Max`, which will raise a `ValueError` from `random.randint` on the backend.
- No loading/empty-state styling beyond the basic "Generating..." button text.
- CORS is currently limited to `localhost:5173`; would need updating for any non-local deployment.

---

*Prepared as a record of the build process, from initial scaffolding through iterative testing and debugging to the current working version.*
