# Shield 360

- run frontend & backend in two separate terminals
- [Code Explanation](#code-explanation)

## Sheild 360 Backend

This directory hosts the Django + SQLite backend.

## Quick Start

```bash
cd backend

# create a virtual environment
python3 -m venv .venv
source .venv/bin/activate
```

- install all the packages

```bash
pip install -r requirements.txt
```

- apply schema changes to DB.
- only use this when there is a change in database schema

```bash
python manage.py migrate
```

- load quiz catalog + mock dev data (safe to re-run, add `--purge` to replace existing records)

```bash
python manage.py seed_mock_data  # add --purge to wipe and reseed
```

- run development server

```bash
# manage.py is like the entry file, starts the dev server
python manage.py runserver
```

- dev server runs at `http://127.0.0.1:8000/`

## Available Endpoints

- `GET /api/health/` – lightweight uptime probe.
- `GET /api/news` – returns newsroom articles from the database or placeholder data when empty.
- `POST /api/login` – placeholder login endpoint that records role selections for future integration.
- `POST /api/register` – captures parent registration intents; stores hashed passwords for safekeeping until proper auth is implemented.

All responses are JSON. Authentication, permissions, and production-grade validation will be added alongside real backend requirements.

# Shield 360 Frontend

- Tech Stack
  - Vite (Bundler) - Bundle JSX files, and hot reloading
  - React JS - To bulid user interface & Handles Routing
  - Tailwind Css - For Styles

## Getting Started

```bash
cd frontend
```

- install all packages

```bash
npm install
```

- start development server

```bash
npm run dev
```

- dev server runs at `http://localhost:5173/`

### Routes

- `/home`
- `/about`
- `/discover`
- `/awareness`
- `/news`
- `/login`
- `/register`

# Code Explanation

**Basics**

- The browser only understands only `HTML`, `CSS`, `JS`.
- All the libraries and frameworks are only written for humans not for browsers.
- We will be using `react js` as frontend library
- And `Tailwind CSS` for styling

## React Js

- **What is the problem in using plain HTML, CSS, JS**
  - When we click on a link, it has to do a full page reload
  - like fetch a new html,css,js files from the server, which is expensive , slow, bad user experience
  - hard to maintain in codebases & debug
  - Cannot resuse repeated UI components, have to write each time.

- **What is react js**
  - React Js is a frontend library for building user interfaces.
  - This follow Component based architecture , we can break large UI into small, reusable independent component.
  - React is Just a mix of HTML,CSS, JS in a single file
- **Why React Js**
  - React solves the problem all of the above
  - React is called as `Single Page Application(SPA)`.
  - Beacuse it only loads single HTML,CSS,JS file , where all the logic lies.
  - All the logic is written in JS, where it updated the UI accordingly without reloading the full page
  - there is not full page reload on any link click or form update etc ..

## Backend

- `requirements.txt` - a file contains all the packages with their versions needed for project
- `manage.py` - runs all commands & starts the server
- `urls.py` - contains all the routing logic,acts as a router
- `view.py` - contains core logic, like what should that particular request do
