# FastAPI Auth RBAC

This project is a secure RBAC based user authentication system built using FastAPI, SQLAlchemy, JWT, and bcrypt. It provides user registration, login, password management, and role assignment features, with secure route protection based on roles.

## Features

* User Registration
* User Login with JWT Authentication
* Role-based Access Control
* Password Hashing (bcrypt)
* Change Password Functionality
* Admin user auto-creation on startup
* SQLite database support
* Admin can create roles
* Admin can change roles of users
* Admin can delete users
* Login session expires after 30 minutes

---

## Directory Structure

```
fastapi-auth-rbac/
│
├── app/                   # Application source code
│   ├── auth.py            # Authentication logic (login, password hashing, JWT)
│   ├── database.py        # Database connection and session setup
│   ├── main.py            # Main FastAPI app with routes
│   ├── models.py          # SQLAlchemy models
│   ├── roles.py           # Role checking dependencies
│   └── schemas.py         # Pydantic schemas for request/response models
│
├── users.db               # SQLite database file (auto-generated)
├── .env                   # Environment variables
├── .env.example           # Example env file
├── .gitignore             # Git ignored files
├── requirements.txt       # Project dependencies
├── README.md              # Project documentation
└── LICENCE                # MIT Licence
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/parth0cb/fastapi-auth-rbac.git
cd fastapi-auth-rbac
```

### 2. Create a Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Environment Variables

Create a `.env` file by copying the example:

```bash
cp .env.example .env
```

Edit `.env` as needed:

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
SECRET_KEY=yoursecretkey
```

- `ADMIN_USERNAME` and `ADMIN_PASSWORD` will be used to auto-create the admin account on server startup if it doesn't already exist.
- `SECRET_KEY` is used by the application for cryptographic operations such as session management, signing cookies, or other security-related features. Make sure to set this to a strong, unique value.

### 5. Run the Application

```bash
uvicorn app.main:app --reload
```

Server will start at `http://127.0.0.1:8000`

You can access the interactive API documentation (Swagger UI) at:
`http://127.0.0.1:8000/docs`

---

## API Endpoints

### Authentication

* `POST /register` – Register a new user (assigned the "user" role by default)
* `POST /login` – Login and get a JWT token
* `POST /change-password` – Authenticated users can update their password

### User Management (Admin only)

* `GET /users` – List all users and their roles
* `DELETE /users/{username}` – Delete a user
* `POST /users/role` – Assign a role to a user

### Role Management (Admin only)

* `POST /roles` – Create a new role
* `GET /roles` – List all roles
* `DELETE /roles/{role_name}` – Delete a role

### Protected Routes

* `GET /dashboard` – Accessible to any authenticated user
* `GET /admin` – Accessible only to users with the "admin" role

## How Roles Work

* Roles are stored in a separate table (`roles`)
* A user can have multiple roles (many-to-many relationship)
* Role access is checked using dependencies in `roles.py`

Example of a route restricted to "admin" role:

```python
@app.get("/admin")
def admin_dashboard(
    current_user=Depends(auth.get_current_user),
    _=Depends(roles.require_role("admin"))
):
    return {"msg": f"Welcome admin {current_user.username}!"}
```

## Database

* SQLite is used by default (via `users.db`)
* Tables are auto-created on startup

---

## License

This project is open source and available under the MIT License.
