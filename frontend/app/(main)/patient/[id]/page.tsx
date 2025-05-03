'use client';

import { useState, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import VoiceRecorder from '@/components/ehr/VoiceRecorder';
import PatientHeader from '@/components/patient/PatientHeader';
import BackButton from '@/components/common/BackButton';
import EHRActions from '@/components/ehr/EHRActions';

export default function PatientPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params?.id as string;
  const [transcribedText, setTranscribedText] = useState<string>('');
  const [structuredEhr, setStructuredEhr] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const handleTranscriptionComplete = useCallback((text: string) => {
    console.log('Received transcription:', text);
    setTranscribedText(text);
    setStructuredEhr(null);
  }, []);

  const startRecording = async () => {
    try {
      audioChunks.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setError('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const stopRecording = async () => {
    if (!mediaRecorder.current || mediaRecorder.current.state !== 'recording') return;

    setIsTranscribing(true);
    mediaRecorder.current.stop();
    setIsRecording(false);

    try {
      await new Promise<void>((resolve) => {
        if (!mediaRecorder.current) return resolve();
        mediaRecorder.current.onstop = () => resolve();
      });

      const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
      
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
      if (!apiKey) throw new Error('Deepgram API key not found');

      const response = await fetch('https://api.deepgram.com/v1/listen?model=general&language=en-US', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          'Content-Type': 'audio/webm'
        },
        body: audioBlob
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepgram API error: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;

      if (!transcript) throw new Error('No transcription received');

      handleTranscriptionComplete(transcript);
    } catch (error: any) {
      console.error('Transcription error:', error);
      setError(error.message || 'Error during transcription. Please try again.');
    } finally {
      setIsTranscribing(false);
      mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleFieldChange = (field: string, value: string) => {
    setStructuredEhr({
      ...structuredEhr,
      report: {
        ...structuredEhr.report,
        [field]: value
      }
    });
  };

  const handleStartEHR = async () => {
    if (!transcribedText) {
      setError('Please record some audio first.');
      return;
    }

    if (transcribedText.length < 30) {
      setError('The recorded text is too short. Please provide a more detailed description (at least 30 characters).');
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5001/api/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcribedText }),
      });

      if (!response.ok) {
        throw new Error('Failed to process EHR');
      }

      const result = await response.json();
      
      if (result.error || !result.data) {
        throw new Error(result.message || 'Failed to process EHR');
      }

      setStructuredEhr(result.data);
    } catch (error: any) {
      console.error('Error processing EHR:', error);
      setError(error.message || 'Failed to process EHR');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full flex flex-col px-[69px] py-8">
      <div className="w-full mx-auto flex flex-col flex-1 min-h-0">
        <div className="flex-1 min-h-0">
          <div className="bg-[#FAFAFA] rounded-lg p-[30px]">
            <div className="grid grid-cols-2 gap-[30px]">
              {/* Left Section */}
              <div className="flex flex-col min-h-0">
                <div className="space-y-2 mb-[100px]">
                  <PatientHeader patientId={patientId} />
                </div>
                <div className="flex-1 min-h-0 overflow-auto">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                      onClick={startRecording}
                      disabled={isRecording || isTranscribing}
                      className="w-full p-4 bg-[#E6E6E6] hover:bg-[#DDDDDD] disabled:opacity-50 rounded"
                    >
                      Record
                      <div className="text-sm text-gray-600">
                        This will record your voice
                      </div>
                    </button>
                    <button
                      onClick={stopRecording}
                      disabled={!isRecording || isTranscribing}
                      className="w-full p-4 bg-[#E6E6E6] hover:bg-[#DDDDDD] disabled:opacity-50 rounded"
                    >
                      Stop
                      <div className="text-sm text-gray-600">
                        This will transcript your voice
                      </div>
                    </button>
                  </div>
                  <button
                    onClick={handleStartEHR}
                    disabled={!transcribedText || isProcessing}
                    className="w-full bg-black text-white p-4 rounded hover:bg-gray-800 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : 'Start EHR'}
                    <div className="text-sm">This will turn your transcripted voice into an EHR</div>
                  </button>
                </div>
                <div className="pt-[30px]">
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="w-full p-4 bg-[#E6E6E6] hover:bg-[#DDDDDD] rounded text-center"
                  >
                    Patient's dashboard
                  </button>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex flex-col min-h-0">
                <div className="flex-1 min-h-0">
                  <div className="h-[600px] bg-white p-[30px] rounded border overflow-y-auto">
                    {structuredEhr ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center sticky top-0 bg-white pb-4 z-10">
                          <strong>Check and modify EHR</strong>
                          <span className="text-sm text-green-600">✓ EHR generated</span>
                        </div>
                        <div className="space-y-4 font-mono text-sm">
                          <div>
                            <div className="font-semibold mb-2">Symptoms</div>
                            <div className="p-2 bg-white rounded border">
                              <textarea
                                value={structuredEhr.report?.symptoms || ''}
                                onChange={(e) => handleFieldChange('symptoms', e.target.value)}
                                className="w-full p-2 border rounded min-h-[80px] focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                placeholder="Enter symptoms..."
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold mb-2">Diagnosis</div>
                            <div className="p-2 bg-white rounded border">
                              <textarea
                                value={structuredEhr.report?.diagnosis || ''}
                                onChange={(e) => handleFieldChange('diagnosis', e.target.value)}
                                className="w-full p-2 border rounded min-h-[80px] focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                placeholder="Enter diagnosis..."
                              />
                            </div>
                          </div>
                          <div>
                            <div className="font-semibold mb-2">Treatment</div>
                            <div className="p-2 bg-white rounded border">
                              <textarea
                                value={structuredEhr.report?.treatment || ''}
                                onChange={(e) => handleFieldChange('treatment', e.target.value)}
                                className="w-full p-2 border rounded min-h-[80px] focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                placeholder="Enter treatment..."
                              />
                            </div>
                          </div>
                          {structuredEhr.report?.OTHERS && (
                            <div>
                              <div className="font-semibold mb-2">Additional Notes</div>
                              <div className="p-2 bg-white rounded border">
                                <textarea
                                  value={structuredEhr.report?.OTHERS || ''}
                                  onChange={(e) => handleFieldChange('OTHERS', e.target.value)}
                                  className="w-full p-2 border rounded min-h-[80px] focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                                  placeholder="Enter additional notes..."
                                />
                              </div>
                            </div>
                          )}
                        </div>
                        {structuredEhr.warnings && structuredEhr.warnings.length > 0 && (
                          <div className="mt-6 p-2 bg-yellow-50 rounded border border-yellow-200">
                            <strong>AI Suggestions:</strong>
                            <ul className="mt-1 list-disc list-inside text-yellow-700">
                              {structuredEhr.warnings.map((warning: string, index: number) => (
                                <li key={index}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <strong>Check and modify EHR</strong>
                          {transcribedText && (
                            <span className="text-sm text-green-600">✓ Text received</span>
                          )}
                        </div>
                        <div 
                          className="min-h-[500px] bg-white p-4 border rounded shadow-sm font-mono text-gray-700 whitespace-pre-wrap"
                        >
                          {transcribedText || 'Transcribed text will appear here...'}
                        </div>
                      </div>
                    )}
                  </div>
                  {error && (
                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
                      {error}
                    </div>
                  )}
                </div>
                <div className="pt-[30px]">
                  <EHRActions structuredEhr={structuredEhr} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 