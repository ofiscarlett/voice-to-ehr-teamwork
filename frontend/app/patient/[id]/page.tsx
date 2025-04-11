'use client';

import { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import VoiceRecorder from '@/components/ehr/VoiceRecorder';
import PatientHeader from '@/components/patient/PatientHeader';
import BackButton from '@/components/common/BackButton';

export default function PatientPage() {
  const router = useRouter();
  const params = useParams();

  const [transcribedText, setTranscribedText] = useState('');
  const [structuredEhr, setStructuredEhr] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');


  // old patient id has issue
  const patientId = params?.id as string;
  // Safely extract patientId
  //const patientId = typeof params.id === 'string' ? params.id : undefined;

  const handleTranscriptionComplete = (text: string) => {
    setTranscribedText(text);
    console.log('Transcription complete:', text);
  };

  const handleStartEHR = async () => {
    if (!transcribedText) {
      setError('Please record some audio first.');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      console.log('Sending raw text to backend:', transcribedText);

      const response = await fetch('/api/structured-ehr-api', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcribedText }),
      });

      const result = await response.json();
      console.log('Debug response from backend:', result);
      //old code
      //if (response.ok && result.status === 'success') {
      //new
      if (response.ok && result?.status === 'success' && result.data?.report) {
        setStructuredEhr(result.data);
        setShowModal(true);
      } else {
        console.warn('API returned warning:', result);
        throw new Error(result.message || 'Failed to process EHR');
      }

    } catch (err: any) {
      console.error('Error processing EHR:', err);
      setError(err.message || 'An error occurred while processing EHR');
    } finally {
      setIsProcessing(false);
    }

    // Example: fallback direct request (if you ever switch API)
    // fetch('/api/process-ehr', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({ text: transcribedText }),
    // });
  };

  if (!patientId) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold">Review and Edit EHR</h1>
          </div>

          <div className="grid grid-cols-2 gap-8">
            {/* Left Panel */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <PatientHeader patientId={patientId} />
              <VoiceRecorder
                patientId={patientId}
                onTranscriptionComplete={handleTranscriptionComplete}
              />
              <div className="mt-8">
                <BackButton href="/dashboard" label="Back to Dashboard" />
              </div>
            </div>

 {/* Right Panel */}
 <div className="bg-white rounded-lg shadow-md p-6">
              <div className="h-full flex flex-col">
                <div className="flex-grow">
                  <div className="h-96 bg-gray-50 p-4 rounded border overflow-y-auto">
                    {structuredEhr ? (
                      <div className="space-y-2 text-sm">
                        <div><strong>Symptoms:</strong> {structuredEhr.report?.symptoms}</div>
                        <div><strong>Diagnosis:</strong> {structuredEhr.report?.diagnosis}</div>
                        <div><strong>Treatment:</strong> {structuredEhr.report?.treatment}</div>
                        <div><strong>OTHERS:</strong> {structuredEhr.report?.OTHERS}</div>
                      </div>
                    ) : (
                      <p>{transcribedText || 'Transcribed text will appear here...'}</p>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-4">
                  <button
                    onClick={handleStartEHR}
                    disabled={!transcribedText || isProcessing}
                    className="w-full p-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Start EHR'}
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
            <h3 className="text-xl font-bold mb-4">✓ EHR processed successfully</h3>
            <ul className="space-y-2 mb-6">
              <li>• You can continue editing the structured result.</li>
              <li>• Or return to the dashboard to start another EHR.</li>
            </ul>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full bg-black text-white p-3 rounded hover:bg-gray-800"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
