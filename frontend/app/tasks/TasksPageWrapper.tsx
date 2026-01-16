'use client';

import { Suspense } from 'react';
import TasksPageContent from './TasksPageContent';

export default function TasksPageWrapper() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <TasksPageContent />
    </Suspense>
  );
}