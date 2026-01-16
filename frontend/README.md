# Todo App Frontend

A beautiful, responsive, and user-friendly task management application built with Next.js, TypeScript, and Tailwind CSS.

## Features

- 🎨 Beautiful UI with dark/light mode support
- 🔐 Secure authentication with Better Auth
- 📱 Fully responsive design (mobile, tablet, desktop)
- ⚡ Optimistic updates for smooth UX
- 🔍 Task filtering and sorting
- 🔄 Real-time data synchronization

## Tech Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Better Auth with JWT
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the frontend directory and add your environment variables:
```bash
cp .env.example .env.local
```

4. Update the `.env.local` file with your actual configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here-make-sure-it-is-at-least-32-characters-long
```

> **Important**: Generate a strong secret key for `BETTER_AUTH_SECRET`. You can use an online generator or run `openssl rand -base64 32` in your terminal.

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Backend Requirements

This frontend expects a backend API running on `http://localhost:8000` with the following endpoints:

- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/toggle` - Toggle task completion

## Environment Variables

- `NEXT_PUBLIC_API_BASE_URL` - Base URL for the backend API
- `NEXT_PUBLIC_BETTER_AUTH_URL` - URL for Better Auth
- `BETTER_AUTH_URL` - Internal URL for Better Auth
- `BETTER_AUTH_SECRET` - Secret key for JWT signing (at least 32 characters)

## Folder Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header
│   ├── page.tsx           # Home page (redirects to /tasks or /signin)
│   ├── signin/page.tsx    # Login page
│   ├── signup/page.tsx    # Registration page
│   └── tasks/
│       ├── layout.tsx     # Tasks section layout
│       └── page.tsx       # Main tasks page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── Header.tsx        # Navigation header
│   ├── TaskCard.tsx      # Individual task display
│   ├── TaskList.tsx      # Task list container
│   ├── TaskModal.tsx     # Create/edit task modal
│   └── EmptyState.tsx    # Empty task list state
├── lib/                  # Utility functions and API client
│   ├── api.ts            # API client with authentication
│   ├── auth.ts           # Authentication utilities
│   └── queries.ts        # TanStack Query hooks
├── types/                # TypeScript type definitions
├── styles/               # Global styles
└── public/               # Static assets
```

## Authentication Flow

1. Users sign up or sign in via the authentication pages
2. Better Auth manages user sessions with JWT tokens
3. All API requests automatically include the authentication token
4. Protected routes redirect unauthenticated users to the sign-in page

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT