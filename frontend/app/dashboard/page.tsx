'use client';

import { useRouter } from 'next/navigation';
import PatientList from '@/components/patient/PatientList';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <PatientList />

          <p className="text-gray-500 text-sm mt-8 text-center">
            This dashboard displays fictional, hardcoded data and is not linked to any real database or patients.
          </p>
        </div>
      </main>
    </div>
  );
} 