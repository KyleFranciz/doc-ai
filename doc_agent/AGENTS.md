# Agent Guidelines

This document provides guidelines for AI agents operating within this repository.

## Project Structure

-   `backend/`: Python backend (FastAPI)
-   `frontend/`: React frontend
-   `electron/`: Electron application

## Build/Lint/Test Commands

### Frontend

-   Build: `npm run build`
-   Lint: `npm run lint`
-   Dev: `npm run dev`

### Backend

-   Run: `uvicorn main:app --reload` (from `backend/`)

## Code Style Guidelines

### Frontend

-   TypeScript
-   React
-   Tailwind CSS
-   ESLint for linting

### Backend

-   Python 3.9+
-   FastAPI
-   Type hints are encouraged.

## Dependencies

### Frontend

-   Dependencies are managed with `npm` and listed in `frontend/package.json`.

### Backend

-   Dependencies: fastapi, python-dotenv, supabase
