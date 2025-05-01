'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/AuthContext';
import Image from 'next/image';

export default function MainNav() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="absolute top-16 left-10 right-10 flex justify-between items-center">
      <Image
        src="/icons/tietoevry-logo-digital.png"
        alt="Tietoevry Logo"
        width={150}
        height={40}
        priority
      />
      
      <div className="flex items-center">
        <div className="flex items-center border-b border-[#1A1A1A] pb-2">
          <div className="w-10 h-10 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-3">
            <img
              src="/icons/doctor-icon.svg"
              alt="Doctor"
              className="w-6 h-6"
            />
          </div>
          <span className="text-xl font-normal mr-6">Dr. Ilponen</span>
          <button
            onClick={handleLogout}
            className="text-xl font-normal text-black hover:text-gray-600"
          >
            Logout
          </button>
        </div>
      </div>

      <Image
        src="/icons/lifecare-digital-logo.png"
        alt="Lifecare Logo"
        width={150}
        height={40}
        priority
      />
    </nav>
  );
} 