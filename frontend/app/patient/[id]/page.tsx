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
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');


  // old patient id has issue
  const patientId = params?.id as string;
  console.log('Patient ID:', patientId);
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
    
      if (response.ok && result?.status === 'success') {
        if (result.data?.data?.report) {
          setStructuredEhr(result.data.data);
          //setShowModal(true);
          setShowAnalysisModal(true);
        } else {
          console.warn('API returned warning: Analysis completed, but no report available', result);
          setError('EHR structure not found in the result.');
        }
      } else {
        console.warn('API returned error:', result);
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
  //save ehr to localstorage, but next.js part need more time
  // to do research, this function just give for save btn
  const handleSaveEHR = () => {
    try {
      // Save the structuredEHR to localStorage
      console.log('Saving EHR:', structuredEhr);
      // Check if patientId and report exist
    if (structuredEhr && patientId && structuredEhr.report) {
      localStorage.setItem(`ehr_${patientId}`, JSON.stringify(structuredEhr));
      setSaveMessage('EHR saved successfully!');
      //setShowModal(true);
      console.log('EHR saved to localStorage:', structuredEhr);
      //router.push('/dashboard');
    }else {
      setSaveMessage('Failed to save EHR. Please try again.');
    }}catch (error) {
      console.error('Error saving EHR:', error);
      setSaveMessage('Error saving EHR. Please try again.');
    }finally {
      setShowSaveModal(true);
    }};
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

 {/* Right Container */}
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
{/* Add warming and  */}
                        {structuredEhr.report.aiDiagnosis && (
                          <div>
                            <strong>AI Diagnosis Suggestions:</strong>{' '}
                            {structuredEhr.report.aiDiagnosis.possibleConditions.join(', ')}
                          </div>
                        )}

                        {structuredEhr.report.aiTreatment && (
                          <div>
                            <strong>AI Treatment Suggestions:</strong>{' '}
                            {structuredEhr.report.aiTreatment.suggestions.join(', ')}
                          </div>
                        )}

                        {structuredEhr.warnings?.length > 0 && (
                          <div className="text-yellow-700 bg-yellow-100 p-3 rounded mt-4">
                            <strong>Warnings:</strong>
                            <ul className="list-disc pl-5">
                              {structuredEhr.warnings.map((warn: string, i: number) => (
                                <li key={i}>{warn}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>{transcribedText || 'Transcribed text will appear here...'}</p>
                    )}
                  </div>
                </div>

                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

                <div className="mt-4">
                {structuredEhr ? (
                  <button
                    onClick={handleSaveEHR}
                    className="w-full p-4 bg-green-600 text-white rounded hover:bg-green-700"
                  >
                    Save EHR
                  </button> ) : (
                  <button
                    onClick={handleStartEHR}
                    disabled={!transcribedText || isProcessing}
                    className="w-full p-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Start EHR'}
                  </button>
                )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
{/*First Modal：analysis done */}
      {showAnalysisModal  && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
          <h3 className="text-lg font-bold mb-4">Analysis completed</h3>
          <p className="mb-4 text-sm text-gray-600">
            You can now review and optionally save this report.
          </p>
              <button
         onClick={() => setShowAnalysisModal(false)}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Ok
              </button>
            </div>
        </div>
      )}
{/* Second Modal: save success */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <p className="mb-4 text-sm text-gray-600">{saveMessage}</p>
            <button
              onClick={() => setShowSaveModal(false)}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Ok
            </button>
          </div>
    </div>
  )}
        </div>
        );
}

