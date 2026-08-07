
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.patent import Patent
from app.schemas.patent import (
    PatentCreate,
    PatentUpdate,
    PatentResponse,
)

from app.auth.dependencies import require_admin


router = APIRouter(
    prefix="/patents",
    tags=["Patent Intelligence"]
)


# ============================================================
# CREATE PATENT
# ADMIN ONLY
# ============================================================

@router.post(
    "/",
    response_model=PatentResponse,
    dependencies=[Depends(require_admin)]
)
def create_patent(
    patent: PatentCreate,
    db: Session = Depends(get_db)
):
    new_patent = Patent(
        **patent.model_dump()
    )

    db.add(new_patent)
    db.commit()
    db.refresh(new_patent)

    return new_patent


# ============================================================
# GET ALL PATENTS
# ============================================================

@router.get(
    "/",
    response_model=list[PatentResponse]
)
def get_all_patents(
    db: Session = Depends(get_db)
):
    return db.query(Patent).all()


# ============================================================
# SEARCH BY TECHNOLOGY DOMAIN
# ============================================================

@router.get(
    "/search/domain",
    response_model=list[PatentResponse]
)
def search_by_domain(
    technology_domain: str,
    db: Session = Depends(get_db)
):
    patents = (
        db.query(Patent)
        .filter(
            Patent.technology_domain.ilike(
                f"%{technology_domain}%"
            )
        )
        .all()
    )

    return patents


# ============================================================
# SEARCH BY ASSIGNEE
# ============================================================

@router.get(
    "/search/assignee",
    response_model=list[PatentResponse]
)
def search_by_assignee(
    assignee: str,
    db: Session = Depends(get_db)
):
    patents = (
        db.query(Patent)
        .filter(
            Patent.assignee.ilike(
                f"%{assignee}%"
            )
        )
        .all()
    )

    return patents


# ============================================================
# PATENT STATISTICS
# ============================================================

@router.get("/statistics")
def patent_statistics(
    db: Session = Depends(get_db)
):
    total = db.query(Patent).count()

    granted = (
        db.query(Patent)
        .filter(Patent.status == "Granted")
        .count()
    )

    pending = (
        db.query(Patent)
        .filter(Patent.status == "Pending")
        .count()
    )

    published = (
        db.query(Patent)
        .filter(Patent.status == "Published")
        .count()
    )

    return {
        "total_patents": total,
        "granted_patents": granted,
        "pending_patents": pending,
        "published_patents": published
    }


# ============================================================
# PATENT DOMAIN ANALYTICS
# ============================================================

@router.get("/domain-summary")
def domain_summary(
    db: Session = Depends(get_db)
):
    results = (
        db.query(
            Patent.technology_domain,
            func.count(Patent.id).label("count")
        )
        .group_by(Patent.technology_domain)
        .all()
    )

    return [
        {
            "technology_domain": domain,
            "count": count
        }
        for domain, count in results
    ]


# ============================================================
# AI PATENT INSIGHTS
# ============================================================

@router.get("/ai-insights")
def patent_ai_insights(
    db: Session = Depends(get_db)
):
    patents = db.query(Patent).all()

    if not patents:
        return {
            "total_patents": 0,
            "highest_citation_patent": None,
            "most_active_domain": None,
            "average_citations": 0,
            "grant_rate": 0,
            "insights": [],
            "recommendations": []
        }

    # --------------------------------------------------------
    # Highest citation patent
    # --------------------------------------------------------

    highest_citation_patent = max(
        patents,
        key=lambda patent: int(
            patent.citation_count or 0
        )
    )

    # --------------------------------------------------------
    # Domain counts
    # --------------------------------------------------------

    domain_counts = {}

    for patent in patents:

        domain = (
            patent.technology_domain
            or "Unknown"
        )

        domain_counts[domain] = (
            domain_counts.get(domain, 0) + 1
        )

    most_active_domain = max(
        domain_counts,
        key=domain_counts.get
    )

    # --------------------------------------------------------
    # Citation calculations
    # --------------------------------------------------------

    total_citations = sum(
        int(patent.citation_count or 0)
        for patent in patents
    )

    average_citations = (
        total_citations / len(patents)
    )

    # --------------------------------------------------------
    # Grant rate
    # --------------------------------------------------------

    granted_count = sum(
        1
        for patent in patents
        if patent.status == "Granted"
    )

    grant_rate = (
        granted_count / len(patents)
    ) * 100

    # --------------------------------------------------------
    # Insights
    # --------------------------------------------------------

    insights = []

    insights.append({
        "title": "Highest Impact Patent",
        "description": (
            f"{highest_citation_patent.patent_title} "
            f"has the highest citation count with "
            f"{highest_citation_patent.citation_count} "
            f"citations."
        ),
        "type": "impact"
    })

    insights.append({
        "title": "Leading Technology Domain",
        "description": (
            f"{most_active_domain} is currently the "
            f"most active technology domain with "
            f"{domain_counts[most_active_domain]} "
            f"patents."
        ),
        "type": "domain"
    })

    insights.append({
        "title": "Patent Portfolio Health",
        "description": (
            f"{grant_rate:.0f}% of the patent portfolio "
            f"is currently granted."
        ),
        "type": "health"
    })

    insights.append({
        "title": "Citation Performance",
        "description": (
            f"The portfolio has an average of "
            f"{average_citations:.1f} citations "
            f"per patent."
        ),
        "type": "citation"
    })

    # --------------------------------------------------------
    # Recommendations
    # --------------------------------------------------------

    recommendations = []

    if (
        highest_citation_patent.citation_count
        and highest_citation_patent.citation_count >= 20
    ):
        recommendations.append(
            "Prioritize high-citation patents for "
            "research commercialization and funding "
            "opportunities."
        )

    if domain_counts[most_active_domain] >= 2:
        recommendations.append(
            f"Consider additional research funding "
            f"in {most_active_domain} because it has "
            f"the highest patent activity."
        )

    if grant_rate >= 75:
        recommendations.append(
            "The portfolio has a strong grant rate. "
            "Consider expanding research "
            "commercialization efforts."
        )

    if average_citations >= 15:
        recommendations.append(
            "Citation performance is strong. "
            "High-impact patents may have potential "
            "for technology transfer and industry "
            "collaboration."
        )

    # --------------------------------------------------------
    # Return AI Insights
    # --------------------------------------------------------

    return {
        "total_patents": len(patents),

        "highest_citation_patent": {
            "id": highest_citation_patent.id,
            "patent_title": (
                highest_citation_patent.patent_title
            ),
            "technology_domain": (
                highest_citation_patent.technology_domain
            ),
            "citation_count": (
                highest_citation_patent.citation_count
            ),
            "status": (
                highest_citation_patent.status
            )
        },

        "most_active_domain": {
            "domain": most_active_domain,
            "count": domain_counts[
                most_active_domain
            ]
        },

        "average_citations": round(
            average_citations,
            1
        ),

        "grant_rate": round(
            grant_rate,
            1
        ),

        "insights": insights,

        "recommendations": recommendations
    }


# ============================================================
# GET PATENT BY ID
# ============================================================

@router.get(
    "/{patent_id}",
    response_model=PatentResponse
)
def get_patent(
    patent_id: int,
    db: Session = Depends(get_db)
):
    patent = (
        db.query(Patent)
        .filter(Patent.id == patent_id)
        .first()
    )

    if not patent:
        raise HTTPException(
            status_code=404,
            detail="Patent not found"
        )

    return patent


# ============================================================
# UPDATE PATENT
# ADMIN ONLY
# ============================================================

@router.put(
    "/{patent_id}",
    response_model=PatentResponse,
    dependencies=[Depends(require_admin)]
)
def update_patent(
    patent_id: int,
    updated_patent: PatentUpdate,
    db: Session = Depends(get_db)
):
    patent = (
        db.query(Patent)
        .filter(Patent.id == patent_id)
        .first()
    )

    if not patent:
        raise HTTPException(
            status_code=404,
            detail="Patent not found"
        )

    update_data = updated_patent.model_dump(
        exclude_unset=True
    )

    for key, value in update_data.items():
        setattr(
            patent,
            key,
            value
        )

    db.commit()
    db.refresh(patent)

    return patent


# ============================================================
# DELETE PATENT
# ADMIN ONLY
# ============================================================

@router.delete(
    "/{patent_id}",
    dependencies=[Depends(require_admin)]
)
def delete_patent(
    patent_id: int,
    db: Session = Depends(get_db)
):
    patent = (
        db.query(Patent)
        .filter(Patent.id == patent_id)
        .first()
    )

    if not patent:
        raise HTTPException(
            status_code=404,
            detail="Patent not found"
        )

    db.delete(patent)
    db.commit()

    return {
        "message": "Patent deleted successfully"
    }

