'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, FormEvent } from 'react';
import { Allergen } from '@/lib/schema';

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [allergenName, setAllergenName] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [treatment, setTreatment] = useState('');
  const [firstAid, setFirstAid] = useState('');
  const [message, setMessage] = useState('');
  const [allergenList, setAllergenList] = useState<Allergen[]>([]);

  const fetchAllergens = async () => {
    try {
      const response = await fetch('/api/allergens');
      if (response.ok) {
        const data = await response.json();
        setAllergenList(data);
      }
    } catch (error) {
      console.error('Failed to fetch allergens:', error);
    }
  };

  useEffect(() => {
    fetchAllergens();
  }, []);

  const handleAddAllergen = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await fetch('/api/allergens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: allergenName,
          symptoms: symptoms.split(',').map(s => s.trim()),
          treatment,
          firstAid,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Allergen added successfully!');
        // Clear form
        setAllergenName('');
        setSymptoms('');
        setTreatment('');
        setFirstAid('');
        // Refresh the list
        fetchAllergens();
      } else {
        setMessage(data.message || 'Failed to add allergen');
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
              <h2 className="text-xl font-bold mb-4">Add New Allergen</h2>
              <form onSubmit={handleAddAllergen} className="space-y-4">
                <div>
                  <label htmlFor="allergenName" className="text-sm font-medium text-gray-700">Allergen Name</label>
                  <input
                    id="allergenName"
                    type="text"
                    value={allergenName}
                    onChange={(e) => setAllergenName(e.target.value)}
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
                {message && <p className="text-sm text-center text-green-500">{message}</p>}
                <button
                  type="submit"
                  className="w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  Add Allergen
                </button>
              </form>
            </div>
            <div>
                <h2 className="text-xl font-bold mb-4">Allergen List</h2>
                <div className="space-y-2">
                    {allergenList.map((allergen) => (
                        <div key={allergen.name} className="p-4 border rounded-md">
                            <h3 className="font-bold">{allergen.name}</h3>
                            <p><strong>Symptoms:</strong> {allergen.symptoms.join(', ')}</p>
                            <p><strong>Treatment:</strong> {allergen.treatment}</p>
                            <p><strong>First Aid:</strong> {allergen.firstAid}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}