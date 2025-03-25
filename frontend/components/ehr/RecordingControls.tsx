'use client';

export default function RecordingControls() {
  return (
    <div className="space-y-8">
      <div className="flex gap-4">
        <button className="bg-gray-200 p-4 flex-1">
          Record
          <div className="text-sm">This will record your voice</div>
        </button>
        
        <button className="bg-gray-200 p-4 flex-1">
          Stop
          <div className="text-sm">This will transcript your voice</div>
        </button>
      </div>
      
      <button className="w-full bg-black text-white p-4">
        Start EHR
        <div className="text-sm">This will turn your transcripted voice into an EHR</div>
      </button>
    </div>
  );
} 