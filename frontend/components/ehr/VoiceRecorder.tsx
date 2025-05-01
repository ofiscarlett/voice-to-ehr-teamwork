'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/components/auth/AuthContext';

interface VoiceRecorderProps {
  patientId: string;
  onTranscriptionComplete?: (text: string) => void;
}

export default function VoiceRecorder({ patientId, onTranscriptionComplete }: VoiceRecorderProps) {
  const { doctor } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

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
      console.log('Audio blob created:', {
        type: audioBlob.type,
        size: audioBlob.size
      });

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

      // Immediately update parent with transcription
      onTranscriptionComplete?.(transcript);

      // Save to localStorage if authenticated
      if (doctor) {
        localStorage.setItem(`transcription_${patientId}`, transcript);
      }
    } catch (error: any) {
      console.error('Transcription error:', error);
      setError(error.message || 'Error during transcription. Please try again.');
    } finally {
      setIsTranscribing(false);
      // Stop all tracks
      mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <button
            onClick={startRecording}
            disabled={isRecording || isTranscribing}
            className={`w-full p-4 rounded ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            Record
            <div className="text-sm text-gray-600">
              Click to start recording
            </div>
          </button>
        </div>

        <div>
          <button
            onClick={stopRecording}
            disabled={!isRecording || isTranscribing}
            className={`w-full p-4 rounded ${
              isTranscribing
                ? 'bg-blue-500 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {isTranscribing ? 'Transcribing...' : 'Stop'}
            <div className="text-sm text-gray-600">
              {isTranscribing ? 'Processing...' : 'Click to stop and transcribe'}
            </div>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
    </div>
  );
} 