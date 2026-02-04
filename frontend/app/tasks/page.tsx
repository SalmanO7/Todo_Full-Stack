import { Suspense } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import TasksPageContent from './TasksPageContent';

export default function TasksPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div className="flex items-center justify-center h-64"><p>Loading tasks...</p></div>}>
        <TasksPageContent />
      </Suspense>
    </ProtectedRoute>
  );
}