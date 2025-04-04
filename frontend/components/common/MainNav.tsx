'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import Link from 'next/link';

export default function MainNav() {
  const router = useRouter();
  const { doctor, logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="w-full bg-white border-b">
      <div className="max-w-[1920px] mx-auto px-8 py-4 flex justify-between items-center">
        <div className="w-40">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold">Voice to EHR</span>
          </Link>
        </div>

        {doctor && (
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-purple-900 rounded-full" />
              <span>{doctor.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 relative group cursor-pointer"
            >
              Logout
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-800 transform scale-x-0 transition-transform group-hover:scale-x-100" />
            </button>
          </div>
        )}

        <div className="w-40 flex justify-end">
          <span className="text-xl font-semibold">Lifecare</span>
        </div>
      </div>
    </nav>
  );
} 