# 🧠 Official AASF Project

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

### 3. Frontend Setup

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

