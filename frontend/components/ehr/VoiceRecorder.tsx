'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/components/auth/AuthContext';
import { text } from 'stream/consumers';

interface VoiceRecorderProps {
  patientId: string;
  onTranscriptionComplete?: (text: string) => void;
}

export default function VoiceRecorder({ patientId, onTranscriptionComplete }: VoiceRecorderProps) {
  const { doctor } = useAuth();
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [error, setError] = useState<string>('');
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  // Load saved transcription on component mount only if authenticated
  useEffect(() => {
    if (doctor) {
      const savedTranscription = localStorage.getItem(`transcription_${patientId}`);
      if (savedTranscription) {
        setTranscribedText(savedTranscription);
        onTranscriptionComplete?.(savedTranscription);
      }
    } else {
      // Clear transcription if not authenticated
      setTranscribedText('');
      onTranscriptionComplete?.('');
    }
  }, [patientId, onTranscriptionComplete, doctor]);

  const startRecording = async () => {    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      //old code
      mediaRecorder.current = new MediaRecorder(stream);
      //new code
      /*
      mediaRecorder.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm'
      });
      */
      //end of new code
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.start(1000);
      setIsRecording(true);
      setIsPaused(false);
      setError('');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setError('Error accessing microphone. Please make sure you have granted microphone permissions.');
    }
  };

  const pauseRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.pause();
      setIsPaused(true);
    }
  };

  const resumeRecording = () => {
    if (mediaRecorder.current?.state === 'paused') {
      mediaRecorder.current.resume();
      setIsPaused(false);
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY;
      console.log("🔑 env API key:", process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);
      if (!apiKey) {
        throw new Error('Deepgram API key not found');
      }
      console.log("Audio blob type:", audioBlob.type); // eg"audio/wav"
      console.log("Audio blob size:", audioBlob.size); // should not be 0
      
      const response = await fetch('https://api.deepgram.com/v1/listen?model=general&language=en-US', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${apiKey}`,
          //old code
          'Content-Type': 'audio/wav'
        },
        body: audioBlob
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Deepgram error response:', errorText);//debug code
        throw new Error(`Deepgram API error: ${response.statusText}. ${errorText}`);
      }

      const data = await response.json();
      console.log("Deepgram response:", data);
      //new code
      const transcript = data?.results?.channels?.[0]?.alternatives?.[0]?.transcript;
      if (!transcript || transcript.trim() === '') {
        throw new Error('No speech detected in audio.');
      }
  
      return transcript;
      //return data.results?.channels[0]?.alternatives[0]?.transcript || '';
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    }
  };

  const stopRecording = async () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setIsTranscribing(true);
      setError('');

      try {
        await new Promise(resolve => {
          if (mediaRecorder.current) {
            mediaRecorder.current.addEventListener('stop', resolve, { once: true });
          }
        });

        //old code
        const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });

        console.log("Audio blob type:", audioBlob.type); // eg"audio/wav"
        console.log("Audio blob size:", audioBlob.size); // should not be 0
        const transcript = await transcribeAudio(audioBlob);
        
        // Only save transcription if authenticated
        if (doctor) {
          localStorage.setItem(`transcription_${patientId}`, transcript);
        }
        setTranscribedText(transcript);
        onTranscriptionComplete?.(transcript);
      } catch (error) {
        console.error('Error during transcription:', error);
        setError('Error during transcription. Please try again.');
      } finally {
        setIsTranscribing(false);
        mediaRecorder.current?.stream.getTracks().forEach(track => track.stop());
      }
    }
  };

  const handleStartEHR = () => {
    if (!transcribedText) return;
    // Here we will send just the raw text to the backend
    console.log('Sending raw text to backend:', transcribedText);
    onTranscriptionComplete?.(transcribedText);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <button
            onClick={isRecording ? (isPaused ? resumeRecording : pauseRecording) : startRecording}
            className={`w-full p-4 rounded ${
              isRecording
                ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
          >
            {isRecording ? (isPaused ? 'Resume Recording' : 'Pause Recording') : 'Record'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">This will record your voice</p>
        </div>

        <div>
          <button
            onClick={stopRecording}
            disabled={!isRecording}
            className={`w-full p-4 rounded ${
              isTranscribing
                ? 'bg-blue-500 animate-pulse'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50`}
          >
            {isTranscribing ? 'Transcribing...' : 'Stop'}
          </button>
          <p className="text-sm text-gray-500 text-center mt-2">This will transcript your voice</p>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="w-full">
        <button
          onClick={handleStartEHR}
          disabled={!transcribedText}
          className="w-full p-4 bg-black text-white rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Start EHR
        </button>
        <p className="text-sm text-gray-500 text-center mt-2">This will turn your transcripted voice into an EHR</p>
      </div>
    </div>
  );
} 