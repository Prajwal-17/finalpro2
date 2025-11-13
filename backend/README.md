# Shield 360 Backend

This directory hosts the Django + SQLite backend that supports the Shield 360 frontend prototype.

## Prerequisites

- Python 3.10 or newer
- (Optional) `pipx` for isolated tooling

## Quick Start

```bash
cd /mnt/data/code/amruth_posco_project/finalpro2/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

The development server runs at `http://localhost:8000`. During frontend development Vite proxies `/api/*` requests to this server (see `frontend/vite.config.js`), so both servers can run concurrently without CORS errors.

## Available Endpoints

- `GET /api/health/` – lightweight uptime probe.
- `GET /api/news` – returns newsroom articles from the database or placeholder data when empty.
- `POST /api/login` – placeholder login endpoint that records role selections for future integration.
- `POST /api/register` – captures parent registration intents; stores hashed passwords for safekeeping until proper auth is implemented.

All responses are JSON. Authentication, permissions, and production-grade validation will be added alongside real backend requirements.

## Testing

```bash
cd /mnt/data/code/amruth_posco_project/finalpro2/backend
source .venv/bin/activate
python manage.py test
```

The test suite covers the core API endpoints and placeholder flows.

