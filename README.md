# Full Stack Todo Application with Better Auth

A complete, beautiful, and responsive task management application built with Next.js (frontend) and FastAPI (backend) with Better Auth authentication and PostgreSQL database.

## 🌟 Features

- **Beautiful UI**: Modern, responsive design with dark/light mode support
- **Secure Authentication**: Better Auth with JWT-based authentication
- **Multi-User Support**: Each user has isolated tasks and data
- **Task Management**: Create, read, update, delete, and toggle tasks
- **Filtering & Sorting**: Filter tasks by status and sort by date or title
- **Real-time Updates**: Instant UI updates after operations
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Accessibility**: Built with accessibility in mind (WCAG compliant)

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

### Backend
- **Framework**: FastAPI
- **ORM**: SQLModel
- **Database**: PostgreSQL (with Neon Serverless support)
- **Authentication**: JWT middleware with user isolation
- **API**: RESTful API design

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- Python 3.8+
- PostgreSQL (or Neon PostgreSQL account)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Set up environment variables in .env:
# BETTER_AUTH_SECRET=your_secret_key_here
# DATABASE_URL=postgresql://username:password@host:port/database_name
# ENVIRONMENT=development

# Initialize the database
python init_db.py

# Start the backend server
python start_server.py
# or
uvicorn main:app --reload --port 8005
```

The backend will be available at [http://localhost:8005](http://localhost:8005)

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Set up environment variables in .env.local:
# NEXT_PUBLIC_API_BASE_URL=http://localhost:8005
# NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8005

# Start the development server
npm run dev
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication Flow

1. User registers/signs in with email/password using Better Auth
2. Better Auth manages session and JWT tokens
3. Tokens are sent with all API requests to backend
4. Backend verifies JWT and enforces user isolation
5. Each user can only access their own tasks

## 📊 API Endpoints

The frontend communicates with the backend through these endpoints:

- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion status

## 🎨 UI Features

- **Responsive Layout**: Adapts to all screen sizes
- **Dark/Light Mode**: System-aware theme switching
- **Smooth Animations**: CSS transitions for better UX
- **Loading States**: Skeleton screens during data fetching
- **Form Validation**: Real-time validation with user feedback
- **Toast Notifications**: Success/error feedback for user actions
- **Instant Updates**: UI updates immediately after operations

## 🚢 Deployment

### Frontend Deployment

The Next.js frontend can be deployed to:
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify
- Any static hosting service

### Backend Deployment

The FastAPI backend can be deployed to:
- Render
- Railway
- AWS Elastic Beanstalk
- Google Cloud Run
- Any VPS with Docker support

## 🤝 Contributing

We welcome contributions to this project! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Add tests if applicable
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues, please:

1. Check that both frontend and backend are running
2. Verify environment variables are properly configured
3. Confirm database connection is established
4. Check that Better Auth is properly configured
5. Look for error messages in browser console and server logs

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [FastAPI](https://fastapi.tiangolo.com/) for the modern Python web framework
- [Better Auth](https://better-auth.com/) for the authentication solution
- [TanStack Query](https://tanstack.com/query) for state management
- [SQLModel](https://sqlmodel.tiangolo.com/) for the Python ORM
- [Lucide](https://lucide.dev/) for the beautiful icons

---

Made with ❤️ using Next.js, FastAPI, and Better Auth
