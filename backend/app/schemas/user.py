from pydantic import BaseModel, EmailStr
from typing import Optional


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str
    role: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserSettingsUpdate(BaseModel):
    name: str
    organization: Optional[str] = None
    research_domain: Optional[str] = None

    funding_alerts: bool = True
    patent_updates: bool = True
    technology_news: bool = True


class UserSettingsResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    organization: Optional[str] = None
    research_domain: Optional[str] = None

    funding_alerts: bool
    patent_updates: bool
    technology_news: bool

    class Config:
        from_attributes = True