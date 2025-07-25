'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, FormEvent } from 'react';
import { Allergy } from '@/modules/business-types';
import { ObjectId } from 'mongodb';
import { httpGet$GetAllergies } from '@/modules/commands/GetAllergies/fetcher';

type AllergyWithId = Allergy & { _id?: ObjectId };

export default function AdminAllergiesPage() {
  const { data: session } = useSession();

  // State for the form
  const [name, setName] = useState('');
  const [allergensId, setAllergensId] = useState('');
  
  // State for editing
  const [editingAllergy, setEditingAllergy] = useState<AllergyWithId | null>(null);

  // State for messages and lists
  const [message, setMessage] = useState('');
  const [allergyList, setAllergyList] = useState<AllergyWithId[]>([]);

  /**
   * Fetches all allergies from the API and updates the state.
   */
  const fetchAllergies = async () => {
    try {
      const {allergies} = await httpGet$GetAllergies('/api/allergies', {});
      if (allergies) {
        setAllergyList(allergies);
      } else {
        console.error('Failed to fetch allergies');
        setMessage('Failed to load allergies.');
      }
    } catch (error) {
      console.error('An error occurred while fetching allergies:', error);
      setMessage('An error occurred while fetching allergies.');
    }
  };

  // Fetch allergies on initial component mount
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchAllergies();
    }
  }, [session]);

  /**
   * Resets the form fields and editing state.
   */
  const resetForm = () => {
    setName('');
    setAllergensId('');
    setEditingAllergy(null);
  };

  /**
   * Handles the form submission for both creating and updating allergies.
   * @param {FormEvent} e - The form event.
   */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage('');

    const url = editingAllergy ? `/api/allergies/${editingAllergy._id}` : '/api/allergies';
    const method = editingAllergy ? 'PUT' : 'POST';

    const body = {
      name,
      allergensId: allergensId.split(',').map(s => s.trim()).filter(Boolean),
    };

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Allergy ${editingAllergy ? 'updated' : 'added'} successfully!`);
        resetForm();
        fetchAllergies(); // Refresh the list
      } else {
        setMessage(data.message || `Failed to ${editingAllergy ? 'update' : 'add'} allergy`);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessage(`An error occurred: ${errorMessage}`);
      console.error('Form submission error:', error);
    }
  };

  /**
   * Sets the form fields to the values of the allergy to be edited.
   * @param {AllergyWithId} allergy - The allergy object to edit.
   */
  const handleEdit = (allergy: AllergyWithId) => {
    setEditingAllergy(allergy);
    setName(allergy.name);
    setAllergensId(Array.isArray(allergy.allergensId) ? allergy.allergensId.join(', ') : '');
    window.scrollTo(0, 0); // Scroll to top to see the form
  };

  /**
   * Handles the deletion of an allergy.
   * @param {ObjectId | undefined} id - The ID of the allergy to delete.
   */
  const handleDelete = async (id?: ObjectId) => {
    if (!id) return;
    
    if (!confirm('Are you sure you want to delete this allergy?')) {
        return;
    }

    try {
      const response = await fetch(`/api/allergies/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Allergy deleted successfully!');
        fetchAllergies(); // Refresh the list
      } else {
        setMessage(data.message || 'Failed to delete allergy');
      }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
        setMessage(`An error occurred: ${errorMessage}`);
        console.error('Delete error:', error);
    }
  };

  // Render nothing if not an admin
  if (session?.user?.role !== 'admin') {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Access Denied. You must be an admin to view this page.</p>
        </div>
    );
  }

  return (
    <div className="container mx-auto p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Manage Allergies</h1>

      {/* Form for Adding/Editing Allergies */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-700">{editingAllergy ? 'Edit Allergy' : 'Add New Allergy'}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Allergy Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="allergensId" className="block text-sm font-medium text-gray-600">Related Allergen IDs (comma-separated)</label>
            <input
              id="allergensId"
              type="text"
              value={allergensId}
              onChange={(e) => setAllergensId(e.target.value)}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {message && <p className="text-sm text-center text-green-600 bg-green-100 p-3 rounded-md">{message}</p>}

          <div className="flex items-center space-x-4">
            <button
              type="submit"
              className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              {editingAllergy ? 'Update Allergy' : 'Add Allergy'}
            </button>
            {editingAllergy && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* List of Allergies */}
      <div>
        <h2 className="text-2xl font-bold mb-4 text-gray-700">Existing Allergies</h2>
        <div className="space-y-4">
          {allergyList.length > 0 ? (
            allergyList.map((allergy) => (
              <div key={allergy._id?.toString()} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm flex justify-between items-center">
                <div>
                  <h3 className="font-bold text-lg text-gray-800">{allergy.name}</h3>
                  <p className="text-sm text-gray-600">
                    <strong>Associated Allergen IDs:</strong> {Array.isArray(allergy.allergensId) ? allergy.allergensId.join(', ') : 'N/A'}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button onClick={() => handleEdit(allergy)} className="px-4 py-1 text-sm text-white bg-yellow-500 rounded-md hover:bg-yellow-600 transition-colors">Edit</button>
                  <button onClick={() => handleDelete(allergy._id)} className="px-4 py-1 text-sm text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors">Delete</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No allergies found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
