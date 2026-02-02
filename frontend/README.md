# Todo App Frontend - Production Deployment

A beautiful, responsive, and user-friendly task management application built with Next.js, TypeScript, and Tailwind CSS, configured to work with your deployed backend.

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

## Production Configuration

### Deployed URLs
- **Frontend**: https://full-stack-todo-app-psi-sand.vercel.app
- **Backend**: https://salman907-backend-todo.hf.space

### Environment Variables for Production

Update your `.env.local` file with the production URLs:

```env
NEXT_PUBLIC_API_BASE_URL=https://salman907-backend-todo.hf.space
NEXT_PUBLIC_BETTER_AUTH_URL=https://salman907-backend-todo.hf.space
```

### Configuration Steps

1. Update your `.env.local` file:
```bash
NEXT_PUBLIC_API_BASE_URL=https://salman907-backend-todo.hf.space
NEXT_PUBLIC_BETTER_AUTH_URL=https://salman907-backend-todo.hf.space
```

2. The application is now configured to communicate with your deployed backend at `https://salman907-backend-todo.hf.space`

## Development Configuration

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

3. Create a `.env.local` file in the frontend directory:
```bash
cp .env.example .env.local
```

4. For local development, use the default configuration:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
```

For production deployment, update with your deployed URLs:
```env
NEXT_PUBLIC_API_BASE_URL=https://salman907-backend-todo.hf.space
NEXT_PUBLIC_BETTER_AUTH_URL=https://salman907-backend-todo.hf.space
```

### Running the Application

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

## API Integration

This frontend communicates with the backend API at your deployed URL with the following endpoints:

- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle task completion status

## Authentication Flow

1. Users sign up or sign in via the authentication pages
2. Better Auth manages user sessions with JWT tokens
3. All API requests automatically include the authentication token
4. Protected routes redirect unauthenticated users to the sign-in page
5. User isolation is enforced by the backend to ensure users only access their own data

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

## Deployment Instructions

To deploy this frontend to Vercel or similar platform:

1. Make sure your environment variables are set in the deployment platform:
   - `NEXT_PUBLIC_API_BASE_URL=https://salman907-backend-todo.hf.space`
   - `NEXT_PUBLIC_BETTER_AUTH_URL=https://salman907-backend-todo.hf.space`

2. Build the application:
   ```bash
   npm run build
   ```

3. The application will be ready for deployment and will connect to your backend at https://salman907-backend-todo.hf.space

## Troubleshooting

- If you get CORS errors, verify that your backend allows requests from your frontend origin
- If authentication fails, ensure the BETTER_AUTH_SECRET matches between frontend and backend
- If API calls fail, check that the NEXT_PUBLIC_API_BASE_URL is correctly set to your deployed backend

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT