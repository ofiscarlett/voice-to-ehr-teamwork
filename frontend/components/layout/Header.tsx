'use client';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-white">
      <div className="logo">
        <Image
          src="/icons/tietoevry-logo-digital.png"
          alt="Tietoevry"
          width={120}
          height={40}
          priority
        />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="user-info flex items-center gap-2">
          <img src="/images/avatar.png" className="w-8 h-8 rounded-full" />
          <span>Dr. Ilponen</span>
        </div>
        <button>Logout</button>
      </div>
      
      <div className="lifecare-logo">
        <Image
          src="/icons/lifecare-digital-logo.png"
          alt="Lifecare"
          width={120}
          height={40}
          priority
        />
      </div>
    </header>
  );
} 