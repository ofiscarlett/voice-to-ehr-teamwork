import Header from '@/components/layout/Header';
import PatientList from '@/components/patient/PatientList';

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="container mx-auto p-8">
        <PatientList />
      </main>
    </div>
  );
} 