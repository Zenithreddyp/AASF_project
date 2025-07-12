# 🧠 Official AASF Project

*Empowering Innovation, Accelerating Impact, Unleashing Potential*

[![Last Commit](https://img.shields.io/github/last-commit/Zenithreddyp/AASF_project?color=informational)](https://github.com/Zenithreddyp/AASF_project/commits)
![Top Language](https://img.shields.io/github/languages/top/Zenithreddyp/AASF_project)
![Language Count](https://img.shields.io/github/languages/count/Zenithreddyp/AASF_project)


---

## 🛠️ Built with the tools and technologies:

![Django](https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?logo=axios&logoColor=white)
![npm](https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=white)
![JSON](https://img.shields.io/badge/JSON-black?logo=json&logoColor=white)
![Pandas](https://img.shields.io/badge/Pandas-150458?logo=pandas&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?logo=scikit-learn&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-100000?logo=sqlalchemy&logoColor=white)


---

This repository contains the full-stack **AASF Project**, with a **Django** + **Django REST Framework** backend and a **React** + **Vite** frontend.

---

## 🚀 Getting Started

Follow these steps to get both backend and frontend up and running on your machine.

---

## 🔧 Requirements

- **Node.js** v18 or higher  
- **npm** (comes bundled with Node.js) **OR** **Yarn**
- Python 3.10+ (recommended)
- Virtual environment tool (`venv`)
- `pip` package manager

---

## 📦 Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Zenithreddyp/AASF_project.git
cd AASF_project
```

### 2. Backend Setup

  **Set Up a Virtual Environment**

```bash
python -m venv env
.\env\Scripts\activate  # On Windows
# source env/bin/activate  # On macOS/Linux
```

  **Install Dependencies**

```bash
pip install -r requirements.txt
```
  **Apply Migrations & Create Superuser**

```Bash
cd backend
python manage.py migrate
python manage.py createsuperuser
```

  **Run Django Development Server**
    
```bash
python manage.py runserver
```

### 3. Frontend Setup (In a new terminal)

  **Install Node Dependencies**

```bash
cd ../frontend

# Using npm
npm install

# Or using Yarn
yarn install
```
  **Configure Environment Variables**
  
Create a `.env` file in the `frontend/` directory with the following content:

```Bash
VITE_API_BASE_URL=http://localhost:8000/api
```
Note: All environment variables must be prefixed with `VITE_` to be exposed to the client-side code.

  **Start Development Server**
    
```bash
# Using npm
npm run dev

# Or using Yarn
yarn dev
```


##
```bash
AASF_project/
├── env/                  # Python virtual environment
├── requirements.txt      # Python dependencies
├── backend/              # Django project
│   ├── backend/          # Django settings & URLs
│   ├── apps/             # Django apps (e.g. users, posts, etc.)
│   ├── manage.py
│   └── ...
└── frontend/             # React + Vite project
    ├── node_modules/     # Node dependencies
    ├── public/           # Static assets & index.html
    ├── src/
    │   ├── assets/       # Images, fonts, styles
    │   ├── components/   # Reusable React components
    │   ├── pages/        # Route-level views
    │   ├── routes/       # React Router config
    │   ├── App.jsx       # Root component + router outlet
    │   ├── index.jsx     # App entry point
    │   └── main.css      # Global CSS
    ├── .eslintrc.js      # ESLint configuration
    ├── package.json
    └── vite.config.js    # Vite config & aliases
```

