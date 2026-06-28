# BoardHire — Full Stack Job Board Platform

A full-stack job board application built with **Django REST Framework** (backend) and **React** (frontend). Supports two user roles — **Job Seekers** and **Employers** — with authentication, job postings, and applications.

## Features

- JWT-based authentication (register, login, current-user endpoint)
- Role-based permissions (Seeker vs Employer)
- Employers can create, update, and manage their own job postings
- Seekers can browse/filter active jobs and apply
- Prevents duplicate applications from the same seeker
- Employers can view and update application status for their own jobs
- Unrelated users cannot view applications they don't own

## Tech Stack

**Backend:** Python 3.11+, Django 4.x, Django REST Framework, SimpleJWT, SQLite
**Frontend:** React, React Router, Axios

## Project Structure

```
job-board-platform/
├── jobboard_backend/      # Django project
│   ├── accounts/          # User registration, login, profile
│   └── jobs/               # Job postings & applications
└── frontend/               # React app
```

## Setup

### 1. Backend

```powershell
cd jobboard_backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in your own values:

```powershell
copy .env.example .env
```

`.env.example` (included in the repo):
```
SECRET_KEY=your-secret-key-here
DEBUG=True
```

### 3. Run migrations and start the server

```powershell
python manage.py migrate
python manage.py runserver
```

### 4. Frontend

```powershell
cd frontend
npm install
npm start
```

## Testing

**16 automated tests, all passing** (minimum required: 5).

```powershell
pytest
```

```
collected 16 items
accounts/tests.py::TestRegistration::test_register_seeker_success PASSED
accounts/tests.py::TestRegistration::test_register_password_mismatch_fails PASSED
accounts/tests.py::TestRegistration::test_register_employer_requires_company_name PASSED
accounts/tests.py::TestLogin::test_login_success_returns_tokens_and_user PASSED
accounts/tests.py::TestLogin::test_login_wrong_password_fails PASSED
accounts/tests.py::TestLogin::test_me_requires_authentication PASSED
accounts/tests.py::TestLogin::test_me_returns_current_user PASSED
jobs/tests.py::TestJobListings::test_employer_can_create_job PASSED
jobs/tests.py::TestJobListings::test_seeker_cannot_create_job PASSED
jobs/tests.py::TestJobListings::test_anonymous_user_can_list_active_jobs PASSED
jobs/tests.py::TestJobListings::test_filter_jobs_by_location PASSED
jobs/tests.py::TestJobListings::test_other_employer_cannot_edit_job PASSED
jobs/tests.py::TestApplications::test_seeker_can_apply_to_job PASSED
jobs/tests.py::TestApplications::test_seeker_cannot_apply_twice_to_same_job PASSED
jobs/tests.py::TestApplications::test_employer_can_update_application_status PASSED
jobs/tests.py::TestApplications::test_unrelated_user_cannot_view_application PASSED

16 passed in 4.41s
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/accounts/register/` | Register a new user |
| POST | `/api/accounts/login/` | Login, get JWT tokens |
| GET | `/api/accounts/me/` | Get current user |
| GET | `/api/jobs/` | List active jobs (filterable) |
| POST | `/api/jobs/` | Create a job (employer only) |
| PATCH | `/api/jobs/<id>/` | Update a job (owner only) |
| POST | `/api/jobs/<id>/apply/` | Apply to a job (seeker only) |
| GET | `/api/applications/<id>/` | View application (owner only) |
| PATCH | `/api/applications/<id>/` | Update application status (employer only) |

## Screenshots

![Job listings](docs/screenshot-jobs.png)
![Job seeker dashboard](docs/screenshot-dashboard.png)
![Django admin panel](docs/screenshot-admin.png)

## Author

Built as part of a Month 1 / Week 4 capstone assignment.
