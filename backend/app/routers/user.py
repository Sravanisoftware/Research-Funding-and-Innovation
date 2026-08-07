from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.security import hash_password, verify_password
from app.auth.jwt_handler import create_access_token
from app.database.database import get_db
from app.models.user import User
from app.schemas.user import (
    UserCreate,
    UserLogin,
    UserSettingsUpdate,
    UserSettingsResponse,
)

router = APIRouter()


@router.get("/test")
def test():
    return {"message": "User router is working!"}


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role,
        organization=None,
        research_domain=None,
        funding_alerts=True,
        patent_updates=True,
        technology_news=True,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully!",
        "id": new_user.id
    }


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        return {"message": "Invalid email or password"}

    if not verify_password(user.password, db_user.password):
        return {"message": "Invalid email or password"}

    token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/settings/{email}",
    response_model=UserSettingsResponse
)
def get_settings(
    email: str,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    return user


@router.put(
    "/settings/{email}",
    response_model=UserSettingsResponse
)
def update_settings(
    email: str,
    settings: UserSettingsUpdate,
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.email == email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    user.name = settings.name
    user.organization = settings.organization
    user.research_domain = settings.research_domain

    user.funding_alerts = settings.funding_alerts
    user.patent_updates = settings.patent_updates
    user.technology_news = settings.technology_news

    db.commit()
    db.refresh(user)

    return user