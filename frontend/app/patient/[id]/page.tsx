import Header from '@/components/layout/Header';
import RecordingControls from '@/components/ehr/RecordingControls';

export default function PatientEHRPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h2>Patient Name: Aino Saaristo</h2>
            <p>Patient ID: {params.id}</p>
          </div>
          
          <div className="space-y-8">
            <h1 className="text-2xl">Check and modify EHR</h1>
            <RecordingControls />
            
            <button className="w-full bg-black text-white p-4">
              Save EHR
            </button>
            
            <button className="w-full bg-gray-200 p-4">
              Patient's dashboard
            </button>
          </div>
        </div>
      </main>
    </div>
  );
} 