
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.funding_opportunity import FundingOpportunity
from app.models.research_profile import ResearchProfile
from app.models.user import User
from app.schemas.funding_opportunity import (
    FundingOpportunityCreate,
    FundingOpportunityResponse,
)
from app.auth.dependencies import get_current_user


router = APIRouter(
    prefix="/funding",
    tags=["Funding Opportunity"]
)


# ============================================================
# CREATE FUNDING OPPORTUNITY
# ============================================================

@router.post(
    "/",
    response_model=FundingOpportunityResponse
)
def create_funding(
    funding: FundingOpportunityCreate,
    db: Session = Depends(get_db)
):
    new_funding = FundingOpportunity(
        title=funding.title,
        organization=funding.organization,
        description=funding.description,
        eligibility=funding.eligibility,
        funding_amount=funding.funding_amount,
        deadline=funding.deadline,
        research_domain=funding.research_domain,
    )

    db.add(new_funding)
    db.commit()
    db.refresh(new_funding)

    return new_funding


# ============================================================
# GET ALL FUNDING OPPORTUNITIES
# ============================================================

@router.get(
    "/",
    response_model=list[FundingOpportunityResponse]
)
def get_all_funding(
    db: Session = Depends(get_db)
):
    return db.query(FundingOpportunity).all()


# ============================================================
# USER-SPECIFIC FUNDING RECOMMENDATIONS
# ============================================================

@router.get("/recommendations/")
def get_recommendations(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # --------------------------------------------------------
    # Find logged-in user
    # --------------------------------------------------------

    user = (
        db.query(User)
        .filter(User.email == current_user["email"])
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    # --------------------------------------------------------
    # Find research profile belonging to this user
    # --------------------------------------------------------

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

    # --------------------------------------------------------
    # Match funding with user's research domain
    # --------------------------------------------------------

    recommendations = (
        db.query(FundingOpportunity)
        .filter(
            FundingOpportunity.research_domain.ilike(
                f"%{profile.research_domain}%"
            )
        )
        .all()
    )

    return {
        "user": user.email,
        "research_domain": profile.research_domain,
        "recommended_funding": recommendations
    }


# ============================================================
# GET FUNDING OPPORTUNITY BY ID
# ============================================================

@router.get(
    "/{funding_id}",
    response_model=FundingOpportunityResponse
)
def get_funding(
    funding_id: int,
    db: Session = Depends(get_db)
):
    funding = (
        db.query(FundingOpportunity)
        .filter(
            FundingOpportunity.id == funding_id
        )
        .first()
    )

    if not funding:
        raise HTTPException(
            status_code=404,
            detail="Funding Opportunity not found"
        )

    return funding


# ============================================================
# UPDATE FUNDING OPPORTUNITY
# ============================================================

@router.put(
    "/{funding_id}",
    response_model=FundingOpportunityResponse
)
def update_funding(
    funding_id: int,
    updated: FundingOpportunityCreate,
    db: Session = Depends(get_db)
):
    funding = (
        db.query(FundingOpportunity)
        .filter(
            FundingOpportunity.id == funding_id
        )
        .first()
    )

    if not funding:
        raise HTTPException(
            status_code=404,
            detail="Funding Opportunity not found"
        )

    funding.title = updated.title
    funding.organization = updated.organization
    funding.description = updated.description
    funding.eligibility = updated.eligibility
    funding.funding_amount = updated.funding_amount
    funding.deadline = updated.deadline
    funding.research_domain = updated.research_domain

    db.commit()
    db.refresh(funding)

    return funding


# ============================================================
# DELETE FUNDING OPPORTUNITY
# ============================================================

@router.delete("/{funding_id}")
def delete_funding(
    funding_id: int,
    db: Session = Depends(get_db)
):
    funding = (
        db.query(FundingOpportunity)
        .filter(
            FundingOpportunity.id == funding_id
        )
        .first()
    )

    if not funding:
        raise HTTPException(
            status_code=404,
            detail="Funding Opportunity not found"
        )

    db.delete(funding)
    db.commit()

    return {
        "message": "Funding Opportunity deleted successfully"
    }

