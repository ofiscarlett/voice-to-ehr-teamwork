'use client';

import { useRouter } from 'next/navigation';

interface BackButtonProps {
  href: string;
  label?: string;
}

export default function BackButton({ href, label = 'Back' }: BackButtonProps) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.push(href)}
      className="text-gray-600 hover:text-gray-800"
    >
      ← {label}
    </button>
  );
} 