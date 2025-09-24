# RBAC Authentication System (FastAPI + React)

A full-featured authentication and role-based access control (RBAC) system built with FastAPI (backend) and React (frontend). This project provides a complete authentication solution with user registration, login, password management, and role-based access control.

## Features

- **User Authentication**: Secure user registration and login with JWT tokens
- **Password Management**: Password hashing with bcrypt and strength validation
- **Role-Based Access Control (RBAC)**: Flexible role management system with protected routes
- **Admin Dashboard**: Specialized admin interface for user and role management
- **Protected Routes**: Frontend and backend route protection based on user roles
- **Automatic Admin Setup**: Automatic creation of admin user and roles on first run
- **CORS Support**: Properly configured CORS for frontend-backend communication

## Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs with Python 3.7+
- **SQLAlchemy**: SQL toolkit and Object-Relational Mapping (ORM) library
- **SQLite**: Lightweight database (easily replaceable with PostgreSQL, MySQL, etc.)
- **JWT**: JSON Web Tokens for secure authentication
- **Bcrypt**: Password hashing for security
- **Pydantic**: Data validation and settings management

### Frontend
- **React**: JavaScript library for building user interfaces
- **React Router**: Declarative routing for React
- **Axios**: Promise-based HTTP client for API requests
- **JWT-decode**: Library for decoding JWT tokens

## Project Structure

```
.
├── app/                    # Backend FastAPI application
│   ├── __init__.py         # Package initialization
│   ├── auth.py             # Authentication utilities (JWT, password hashing)
│   ├── database.py         # Database configuration
│   ├── dependencies.py     # Dependency injection utilities
│   ├── main.py             # Main application entry point and routes
│   ├── models.py           # Database models (User, Role)
│   ├── roles.py            # Role-based access control utilities
│   └── schemas.py          # Pydantic schemas for data validation
├── frontend/               # Frontend React application
│   ├── public/             # Public assets
│   └── src/                # React source code
│       ├── components/     # React components organized by feature
│       │   ├── Auth/       # Authentication components (Login, Register)
│       │   ├── Layout/     # Layout components (Header, ProtectedRoute)
│       │   └── Protected/  # Protected components (Dashboard, Admin)
│       ├── context/        # React context for authentication state
│       ├── services/       # API service functions
│       ├── App.js          # Main App component
│       └── index.js        # Entry point
├── .env.example            # Environment variables example
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Python 3.7+
- Node.js 14+
- npm (comes with Node.js)

### Backend Setup

1. Clone the repository:
   ```bash
   git clone git@github.com:parth0cb/fastapi-auth-rbac.git
   cd fastapi-auth-rbac
   ```

2. Create a virtual environment and activate it:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install Python dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` to set your own values:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your_secure_password
   SECRET_KEY=your_secret_key_here
   ```

5. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

   The backend will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install Node.js dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000`

## Usage

### Default Admin User

On first run, an admin user is automatically created with:
- Username: `admin` (or as specified in `.env`)
- Password: `admin123` (or as specified in `.env`)

You should change this password after first login for security.

### Roles

The system comes with two default roles:
- `user`: Standard user role
- `admin`: Administrator role with full access

Additional roles can be created through the admin interface or API.

### API Endpoints

| Endpoint | Method | Description | Authentication | Role Required |
|----------|--------|-------------|----------------|---------------|
| `/register` | POST | Register a new user | None | None |
| `/login` | POST | User login | None | None |
| `/dashboard` | GET | User dashboard | JWT Token | Any |
| `/admin` | GET | Admin dashboard | JWT Token | admin |
| `/change-password` | POST | Change user password | JWT Token | Any |
| `/roles` | POST | Create new role | JWT Token | admin |
| `/roles/{name}` | DELETE | Delete role | JWT Token | admin |
| `/users/role` | POST | Update user role | JWT Token | admin |
| `/users/{username}` | DELETE | Delete user | JWT Token | admin |
| `/users` | GET | List all users | JWT Token | admin |
| `/roles` | GET | List all roles | JWT Token | admin |

### Frontend Routes

| Route | Description | Authentication | Role Required |
|-------|-------------|----------------|---------------|
| `/login` | User login | None | None |
| `/register` | User registration | None | None |
| `/dashboard` | User dashboard | Required | Any |
| `/admin` | Admin dashboard | Required | admin |
| `/change-password` | Change password | Required | Any |

## Development

### Backend Development

The backend uses FastAPI with automatic API documentation available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Frontend Development

The frontend is organized into:
- **Auth Components**: Login, Register, ChangePassword
- **Layout Components**: Header, ProtectedRoute (HOC for route protection)
- **Protected Components**: Dashboard, AdminDashboard, RoleManagement, UserManagement
- **Context**: AuthContext for managing authentication state
- **Services**: API service functions for backend communication

## Security Considerations

- Always change the default admin password after first login
- Use a strong SECRET_KEY in production
- Consider using a more robust database (PostgreSQL, MySQL) for production
- Implement additional security measures as needed for your use case

## License

MIT License