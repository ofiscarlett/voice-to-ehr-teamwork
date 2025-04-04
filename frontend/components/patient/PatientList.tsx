'use client';

import { useRouter } from 'next/navigation';

interface Patient {
  id: string;
  name: string;
}

const patients: Patient[] = [
  { id: '120379-345A', name: 'Aino Saaristo' },
  { id: '230481-678B', name: 'Mikael Virtala' },
  { id: '041290-912C', name: 'Helmi Koivisto' },
  { id: '310365-127D', name: 'Eero Niemelä' },
];

export default function PatientList() {
  const router = useRouter();

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-2 gap-4 bg-black text-white p-4">
        <div>Patient name</div>
        <div>Identity Number</div>
      </div>

      <div className="divide-y">
        {patients.map((patient) => (
          <div key={patient.id} className="grid grid-cols-2 gap-4 p-4 items-center">
            <div>{patient.name}</div>
            <div className="flex justify-between items-center">
              <span>{patient.id}</span>
              <button
                onClick={() => router.push(`/patient/${patient.id}`)}
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
              >
                View in EHR station
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 