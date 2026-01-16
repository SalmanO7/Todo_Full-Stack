import { ReactNode } from 'react';

export default function TasksLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="container py-6 px-4 max-w-6xl mx-auto">
      {children}
    </div>
  );
}