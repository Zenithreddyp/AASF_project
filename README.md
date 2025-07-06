Official AASF project repo


🧠 AASF Project – Backend
This repository contains the backend of the AASF Project, powered by Django and Django REST Framework.

🚀 Getting Started
Follow these steps to set up and run the project locally.

🔧 Requirements
Python 3.10+ recommended

Virtual environment tool (venv)

pip package manager

📦 Installation Steps
1. Clone the Repository
bash
Copy
Edit
git clone https://github.com/your-username/AASF_project.git
cd AASF_project
2. Set Up a Virtual Environment
bash
Copy
Edit
python -m venv env
.\env\Scripts\activate  # On Windows
# source env/bin/activate  # On macOS/Linux
3. Install Dependencies
Make sure you're in the root directory where requirements.txt is located.

bash
Copy
Edit
pip install -r requirements.txt
📦 This installs:

Django

Django REST Framework

CORS Headers

Simple JWT

PostgreSQL Driver (psycopg2-binary)

Python Dotenv

And other core libraries

4. Start the Django Project
bash
Copy
Edit
django-admin startproject backend
cd backend
5. Create Your First App
bash
Copy
Edit
python manage.py startapp api
📁 Project Structure (After Initial Setup)
bash
Copy
Edit
AASF_project/
│
├── env/                    # Virtual environment
├── requirements.txt
├── backend/                # Django project
│   ├── backend/            # Django settings and wsgi/asgi files
│   └── api/                # Your first app
