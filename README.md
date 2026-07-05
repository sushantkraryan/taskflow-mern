# TaskFlow

TaskFlow is a full-stack task management application built with the MERN stack. It helps users organize tasks, track progress, and stay focused with a polished and interactive dashboard experience.

## Features

- User authentication with signup/login
- Protected routes for authenticated users
- Create, edit, delete, and update tasks
- Mark tasks as done or reopen them
- Star/favorite important tasks
- Search and filter tasks by status, priority, and category
- Progress insights and completed-wins section
- Responsive and modern UI

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT authentication

## Project Structure

```bash
backend/
  controllers/
  middleware/
  models/
  routes/
  config/
  server.js

frontend/
  src/
    components/
    context/
    pages/
    api/
```

## Getting Started

### Prerequisites
- Node.js installed
- MongoDB running locally or accessible remotely

### Backend Setup

```bash
cd backend
npm install
node server.js
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file in the backend folder with values similar to:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## Usage

1. Sign up for a new account
2. Log in to your dashboard
3. Create tasks and organize your work
4. Mark tasks as completed and star important ones

## Deployment

You can deploy the app on platforms like:
- Vercel (frontend)
- Render / Railway / Fly.io (backend)

## Future Improvements

- Dark mode
- Drag-and-drop task organization
- Reminders and notifications
- Subtasks and recurring tasks

## Author

Built as a full-stack MERN project to showcase authentication, CRUD, UI/UX, and deployment skills.
