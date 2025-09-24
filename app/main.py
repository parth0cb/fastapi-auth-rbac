import os
import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from dotenv import load_dotenv

from . import models, schemas, auth, database, roles
from .database import engine, SessionLocal
from .schemas import ChangePasswordRequest, RoleCreate, UserRoleUpdate

from pydantic import BaseModel

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database tables
models.Base.metadata.create_all(bind=engine)

# Dependency for database session
from .dependencies import get_db

# Admin creation logic
def create_admin():
    db = SessionLocal()
    try:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

        # Ensure "admin" role exists
        admin_role = db.query(models.Role).filter(models.Role.name == "admin").first()
        if not admin_role:
            admin_role = models.Role(name="admin")
            db.add(admin_role)
            db.commit()
            db.refresh(admin_role)

        # Ensure admin user exists
        existing_user = db.query(models.User).filter(models.User.username == admin_username).first()
        if not existing_user:
            admin_user = models.User(
                username=admin_username,
                hashed_password=auth.get_password_hash(admin_password),
                roles=[admin_role]
            )
            db.add(admin_user)
            db.commit()
            logger.info("Admin user created.")
        else:
            logger.info("Admin user already exists.")
    finally:
        db.close()

# Use FastAPI lifespan event instead of deprecated @app.on_event
@asynccontextmanager
async def lifespan(app: FastAPI):
    create_admin()
    yield

app = FastAPI(lifespan=lifespan)

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class LoginRequest(BaseModel):
    username: str
    password: str

# Basic password strength check
def validate_password_strength(password: str):
    if len(password) < 8:
        raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")

    validate_password_strength(user.password)

    # Get or create the "user" role
    user_role = db.query(models.Role).filter(models.Role.name == "user").first()
    if not user_role:
        user_role = models.Role(name="user")
        db.add(user_role)
        db.commit()
        db.refresh(user_role)

    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.User(
        username=user.username,
        hashed_password=hashed_pw,
        roles=[user_role]
    )

    try:
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=500, detail="Database error during registration")

    return {"msg": "User created successfully"}


@app.post("/login", response_model=schemas.Token)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == data.username).first()
    if not user or not auth.verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect username or password")
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}


@app.get("/dashboard")
def dashboard(current_user=Depends(auth.get_current_user)):
    return {"msg": f"Welcome to your dashboard, {current_user.username}!"}


@app.get("/admin")
def admin_dashboard(
    current_user=Depends(auth.get_current_user),
    _=Depends(roles.require_role("admin"))
):
    return {"msg": f"Welcome admin {current_user.username}!"}


@app.post("/change-password")
def change_password(
    req: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user=Depends(auth.get_current_user)
):
    validate_password_strength(req.new_password)

    user = db.query(models.User).filter(models.User.username == current_user.username).first()
    if not auth.verify_password(req.old_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    user.hashed_password = auth.get_password_hash(req.new_password)
    db.commit()

    return {"msg": "Password updated successfully"}


@app.post("/roles", dependencies=[Depends(roles.require_role("admin"))])
def create_role(role: RoleCreate, db: Session = Depends(get_db)):
    existing_role = db.query(models.Role).filter(models.Role.name == role.name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="Role already exists")
    new_role = models.Role(name=role.name)
    db.add(new_role)
    db.commit()
    return {"msg": f"Role '{role.name}' created successfully"}


@app.delete("/roles/{role_name}", dependencies=[Depends(roles.require_role("admin"))])
def delete_role(role_name: str, db: Session = Depends(get_db)):
    role = db.query(models.Role).filter(models.Role.name == role_name).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")
    db.delete(role)
    db.commit()
    return {"msg": f"Role '{role_name}' deleted successfully"}


@app.post("/users/role", dependencies=[Depends(roles.require_role("admin"))])
def update_user_role(update: UserRoleUpdate, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == update.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    role = db.query(models.Role).filter(models.Role.name == update.role).first()
    if not role:
        raise HTTPException(status_code=404, detail="Role not found")

    user.roles = [role]
    db.commit()
    return {"msg": f"User '{user.username}' role updated to '{update.role}'"}


@app.delete("/users/{username}", dependencies=[Depends(roles.require_role("admin"))])
def delete_user(username: str, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Prevent deletion of last admin
    if any(role.name == "admin" for role in user.roles):
        admin_users = db.query(models.User).join(models.User.roles).filter(models.Role.name == "admin").all()
        if len(admin_users) <= 1:
            raise HTTPException(status_code=400, detail="Cannot delete the last admin user")

    db.delete(user)
    db.commit()
    return {"msg": f"User '{username}' deleted successfully"}


@app.get("/users", dependencies=[Depends(roles.require_role("admin"))])
def list_users(db: Session = Depends(get_db)):
    users = db.query(models.User).all()
    return [
        {
            "username": u.username,
            "roles": [r.name for r in u.roles]
        }
        for u in users
    ]


@app.get("/roles", dependencies=[Depends(roles.require_role("admin"))])
def list_roles(db: Session = Depends(get_db)):
    roles = db.query(models.Role).all()
    return [r.name for r in roles]
