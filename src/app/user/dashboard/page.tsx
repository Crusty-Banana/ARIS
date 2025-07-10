'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Allergen, PAP } from '@/lib/schema';
import Link from 'next/link';
import { ObjectId } from 'mongodb';

export default function UserDashboard() {
  const { data: session } = useSession();
  const [pap, setPap] = useState<PAP | null>(null);
  const [allergens, setAllergens] = useState<Allergen[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<Allergen[]>([]);

  const fetchPap = useCallback(async () => {
    if (session) {
      try {
        const response = await fetch('/api/pap');
        if (response.ok) {
          const data = await response.json();
          setPap(data);
        } else {
          console.error('Failed to fetch PAP');
        }
      } catch (error) {
        console.error('An error occurred while fetching PAP:', error);
      }
    }
  }, [session]);

  const fetchAllergens = async () => {
    try {
      const response = await fetch('/api/allergens');
      if (response.ok) {
        const data = await response.json();
        setAllergens(data);
      } else {
        console.error('Failed to fetch allergens');
      }
    } catch (error) {
      console.error('An error occurred while fetching allergens:', error);
    }
  };

  useEffect(() => {
    fetchPap();
    fetchAllergens();
  }, [fetchPap]);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);
    if (value) {
      const filteredSuggestions = allergens.filter((allergen) =>
        allergen.name.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleAddToPap = async (allergenId: ObjectId) => {
    if (pap && session) {
      const updatedAllergens = [
        ...pap.allergens,
        { allergenId: allergenId, degree: 1 },
      ];
      try {
        const response = await fetch('/api/pap', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...pap, allergens: updatedAllergens }),
        });
        if (response.ok) {
          fetchPap();
        } else {
          console.error('Failed to update PAP');
        }
      } catch (error) {
        console.error('An error occurred while updating PAP:', error);
      }
    }
  };

  const handleSeverityChange = async (allergenId: ObjectId, degree: number) => {
    if (pap && session) {
      const updatedAllergens = pap.allergens.map((allergen) =>
        allergen.allergenId === allergenId ? { ...allergen, degree } : allergen
      );
      try {
        const response = await fetch('/api/pap', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...pap, allergens: updatedAllergens }),
        });
        if (response.ok) {
          fetchPap();
        } else {
          console.error('Failed to update PAP');
        }
      } catch (error) {
        console.error('An error occurred while updating PAP:', error);
      }
    }
  };

  const handleTogglePublic = async () => {
    if (pap && session) {
      try {
        console.log("aaaa", {...pap})
        console.log("bbbb", pap)
        console.log("cccc", { ...pap, allowPublic: !pap.allowPublic })
        const response = await fetch('/api/pap', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...pap, allowPublic: !pap.allowPublic }),
        });
        if (response.ok) {
          fetchPap();
        } else {
          console.error('Failed to update PAP');
        }
      } catch (error) {
        console.error('An error occurred while updating PAP:', error);
      }
    }
  };

  const handleGenderChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (pap && session) {
        try {
            const response = await fetch('/api/pap', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...pap, gender: e.target.value }),
            });
            if (response.ok) {
                fetchPap();
            } else {
                console.error('Failed to update PAP');
            }
        } catch (error) {
            console.error('An error occurred while updating PAP:', error);
        }
    }
  };

  const handleDobChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (pap && session) {
        try {
            const response = await fetch('/api/pap', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...pap, doB: new Date(e.target.value) }),
            });
            if (response.ok) {
                fetchPap();
            } else {
                console.error('Failed to update PAP');
            }
        } catch (error) {
            console.error('An error occurred while updating PAP:', error);
        }
    }
  };


  const isAllergenInPap = (allergenId: ObjectId) => {
    return pap?.allergens.some((a) => a.allergenId === allergenId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">User Dashboard</h1>
            <p>
              Welcome, {session?.user?.firstName} {session?.user?.lastName}!
            </p>
            <p>
              You have the role of: <strong>{session?.user?.role}</strong>
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/auth/login' })}
            className="w-full max-w-xs px-4 py-2 mt-4 font-bold text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Search for allergens..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded-md"
          />
          {suggestions.length > 0 && (
            <ul className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg">
              {suggestions.map((allergen) => (
                <li
                  key={String(allergen._id)}
                  className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between items-center"
                >
                  <Link href={`/allergens/${allergen._id}`} className="flex-grow">
                    {allergen.name}
                  </Link>
                  <button
                    onClick={() => handleAddToPap(allergen._id!)}
                    disabled={isAllergenInPap(allergen._id!)}
                    className="ml-4 px-2 py-1 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 disabled:bg-gray-400"
                  >
                    +
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {pap && (
          <div className="mt-6">
            <h2 className="text-xl font-bold">Personal Allergy Profile</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <strong>Date of Birth:</strong>{' '}
                <input type="date" value={pap.doB ? new Date(pap.doB).toISOString().split('T')[0] : ''} onChange={handleDobChange} />
                 {!pap.doB && <span>To be set</span>}
              </div>
              <div>
                <strong>Gender:</strong>{' '}
                <select value={pap.gender || ''} onChange={handleGenderChange}>
                    <option value="">None</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                </select>
              </div>
              <div className="flex items-center">
                <strong>Allow Public:</strong>
                <label className="switch ml-2">
                  <input
                    type="checkbox"
                    checked={pap.allowPublic}
                    onChange={handleTogglePublic}
                  />
                  <span className="slider round"></span>
                </label>
              </div>
            </div>

            <h3 className="text-lg font-bold mt-6">My Allergens</h3>
            <div className="space-y-4 mt-4">
              {pap.allergens.map((userAllergen) => {
                const allergenDetails = allergens.find(
                  (a) => a._id === userAllergen.allergenId
                );
                if (!allergenDetails) return null;

                return (
                  <div
                    key={String(userAllergen.allergenId)}
                    className="p-4 border rounded-md"
                  >
                    <h4 className="font-bold">{allergenDetails.name}</h4>
                    <p>
                      <strong>Symptoms:</strong>{' '}
                      {allergenDetails.symptoms.join(', ')}
                    </p>
                    <p>
                      <strong>Treatment:</strong> {allergenDetails.treatment}
                    </p>
                    <p>
                      <strong>First Aid:</strong> {allergenDetails.firstAid}
                    </p>
                    <div className="mt-2">
                      <label>Severity:</label>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={userAllergen.degree}
                        onChange={(e) =>
                          handleSeverityChange(
                            userAllergen.allergenId,
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full"
                      />
                      <span>{userAllergen.degree}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}