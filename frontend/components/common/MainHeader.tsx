'use client';

import { useRouter } from 'next/navigation';

interface MainHeaderProps {
  doctorName: string;
}

export default function MainHeader({ doctorName }: MainHeaderProps) {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center py-4 px-8 border-b">
      <div className="text-2xl font-bold text-purple-900">
        tietoeuvy
      </div>
      
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-purple-900 rounded-full" />
          <span>{doctorName}</span>
        </div>
        <button
          onClick={() => router.push('/')}
          className="text-gray-600 hover:text-gray-800"
        >
          Logout
        </button>
      </div>

      <div className="text-xl font-semibold">
        Lifecare
      </div>
    </div>
  );
} 