'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'vtehr') {
      router.push('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-white">
      <div className="relative h-full w-full max-w-[1440px] mx-auto">
        <nav className="absolute top-16 left-10 right-10 flex justify-between items-start">
          <Image
            src="/icons/tietoevry-logo-digital.png"
            alt="Tietoevry Logo"
            width={150}
            height={40}
            priority
          />
          <Image
            src="/icons/lifecare-digital-logo.png"
            alt="Lifecare Logo"
            width={150}
            height={40}
            priority
          />
        </nav>

        <div className="absolute left-1/2 top-[260px] -translate-x-1/2 flex flex-col items-center w-[512px]">
          <div className="text-center mb-[100px]">
            <h1 className="text-4xl font-bold mb-2">Voice to EHR</h1>
            <p className="text-gray-600">MVP version 1.0.0</p>
          </div>
          
          <form onSubmit={handleLogin} className="w-full space-y-8">
            <div className="space-y-6">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full p-3 border-b border-gray-300 focus:border-gray-900 outline-none"
                placeholder="Doctor's entry-code"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border-b border-gray-300 focus:border-gray-900 outline-none"
                placeholder="Doctor's password"
              />
            </div>
            {error && (
              <div className="text-red-500 text-center">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white p-4 hover:bg-gray-800 flex items-center justify-center space-x-2"
            >
              <span>Login</span>
              <span className="text-xl">⌘</span>
            </button>
          </form>
        </div>

        <div className="absolute left-0 right-0 bottom-[40px] px-[69px] text-[#737373] font-['Open_Sans'] text-xs font-normal text-center">
          This MVP was developed by OAMK students for educational use only. Any use, distribution, or reproduction without explicit permission from OAMK and Tietoevry is prohibited.
        </div>
      </div>
    </div>
  );
} 