
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.research_profile import ResearchProfile
from app.models.user import User
from app.schemas.research_profile import (
    ResearchProfileCreate,
    ResearchProfileResponse,
)
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/profile",
    tags=["Research Profile"]
)


# ============================================================
# CREATE RESEARCH PROFILE
# ============================================================

@router.post(
    "/",
    response_model=ResearchProfileResponse
)
def create_profile(
    profile: ResearchProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Find the currently logged-in user
    user = (
        db.query(User)
        .filter(
            User.email == current_user["email"]
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # Check whether this user already has a profile
    existing_profile = (
        db.query(ResearchProfile)
        .filter(
            ResearchProfile.user_id == user.id
        )
        .first()
    )

    if existing_profile:
        raise HTTPException(
            status_code=400,
            detail="Research profile already exists for this user"
        )

    # Create profile for logged-in user
    new_profile = ResearchProfile(
        user_id=user.id,
        research_domain=profile.research_domain,
        keywords=profile.keywords,
        publications=profile.publications,
        patents=profile.patents,
        technology_area=profile.technology_area,
        organization=profile.organization,
    )

    db.add(new_profile)
    db.commit()
    db.refresh(new_profile)

    return new_profile


# ============================================================
# GET CURRENT USER'S RESEARCH PROFILE
# ============================================================

@router.get(
    "/",
    response_model=ResearchProfileResponse
)
def get_profile(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.email == current_user["email"]
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    profile = (
        db.query(ResearchProfile)
        .filter(
            ResearchProfile.user_id == user.id
        )
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=404,
            detail="Research Profile not found for this user"
        )

    return profile


# ============================================================
# UPDATE CURRENT USER'S RESEARCH PROFILE
# ============================================================

@router.put(
    "/",
    response_model=ResearchProfileResponse
)
def update_profile(
    profile: ResearchProfileCreate,
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(
            User.email == current_user["email"]
        )
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing_profile = (
        db.query(ResearchProfile)
        .filter(
            ResearchProfile.user_id == user.id
        )
        .first()
    )

    if not existing_profile:
        raise HTTPException(
            status_code=404,
            detail="Research Profile not found for this user"
        )

    existing_profile.research_domain = profile.research_domain
    existing_profile.keywords = profile.keywords
    existing_profile.publications = profile.publications
    existing_profile.patents = profile.patents
    existing_profile.technology_area = profile.technology_area
    existing_profile.organization = profile.organization

    db.commit()
    db.refresh(existing_profile)

    return existing_profile

