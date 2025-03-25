'use client';

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4">
      <div className="logo">
        <img src="/images/logo.svg" alt="Tietoevry" />
      </div>
      
      <div className="flex items-center gap-4">
        <div className="user-info flex items-center gap-2">
          <img src="/images/avatar.png" className="w-8 h-8 rounded-full" />
          <span>Dr. Ilponen</span>
        </div>
        <button>Logout</button>
      </div>
      
      <div className="lifecare-logo">
        <img src="/images/lifecare.svg" alt="Lifecare" />
      </div>
    </header>
  );
} 