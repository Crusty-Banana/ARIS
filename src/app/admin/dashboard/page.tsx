'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, FormEvent } from 'react';
import { Allergy } from '@/lib/schema';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [allergyName, setAllergyName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [firstAid, setFirstAid] = useState('');
  const [allergens, setAllergens] = useState('');
  const [message, setMessage] = useState('');
  const [allergyList, setAllergyList] = useState<Allergy[]>([]);

  const fetchAllergies = async () => {
    try {
      const response = await fetch('/api/allergies');
      if (response.ok) {
        const data = await response.json();
        setAllergyList(data);
      }
    } catch (error) {
      console.error('Failed to fetch allergies:', error);
    }
  };

  useEffect(() => {
    fetchAllergies();
  }, []);

  const handleAddAllergy = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/allergies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: allergyName,
          symptoms: symptoms.split(',').map(s => s.trim()),
          treatment,
          firstAid,
          allergens: allergens.split(',').map(s => s.trim()),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Allergy added successfully!');
        // Clear form
        setAllergyName('');
        setSymptoms('');
        setTreatment('');
        setFirstAid('');
        setAllergens('');
        // Refresh the list
        fetchAllergies();
      } else {
        setMessage(data.message || 'Failed to add allergy');
      }
    } catch (error) {
        if (error instanceof Error) {
            setMessage(`An error occurred: ${error.message}`);
        } else {
            setMessage('An unexpected error occurred. Please try again.');
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p>Welcome, {session?.user?.firstName} {session?.user?.lastName}!</p>
                <p>You have the role of: <strong>{session?.user?.role}</strong></p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: '/auth/login' })}
              className="px-4 py-2 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
            >
              Logout
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-bold mb-4">Add New Allergy</h2>
              <form onSubmit={handleAddAllergy} className="space-y-4">
                <div>
                  <label htmlFor="allergyName" className="text-sm font-medium text-gray-700">Allergy Name</label>
                  <input
                    id="allergyName"
                    type="text"
                    value={allergyName}
                    onChange={(e) => setAllergyName(e.target.value)}
                    required
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="symptoms" className="text-sm font-medium text-gray-700">Symptoms (comma-separated)</label>
                  <input
                    id="symptoms"
                    type="text"
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="treatment" className="text-sm font-medium text-gray-700">Treatment</label>
                  <input
                    id="treatment"
                    type="text"
                    value={treatment}
                    onChange={(e) => setTreatment(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="firstAid" className="text-sm font-medium text-gray-700">First Aid</label>
                  <input
                    id="firstAid"
                    type="text"
                    value={firstAid}
                    onChange={(e) => setFirstAid(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                  />
                </div>
                <div>
                  <label htmlFor="allergens" className="text-sm font-medium text-gray-700">Allergens (comma-separated)</label>
                  <input
                    id="allergens"
                    type="text"
                    value={allergens}
                    onChange={(e) => setAllergens(e.target.value)}
                    className="w-full px-3 py-2 mt-1 border rounded-md"
                  />
                </div>
                {message && <p className="text-sm text-center text-green-500">{message}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Allergy
                </button>
              </form>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Allergy List</h2>
                <div className="space-y-2">
                    {allergyList.map((allergy) => (
                        <div key={allergy.name} className="p-4 border rounded-md">
                            <h3 className="font-bold">{allergy.name}</h3>
                            <p><strong>Symptoms:</strong> {allergy.symptoms.join(', ')}</p>
                            <p><strong>Treatment:</strong> {allergy.treatment}</p>
                            <p><strong>First Aid:</strong> {allergy.firstAid}</p>
                            <p><strong>Allergens:</strong> {allergy.allergens.join(', ')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}