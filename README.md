# FastAPI User Authentication System with RBAC

This project is a simple yet secure user authentication system using FastAPI, SQLAlchemy, JWT, and bcrypt. It includes user registration, login, role-based access control, password hashing, and protected routes.

## Features

* User Registration
* User Login with JWT Authentication
* Role-based Access Control (`admin`, `user`)
* Password Hashing (bcrypt)
* Change Password Functionality
* Admin user auto-creation on startup
* SQLite database support
* Environment-based configuration

---

## Directory Structure

```
fastapi-auth-rbac/
├── app/
│   ├── auth.py             # Authentication and password handling
│   ├── database.py         # Database connection and session setup
│   ├── main.py             # Main FastAPI application
│   ├── models.py           # SQLAlchemy models
│   ├── roles.py            # Role-based access control
│   └── schemas.py          # Pydantic schemas
├── users.db                # SQLite database file
├── .env                    # Environment variables
├── README.md               # Project documentation
├── requirements.txt        # Python dependencies
└── venv/                   # Python virtual environment
```

---

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
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

Create a `.env` file in the root directory:

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

---

## API Endpoints

### `POST /register`

Register a new user.

**Request Body:**

```json
{
  "username": "newuser",
  "password": "securepassword"
}
```

---

### `POST /login`

Login with username and password. Returns a JWT token.

**Form Data:**

* `username`
* `password`

**Response:**

```json
{
  "access_token": "<token>",
  "token_type": "bearer"
}
```

---

### `GET /dashboard`

Protected route. Accessible to any authenticated user.

**Headers:**

```
Authorization: Bearer <access_token>
```

---

### `GET /admin`

Protected route. Only accessible to users with role `"admin"`.

**Headers:**

```
Authorization: Bearer <access_token>
```

---

### `POST /change-password`

Authenticated users can change their password.

**Request Body:**

```json
{
  "old_password": "currentpassword",
  "new_password": "newsecurepassword"
}
```

---

## Notes

* Passwords are securely hashed using bcrypt.
* JWT tokens include an expiration time (default: 30 minutes).
* Admin user is created automatically at startup using credentials in the `.env` file.

---

## Requirements

* Python 3.8+
* FastAPI
* SQLAlchemy
* passlib
* python-jose
* python-dotenv

See `requirements.txt` for all dependencies.

---

## License

This project is open source and available under the MIT License.
