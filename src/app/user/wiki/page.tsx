'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Allergen, PAP } from '@/modules/business-types';
import { ObjectId } from 'mongodb';

/**
 * Main page component for the Allergy Wiki.
 * Fetches all necessary data and passes it to the wiki component.
 */
export default function WikiPage() {
    const { data: session } = useSession();
    const [pap, setPap] = useState<PAP | null>(null);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    
    const fetchPap = useCallback(async () => {
        if (session) {
            try {
                const response = await fetch('/api/pap');
                if (response.ok) {
                    const data = await response.json();
                    setPap(data);
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
            }
        } catch (error) {
            console.error('An error occurred while fetching allergens:', error);
        }
    };

    useEffect(() => {
        fetchPap();
        fetchAllergens();
    }, [fetchPap]);

    const handleUpdatePap = async (updatedAllergens :{ allergenId: ObjectId; degree: number }[]) => {
        if (pap && session) {
            try {
                const response = await fetch('/api/pap', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...pap, allergens: updatedAllergens }),
                });
                if (response.ok) {
                    fetchPap(); // Re-fetch PAP to update state
                } else {
                    console.error('Failed to update PAP');
                }
            } catch (error) {
                console.error('An error occurred while updating PAP:', error);
            }
        }
    }

    const handleAddToPap = async (allergenId: ObjectId) => {
        if (pap) {
            const updatedAllergens = [...pap.allergens, { allergenId, degree: 1 }];
            handleUpdatePap(updatedAllergens);
        }
    };

    const handleRemoveFromPap = async (allergenId: ObjectId) => {
        if (pap) {
            const updatedAllergens = pap.allergens.filter(
                (allergen) => String(allergen.allergenId) !== String(allergenId)
            );
            handleUpdatePap(updatedAllergens);
        }
    };

    return (
        <AllergyWiki 
            allergens={allergens} 
            pap={pap!} 
            onAddToPap={handleAddToPap} 
            onRemoveFromPap={handleRemoveFromPap} 
        />
    );
}

/**
 * Renders the interactive allergy wiki, allowing users to search
 * and manage allergens in their profile.
 */
const AllergyWiki = ({ allergens, pap, onAddToPap, onRemoveFromPap } : { allergens: Allergen[], pap: PAP, onAddToPap: (allergenId: ObjectId) => void, onRemoveFromPap: (allergenId: ObjectId) => void}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Allergen[]>([]);

    useEffect(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = searchTerm.trim() === ''
        ? []
        : allergens.filter(allergen =>
            allergen.name.toLowerCase().includes(lowercasedSearchTerm) ||
            allergen.symptoms?.some(s => s.toLowerCase().includes(lowercasedSearchTerm)) ||
            allergen.treatment?.toLowerCase().includes(lowercasedSearchTerm) ||
            allergen.firstAid?.toLowerCase().includes(lowercasedSearchTerm)
            );
        setSearchResults(results);
    }, [searchTerm, allergens]);

    const isAllergenInPap = (allergenId: ObjectId) => {
        return pap?.allergens.some(a => String(a.allergenId) === String(allergenId));
    };

    return (
        <div className="w-full max-w-6xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Allergy Wiki</h2>
        <input
            type="text"
            placeholder="Search by name, symptom, treatment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
        />
        <div className="space-y-4">
            {searchResults.length > 0 ? searchResults.map((allergen) => (
            <div key={String(allergen._id)} className="p-4 border border-gray-200 rounded-lg">
                <h3 className="font-bold text-lg text-gray-800">{allergen.name}</h3>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                    <p><strong className="font-medium">Symptoms:</strong> {allergen.symptoms.join(', ')}</p>
                    <p><strong className="font-medium">Treatment:</strong> {allergen.treatment}</p>
                    <p><strong className="font-medium">First Aid:</strong> {allergen.firstAid}</p>
                </div>
                {pap && (
                    isAllergenInPap(allergen._id!) ? (
                    <button
                        onClick={() => onRemoveFromPap(allergen._id!)}
                        className="mt-4 px-4 py-2 text-sm font-bold text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
                    >
                        Remove from My Profile
                    </button>
                    ) : (
                    <button
                        onClick={() => onAddToPap(allergen._id!)}
                        className="mt-4 px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        Add to My Profile
                    </button>
                    )
                )}
            </div>
            )) : <p className="text-gray-500">No allergens found for your search term.</p>}
        </div>
        </div>
    );
};
