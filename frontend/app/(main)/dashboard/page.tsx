'use client';

import { useRouter } from 'next/navigation';
import PatientList from '@/components/patient/PatientList';

export default function DashboardPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 max-w-[1280px] w-full mx-auto px-10 pt-[144px]">
        <PatientList />
      </div>
      <div className="w-full border-t border-[#E6E6E6] mt-auto">
        <div className="max-w-[1280px] w-full mx-auto px-10 py-8">
          <p className="text-[#737373] font-['Open_Sans'] text-[13px] text-center">
            This dashboard displays fictional, hardcoded data and is not linked to any real database or patients.
          </p>
        </div>
      </div>
    </div>
  );
} 