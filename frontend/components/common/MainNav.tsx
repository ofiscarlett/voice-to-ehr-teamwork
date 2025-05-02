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
        width={120}
        height={34}
        priority
      />
      
      <div className="flex items-center">
        <div className="flex items-center border-b border-[#1A1A1A] pb-2">
          <div className="w-5 h-5 rounded-full bg-[#1A1A1A] flex items-center justify-center mr-1.5">
            <img
              src="/icons/doctor-icon.svg"
              alt="Doctor"
              className="w-3 h-3"
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
        width={100}
        height={28}
        priority
      />
    </nav>
  );
} 