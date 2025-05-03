'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

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
    <div className="overflow-hidden flex flex-col">
      <div className="grid grid-cols-2 bg-black text-white px-[30px] py-7">
        <div className="text-base">Patient name</div>
        <div className="text-base">Identity Number</div>
      </div>

      <div className="mt-4 space-y-2">
        {patients.map((patient) => (
          <div 
            key={patient.id} 
            className="grid grid-cols-2 px-[30px] py-6 items-center bg-[#FAFAFA] hover:bg-[#EEEEEE]"
          >
            <div className="text-base">{patient.name}</div>
            <div className="flex justify-between items-center">
              <span className="text-base">{patient.id}</span>
              <button
                onClick={() => router.push(`/patient/${patient.id}`)}
                className="bg-[#D4D4D4] text-black px-5 py-3 text-[14px] font-semibold flex items-center gap-2 hover:bg-black hover:text-white group transition-colors duration-200 cursor-pointer"
              >
                <span className="transition-transform duration-300 ease-in-out group-hover:rotate-[80deg] group-hover:filter group-hover:brightness-0 group-hover:invert">
                  <Image 
                    src="/icons/search-icon.svg" 
                    alt="Search" 
                    width={16} 
                    height={16} 
                  />
                </span>
                View on EHR station
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 