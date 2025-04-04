'use client';

import { useRouter } from 'next/navigation';

interface DoctorHeaderProps {
  name: string;
}

export default function DoctorHeader({ name }: DoctorHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-4">
        <div className="w-8 h-8 bg-gray-300 rounded-full" />
        <span>{name}</span>
      </div>
      <button
        onClick={() => router.push('/')}
        className="text-gray-600 hover:text-gray-800"
      >
        Logout
      </button>
    </div>
  );
} 