import os
from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from dotenv import load_dotenv

from . import models, schemas, auth, database, roles
from .database import engine, SessionLocal
from .schemas import ChangePasswordRequest

from fastapi.security import OAuth2PasswordRequestForm

load_dotenv()

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.on_event("startup")
def create_admin():
    db = SessionLocal()
    admin_username = os.getenv("ADMIN_USERNAME", "admin")
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

    existing = db.query(models.User).filter(models.User.username == admin_username).first()
    if not existing:
        admin_user = models.User(
            username=admin_username,
            hashed_password=auth.get_password_hash(admin_password),
            role="admin"
        )
        db.add(admin_user)
        db.commit()
        print("Admin user created.")
    db.close()


@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = db.query(models.User).filter(models.User.username == user.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already taken")
    hashed_pw = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, hashed_password=hashed_pw)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {"msg": "User created successfully"}


@app.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
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
    current_user = Depends(auth.get_current_user)
):
    user = db.query(models.User).filter(models.User.username == current_user.username).first()

    if not auth.verify_password(req.old_password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Old password is incorrect")

    user.hashed_password = auth.get_password_hash(req.new_password)
    db.commit()

    return {"msg": "Password updated successfully"}