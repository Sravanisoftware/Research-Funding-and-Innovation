from sqlalchemy import Column, Integer, String, Boolean
from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    organization = Column(String, nullable=True)
    research_domain = Column(String, nullable=True)

    funding_alerts = Column(Boolean, default=True)
    patent_updates = Column(Boolean, default=True)
    technology_news = Column(Boolean, default=True)