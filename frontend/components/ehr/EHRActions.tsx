'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EHRActionsProps {
  onSave?: () => void;
  disabled?: boolean;
}

export default function EHRActions({ onSave, disabled = false }: EHRActionsProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setShowModal(true);
  };

  return (
    <>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={disabled}
          className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Save EHR
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-bold mb-4">✓ EHR saved successfully</h3>
            <ul className="space-y-2 mb-6">
              <li>• Close this modal window to continue modifying from where you left.</li>
              <li>• Go back to Patient's dashboard for starting new EHR.</li>
            </ul>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
            >
              Patient's dashboard
            </button>
          </div>
        </div>
      )}
    </>
  );
} 