# Quickstart Guide: Complete Beautiful & Responsive Frontend Implementation

## Prerequisites

- Node.js 18.x or higher
- npm or yarn package manager
- Git
- Access to the backend API (FastAPI server running on port 8000)

## Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd frontend
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the frontend directory with the following variables:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:8000
BETTER_AUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run the Development Server
```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`.

## Key Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint to check for code issues
- `npm run type-check` - Run TypeScript type checking

## Project Structure

```
frontend/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header
│   ├── page.tsx           # Home page (redirects to /tasks or /signin)
│   ├── signin/page.tsx    # Login page
│   ├── signup/page.tsx    # Registration page
│   └── tasks/page.tsx     # Main tasks page
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (Button, Input, etc.)
│   ├── Header.tsx        # Navigation header with auth state
│   ├── TaskCard.tsx      # Individual task display component
│   ├── TaskList.tsx      # Task list container
│   ├── TaskModal.tsx     # Create/edit task modal
│   └── EmptyState.tsx    # Empty task list state
├── lib/                  # Utility functions and API client
│   ├── api.ts            # API client with authentication
│   ├── auth.ts           # Authentication utilities
│   └── queries.ts        # TanStack Query hooks for tasks
├── types/                # TypeScript type definitions
│   └── index.ts          # Shared type definitions
├── styles/               # Global styles
│   └── globals.css       # Tailwind imports and global styles
└── public/               # Static assets
    └── favicon.ico
```

## Key Technologies Used

- **Framework**: Next.js 14+ with App Router
- **Styling**: Tailwind CSS with custom configuration
- **Authentication**: Better Auth with JWT
- **State Management**: TanStack Query for server state, React for local state
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Theming**: Next Themes for dark/light mode

## API Integration

The frontend communicates with the backend API using the API client in `lib/api.ts`. All requests automatically include the JWT token from the Better Auth session.

### Available Endpoints
- `GET /api/{user_id}/tasks` - Get user's tasks
- `POST /api/{user_id}/tasks` - Create a new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update a task
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete a task
- `PATCH /api/{user_id}/tasks/{task_id}/toggle` - Toggle task completion

## Authentication Flow

1. User visits `/signin` or `/signup`
2. After successful authentication, user is redirected to `/tasks`
3. All API requests automatically include the JWT token
4. If a 401 error occurs, user is redirected to `/signin`

## Common Tasks

### Adding a New Component
1. Create the component file in `components/`
2. Use Tailwind classes for styling
3. Export as a named component for clarity
4. Add proper TypeScript typing

### Adding a New Page
1. Create a new directory in `app/` with `page.tsx`
2. Use server components by default
3. Add `'use client'` directive only if interactivity is needed
4. Implement proper error handling and loading states

### Working with Data
1. Use the hooks in `lib/queries.ts` for data fetching
2. Implement proper loading and error states
3. Use optimistic updates where appropriate for better UX
4. Handle authentication errors globally

## Troubleshooting

### Common Issues
- **API calls returning 401**: Check that the backend is running and the JWT token is valid
- **Styles not applying**: Verify Tailwind is properly configured and classes are spelled correctly
- **Auth not working**: Ensure environment variables are set correctly for Better Auth

### Development Tips
- Use the React Developer Tools browser extension
- Enable Strict Mode warnings to catch potential issues early
- Check the browser console for any errors or warnings
- Use the Network tab to monitor API requests