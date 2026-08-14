# 🚀 ResearchX — Research Funding and Innovation Platform

ResearchX is an AI-powered Research Funding and Innovation Platform designed to help researchers discover funding opportunities, explore patents, analyze emerging technologies, and gain AI-driven commercialization insights through an interactive dashboard.

---

## 📌 Features

### 🔐 Authentication
- User Registration
- User Login
- JWT Authentication
- Secure Password Hashing
- User Profile Management

### 📊 Dashboard
- Research Analytics
- Funding Statistics
- Patent Statistics
- Technology Insights
- AI Recommendation Cards
- Interactive Data Visualization

### 📑 Patent Management
- View Patent Repository
- Patent Details
- Citation Count
- Patent Status
- Technology Domain
- Patent Distribution Analysis

### 💰 Funding Opportunities
- Funding Opportunities
- Funding Agencies
- Grant Amount
- Application Deadline
- Funding Information

### 💡 Technology Intelligence
- Emerging Technologies
- Technology Domains
- Technology Growth Scores
- Innovation Trends
- Technology Growth Analysis

### 🤖 AI Insights
- AI-based Research Recommendations
- Innovation Score
- Commercialization Readiness
- Target Industry
- Recommended Funding
- Risk Level
- Startup Potential
- AI Commercialization Recommendation

### 📈 Analytics
- Patent Analytics
- Funding Analytics
- Technology Analytics
- Research Statistics
- Interactive Charts

### ⚙️ Settings
- User Profile
- Organization Information
- Account Settings

---

# 🏗️ System Architecture

```text
                         ┌─────────────────────┐
                         │        User         │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │  ResearchX Frontend │
                         │                     │
                         │ React + Vite        │
                         │ Tailwind CSS        │
                         │ Axios               │
                         └──────────┬──────────┘
                                    │
                              REST API / Axios
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   FastAPI Backend   │
                         │                     │
                         │ Authentication      │
                         │ Patents             │
                         │ Funding             │
                         │ Technologies        │
                         │ Analytics           │
                         │ AI Insights         │
                         └──────────┬──────────┘
                                    │
                              SQLAlchemy ORM
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │     PostgreSQL      │
                         │     research_db     │
                         └─────────────────────┘
