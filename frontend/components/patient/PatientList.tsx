'use client';

export default function PatientList() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-gray-100 p-4">
        <div className="font-bold">Patient name</div>
        <div className="font-bold">Identity Number</div>
        <div></div>
      </div>
      
      <div className="space-y-2">
        {/* Patient rows will be mapped here */}
        <div className="flex justify-between items-center p-4 hover:bg-gray-50">
          <div>Aino Saaristo</div>
          <div>120379-345A</div>
          <button className="bg-gray-200">View in EHR station</button>
        </div>
      </div>
    </div>
  );
} 