# Event Log Search Application

A high-performance web application for searching through event log data files, built with **Django REST Framework** and **React + TypeScript + Tailwind CSS + Axios**.

## Features

- 🔍 **Multi-field Search**: Search by IP address, account ID, action, log status, and more
- ⏱️ **Time Range Filtering**: Filter events using epoch timestamps
- 📁 **File Upload**: Upload new event files through the UI
- ⚡ **High Performance**: Concurrent file processing with ThreadPoolExecutor
- 📊 **Search Metrics**: Display search time, results count, and source file
- 🐳 **Docker Support**: One-command deployment with docker-compose
- 🔄 **Axios Integration**: Enhanced HTTP client with interceptors and better error handling

## Tech Stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, Django 4.x, Django REST Framework |
| Frontend | React 19, TypeScript, Tailwind CSS 4, Vite 7, Axios |
| Deployment | Docker, docker-compose, Gunicorn, Nginx |

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker** (v20.10+) and **Docker Compose** (v2.0+)
- **Node.js** (v18+) and **npm** (v9+) - for local development only
- **Python** (v3.11+) - for local development only

## Getting Started

### 🐳 Option 1: Docker (Recommended)

This is the **easiest and recommended** way to run the application.

#### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd AceableCyberSolutionsAssignment
```

#### Step 2: Start the Application
```bash
# Build and start both frontend and backend services
docker-compose up --build
```

This command will:
- Build Docker images for both frontend and backend
- Start the backend on `http://localhost:8000`
- Start the frontend on `http://localhost:5173`
- Mount the `events/` directory for event log files

#### Step 3: Access the Application
- **Frontend UI**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:8000/api/](http://localhost:8000/api/)
- **Health Check**: [http://localhost:8000/api/health/](http://localhost:8000/api/health/)

#### Step 4: Upload Event Files (Optional)
If you have event log files, you can:
1. Place them in the `events/` directory, OR
2. Use the **Upload** feature in the web UI

#### Stop the Application
```bash
# Stop and remove containers
docker-compose down

# Stop and remove containers + volumes
docker-compose down -v
```

---

### 💻 Option 2: Manual Setup (Development)

Use this option if you want to develop or modify the code.

#### Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations (if needed)
python manage.py migrate

# Start development server
python manage.py runserver
# Backend will be available at http://localhost:8000
```

#### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
# Frontend will be available at http://localhost:5173
```

> **Note**: When running manually, update the `VITE_API_URL` in `frontend/.env` to point to your backend URL if different from the default.

---

## API Endpoints

### Search Events
```http
POST /api/events/search/

Request Body:
{
  "search_string": "159.62.125.136",
  "earliest_time": 1725850449,
  "latest_time": 1725855086,
  "max_results": 100
}

Response:
{
  "success": true,
  "search_time_seconds": 0.30,
  "total_results": 1,
  "results_returned": 1,
  "files_searched": 676,
  "results": [
    {
      "serialno": 2,
      "version": 2,
      "account_id": "123456789012",
      "instance_id": "eni-abc123",
      "srcaddr": "159.62.125.136",
      "dstaddr": "30.55.177.194",
      "srcport": 443,
      "dstport": 80,
      "protocol": 6,
      "packets": 10,
      "bytes": 5000,
      "starttime": 1725850449,
      "endtime": 1725855086,
      "action": "REJECT",
      "log_status": "OK",
      "source_file": "xaa"
    }
  ]
}
```

### Upload Files
```http
POST /api/events/upload/
Content-Type: multipart/form-data

Files are stored in the events/ directory and immediately searchable.

Response:
{
  "success": true,
  "files_uploaded": ["event_log_1.txt", "event_log_2.txt"],
  "total_files": 2,
  "message": "Successfully uploaded 2 files"
}
```

### Health Check
```http
GET /api/health/

Response:
{
  "status": "healthy",
  "total_event_files": 676,
  "events_dir": "/app/events",
  "uploads_dir": "/app/uploads"
}
```

---

## Event Data Format

Each event file contains space-delimited records with these fields:

```
serialno | version | account-id | instance-id | srcaddr | dstaddr | srcport | dstport | protocol | packets | bytes | starttime | endtime | action | log-status
```

**Example:**
```
2 2 123456789012 eni-abc123 159.62.125.136 30.55.177.194 443 80 6 10 5000 1725850449 1725855086 REJECT OK
```

---