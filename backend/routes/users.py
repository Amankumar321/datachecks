from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import timedelta
from fastapi.security import OAuth2PasswordRequestForm
import models, schemas, auth, database

router = APIRouter()

db_dependency = Depends(database.get_db)

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: Session = db_dependency):
    db_user = db.query(models.User).filter(models.User.username == user.username).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    hashed_password = auth.get_password_hash(user.password)
    new_user = models.User(username=user.username, hashed_password=hashed_password)
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    access_token = auth.create_access_token(
        {"sub": new_user.username},
        timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = db_dependency):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid username or password")

    access_token = auth.create_access_token(
        {"sub": user.username},
        timedelta(minutes=auth.ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    return {"access_token": access_token, "token_type": "bearer"}
