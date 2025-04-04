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

interface PatientHeaderProps {
  patientId: string;
}

export default function PatientHeader({ patientId }: PatientHeaderProps) {
  const patient = patients.find(p => p.id === patientId);

  if (!patient) {
    return (
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Patient not found</h2>
        <p className="text-gray-600">ID: {patientId}</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <div className="space-y-2">
        <div>
          <span className="text-gray-500">Patient Name: </span>
          <span>{patient.name}</span>
        </div>
        <div>
          <span className="text-gray-500">Patient ID: </span>
          <span>{patient.id}</span>
        </div>
      </div>
    </div>
  );
} 