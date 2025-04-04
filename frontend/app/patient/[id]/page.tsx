'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import VoiceRecorder from '@/components/ehr/VoiceRecorder';
import PatientHeader from '@/components/patient/PatientHeader';
import BackButton from '@/components/common/BackButton';
import { useParams } from 'next/navigation';

export default function PatientPage() {
  const router = useRouter();
  const params = useParams();
  const [transcribedText, setTranscribedText] = useState('');
  const [showModal, setShowModal] = useState(false);

  const patientId = params?.id as string;

  const handleTranscriptionComplete = (text: string) => {
    setTranscribedText(text);
  };

  const handleStartEHR = () => {
    // Here we will send just the raw text to the backend
    console.log('Sending raw text to backend:', transcribedText);
    
    // Example of what the backend API call might look like:
    // fetch('/api/process-ehr', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ text: transcribedText })
    // });
  };

  if (!patientId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Check and modify EHR</h1>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Container */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <PatientHeader patientId={patientId} />
              <VoiceRecorder 
                patientId={patientId} 
                onTranscriptionComplete={handleTranscriptionComplete}
              />
              <div className="mt-8">
                <BackButton href="/dashboard" label="Patient's dashboard" />
              </div>
            </div>

            {/* Right Container */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-full flex flex-col">
                <div className="flex-grow">
                  <div className="h-96 bg-gray-50 p-4 rounded border overflow-y-auto">
                    {transcribedText || 'Transcribed text will appear here...'}
                  </div>
                </div>
                <div className="mt-8">
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={!transcribedText}
                    className="w-full p-4 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save EHR
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  );
} 