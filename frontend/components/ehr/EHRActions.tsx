'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface EHRActionsProps {
  onSave?: () => void;
  disabled?: boolean;
  structuredEhr?: any;
}

export default function EHRActions({ onSave, disabled = false, structuredEhr }: EHRActionsProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!structuredEhr) return;
    
    setIsSaving(true);
    try {
      const response = await fetch('/api/save-ehr-api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ structuredEhr }),
      });

      if (!response.ok) {
        throw new Error('Failed to save EHR');
      }

      if (onSave) {
        onSave();
      }
      setShowModal(true);
    } catch (error) {
      console.error('Error saving EHR:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mt-8 flex justify-end">
        <button
          onClick={handleSave}
          disabled={disabled || !structuredEhr || isSaving}
          className="w-full p-4 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? 'Saving...' : 'Save EHR'}
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