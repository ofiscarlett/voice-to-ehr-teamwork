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
    <nav className="absolute top-11 left-10 right-10 flex justify-between items-center">
      <Image
        src="/icons/tietoevry-logo-digital.png"
        alt="Tietoevry Logo"
        width={120}
        height={34}
        priority
      />
      <div className="inline-flex flex-col items-center">
        <div className="inline-flex flex-row items-center pt-[20px]" id="middle-content">
          <div className="flex justify-center items-center aspect-square w-5 h-5 rounded-full border border-[#280071] bg-[#280071] mr-2">
            <img
              src="/icons/doctor-img.png"
              alt="Doctor"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <span className="text-base font-semibold text-[#280071] mr-[60px]">Dr. Ilponen</span>
          <button
            onClick={handleLogout}
            className="text-base font-medium text-[#737373] ml-4 cursor-pointer transition-all duration-200 ease-in-out hover:-translate-y-[1px] hover:text-[#404040]"
          >
            Log out
          </button>
        </div>
        <div className="border-b border-[#737373] w-[calc(100%+16px)] -mx-[8px] mt-3 rounded-full" style={{ borderWidth: '1.1px' }} />
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