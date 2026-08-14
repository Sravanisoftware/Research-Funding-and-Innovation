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
🛠️ Tech Stack
Frontend
React.js
Vite
Tailwind CSS
Axios
React Router DOM
Lucide React
Recharts
Backend
Python
FastAPI
Uvicorn
SQLAlchemy
Pydantic
JWT Authentication
Passlib
Database
PostgreSQL
Development Tools
Visual Studio Code
Git
GitHub
pgAdmin
Postman
FastAPI Swagger / OpenAPI
📂 Project Structure
Research-Funding-and-Innovation/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── researchx-ui/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   ├── package.json
│   └── vite.config.js
│
├── frontend/
│
├── .gitignore
├── LICENSE
└── README.md

researchx-ui is the current React/Vite frontend application.

⚙️ Prerequisites

Before running ResearchX locally, install:

Python 3.x
Node.js
npm
PostgreSQL
Git
Visual Studio Code
pgAdmin (recommended)
🚀 Installation and Setup
1. Clone the Repository
git clone https://github.com/<repository-url>.git
cd Research-Funding-and-Innovation
🔹 Backend Setup

Navigate to the backend:

cd backend

Create a virtual environment:

python -m venv venv

Activate the virtual environment on Windows:

venv\Scripts\activate

Install the required dependencies:

pip install -r requirements.txt
🗄️ Database Setup

Create a PostgreSQL database named:

research_db

Configure the backend with the appropriate PostgreSQL database connection.

The database contains application data used by the ResearchX platform.

Example:

PostgreSQL
    │
    └── research_db
          │
          └── public
                │
                ├── users
                ├── patents
                ├── funding
                ├── technologies
                └── other application tables

Database passwords, JWT secrets, API keys, and other sensitive credentials should never be committed to GitHub.

▶️ Run the Backend

From the backend directory:

uvicorn app.main:app --reload

Backend URL:

http://127.0.0.1:8000
📚 FastAPI API Documentation

Once the backend is running, Swagger UI is available at:

http://127.0.0.1:8000/docs

Alternative API documentation:

http://127.0.0.1:8000/redoc
🔹 Frontend Setup

Open a new terminal.

Navigate to the React application:

cd Research-Funding-and-Innovation
cd researchx-ui

Install dependencies:

npm install
▶️ Run the Frontend

Start the Vite development server:

npm run dev

Frontend URL:

http://localhost:5173
🔄 Running the Complete Application

ResearchX requires the backend and frontend to run simultaneously during local development.

Terminal 1 — Backend
cd backend
venv\Scripts\activate
uvicorn app.main:app --reload

Backend:

http://127.0.0.1:8000
Terminal 2 — Frontend
cd researchx-ui
npm run dev

Frontend:

http://localhost:5173
🔐 Authentication Flow

ResearchX uses JWT-based authentication.

User
  │
  ▼
Login Page
  │
  │ Email + Password
  ▼
React Frontend
  │
  │ POST /login
  ▼
FastAPI Backend
  │
  ├── Find User
  ├── Verify Password
  └── Generate JWT
  │
  ▼
Access Token
  │
  ▼
React Frontend
  │
  ▼
Dashboard
📡 API Endpoints
Authentication
Register
POST /register

Used to create a new user account.

Login
POST /login

Used to authenticate a user and generate an access token.

Research Profile
Get Profile
GET /profile
Create Profile
POST /profile

Used to manage researcher profile information.

Patents
Get Patents
GET /patents/

Provides patent repository information including available patent-related details.

Funding
Get Funding Opportunities
GET /funding/

Provides available funding opportunities and related information.

Technologies
Get Technologies
GET /technologies/

Provides emerging technology information and technology growth data.

Innovation
Get Innovation Information
GET /innovation/

Provides innovation-related information used by the platform.

Commercialization
Commercialization Information
GET /commercialization/

Provides commercialization-related information.

AI Recommendation
GET /commercialization/recommendation

Provides AI-driven commercialization insights such as:

Innovation Score
Commercialization Readiness
Target Industry
Recommended Funding
Risk Level
Startup Potential
Recommended Action
🖥️ Application Pages
/
│
├── Landing Page
│
├── /login
│   └── Authentication
│
├── /dashboard
│   └── Research Dashboard
│
├── /patents
│   └── Patent Repository
│
├── /funding
│   └── Funding Opportunities
│
├── /technologies
│   └── Technology Intelligence
│
├── /ai
│   └── AI Insights
│
├── /ai-insights
│   └── AI Insights
│
├── /analytics
│   └── Research Analytics
│
└── /settings
    └── User Settings
📊 Dashboard

The ResearchX dashboard provides a centralized overview of research and innovation information.

It includes:

Statistics Cards
Patent count
Technology count
Funding count
Technology Growth Analysis

Displays technology growth scores using interactive charts.

Patent Distribution

Groups patents according to their technology domains.

AI Research Summary

Displays AI-driven commercialization insights.

🤖 AI Research Insights

The AI Insights module provides commercialization intelligence to help researchers understand the potential of their research.

The platform provides:

Innovation Score
        │
        ▼
Commercialization Readiness
        │
        ▼
Target Industry
        │
        ▼
Recommended Funding
        │
        ▼
Risk Level
        │
        ▼
Startup Potential
        │
        ▼
AI Recommendation

Example response:

{
  "innovation_score": 59.48,
  "commercialization_readiness": "Moderate",
  "target_industry": "Healthcare",
  "recommended_funding": "AICTE Research Funding",
  "risk_level": "Medium",
  "startup_potential": "Medium",
  "recommended_action": "Industry Collaboration"
}
📈 Data Visualization

ResearchX uses Recharts to visualize research and innovation information.

Current visualizations include:

Technology Growth Analysis
Patent Distribution
Patent Analytics
Funding Analytics
Research Statistics

Interactive charts make it easier to identify research trends and compare data.

🔗 Frontend–Backend Communication

The React frontend communicates with the FastAPI backend using Axios and REST APIs.

Example:

axios.get(
  "http://127.0.0.1:8000/patents/"
);

Communication flow:

React Component
      │
      ▼
Axios Request
      │
      ▼
FastAPI Router
      │
      ▼
Service Layer
      │
      ▼
SQLAlchemy
      │
      ▼
PostgreSQL
      │
      ▼
JSON Response
      │
      ▼
React UI
🔒 Security

ResearchX implements security mechanisms including:

JWT authentication
Secure password hashing
Authentication-based login
Protected authentication information
Environment-based configuration for sensitive credentials

Sensitive information should never be committed to GitHub.

Examples include:

Database passwords
JWT secret keys
API keys
External service credentials
🧪 Testing Checklist

Before deployment, verify the following.

Backend
✓ Backend starts successfully
✓ FastAPI Swagger documentation loads
✓ PostgreSQL connection works
✓ User registration works
✓ User login works
✓ JWT token is generated
✓ Patent API works
✓ Funding API works
✓ Technology API works
✓ Innovation API works
✓ Commercialization API works
✓ AI recommendation API works
Frontend
✓ Landing Page works
✓ Login Page works
✓ Dashboard works
✓ Patents Page works
✓ Funding Page works
✓ Technologies Page works
✓ AI Insights Page works
✓ Analytics Page works
✓ Settings Page works
Integration
✓ Frontend communicates with backend
✓ API responses appear correctly
✓ PostgreSQL data appears in the UI
✓ Login redirects to dashboard
✓ AI recommendation data appears correctly
✓ Charts load correctly
🌐 Deployment Architecture

For production deployment, ResearchX can be deployed using separate frontend, backend, and PostgreSQL hosting services.

                     Internet
                         │
                         ▼
              ┌────────────────────┐
              │  ResearchX Frontend│
              │    React + Vite    │
              └─────────┬──────────┘
                        │
                       HTTPS
                        │
                        ▼
              ┌────────────────────┐
              │  ResearchX Backend │
              │      FastAPI       │
              └─────────┬──────────┘
                        │
                        ▼
              ┌────────────────────┐
              │    PostgreSQL      │
              │   Production DB    │
              └────────────────────┘

During production deployment, local development URLs such as:

http://127.0.0.1:8000

should be replaced with the deployed backend URL.

🔐 Environment Variables

Sensitive configuration should be stored using environment variables.

Example backend configuration:

DATABASE_URL=your_database_connection_string
SECRET_KEY=your_jwt_secret

Frontend configuration:

VITE_API_URL=your_backend_url

Never commit .env files containing secrets to GitHub.

🎯 Project Objective

The main objective of ResearchX is to provide researchers with a centralized research intelligence platform where they can:

Discover research funding opportunities.
Explore patent information.
Analyze emerging technologies.
View research and innovation analytics.
Evaluate commercialization potential.
Identify suitable target industries.
Discover potentially relevant funding opportunities.
Obtain AI-driven research recommendations.
🚀 Future Enhancements

Future versions of ResearchX may include:

Advanced AI research recommendation models
Research paper discovery
Automated funding matching
Patent similarity detection
Researcher collaboration
Email notifications
Real-time funding alerts
Advanced role-based access control
Cloud deployment
Automated testing
CI/CD integration
Advanced research trend prediction
👩‍💻 Project Development

ResearchX demonstrates the integration of modern web development technologies:

React
   +
FastAPI
   +
PostgreSQL
   +
SQLAlchemy
   +
JWT Authentication
   +
REST APIs
   +
Data Visualization
   +
AI-driven Insights
📄 License

This project is licensed under the MIT License.

See the LICENSE file for the complete license text.



**This is the version I recommend you keep for the milestone review.** It is comprehensive enough without turning the README into a technical report.
