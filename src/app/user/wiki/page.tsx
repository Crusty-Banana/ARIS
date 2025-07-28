'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback } from 'react';
import { Allergen, PAP, Symptom } from '@/modules/business-types'; // Make sure to import Symptom
import { httpGet$GetAllergens } from '@/modules/commands/GetAllergens/fetcher';
import { httpGet$GetSymptoms } from '@/modules/commands/GetSymptoms/fetcher'; // You'll need to create this fetcher
import { httpPut$UpdatePAP } from '@/modules/commands/UpdatePAP/fetcher';
import { httpGet$GetPAP } from '@/modules/commands/GetPAP/fetcher';


/**
 * Main page component for the Allergy Wiki.
 * Fetches all necessary data and passes it to the wiki component.
 */
export default function WikiPage() {
    const { data: session } = useSession();
    const [pap, setPap] = useState<PAP | null>(null);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [symptoms, setSymptoms] = useState<Symptom[]>([]); // New state for symptoms

    const fetchPap = useCallback(async () => {
        if (session) {
            try {
                const { pap } = await httpGet$GetPAP('/api/pap');
                setPap(pap ?? null); // Simplified setting state
            } catch (error) {
                console.error('An error occurred while fetching PAP:', error);
            }
        }
    }, [session]);

    // We can define these outside useCallback as they don't have dependencies
    const fetchAllergens = async () => {
        try {
            const { allergens } = await httpGet$GetAllergens('/api/allergens', {});
            setAllergens(allergens);
        } catch (error) {
            console.error('An error occurred while fetching allergens:', error);
        }
    };

    // New function to fetch all symptoms
    const fetchSymptoms = async () => {
        try {
            // Assuming you create a similar fetcher and API endpoint for symptoms
            const { symptoms } = await httpGet$GetSymptoms('/api/symptoms', {});
            setSymptoms(symptoms);
        } catch (error) {
            console.error('An error occurred while fetching symptoms:', error);
        }
    };

    useEffect(() => {
        // Fetch data that doesn't depend on the session once
        fetchAllergens();
        fetchSymptoms();
    }, []);

    return (
        <AllergyWiki
            allergens={allergens}
            symptoms={symptoms} // Pass symptoms down
        />
    );
}


interface AllergenDetailModalProps {
    allergen: Allergen;
    allSymptoms: Symptom[];
    onClose: () => void;
}

export const AllergenDetailModal = ({
    allergen,
    allSymptoms,
    onClose,
}: AllergenDetailModalProps) => {
    // Find the full symptom objects corresponding to the IDs in the allergen
    const relevantSymptoms = allSymptoms.filter(symptom => 
        allergen.symptomsId.includes(symptom.id)
    );

    return (
        // Modal backdrop
        <div 
            className="fixed inset-0 bg-gray-800/50 flex justify-center items-center z-50"
            onClick={onClose} // Close modal on backdrop click
        >
            {/* Modal content */}
            <div 
                className="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full space-y-4"
                onClick={e => e.stopPropagation()} // Prevent content click from closing modal
            >
                <div className="flex justify-between items-start">
                    <h2 className="text-3xl font-bold text-gray-800">{allergen.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>
                </div>
                
                <p className="text-gray-600">{allergen.description}</p>
                
                <div className="flex space-x-4 text-sm">
                    <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full font-medium">{allergen.type}</span>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium">Prevalence: {allergen.prevalence}/5</span>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mt-4 mb-2 text-gray-700">Possible Symptoms</h3>
                    <div className="space-y-2">
                        {relevantSymptoms.length > 0 ? relevantSymptoms.map(symptom => (
                            <div key={symptom.id} className="p-3 bg-gray-50 rounded-md">
                                <p className="font-semibold">{symptom.name} <span className="font-normal text-gray-500">(Severity: {symptom.severity}/3)</span></p>
                                {symptom.treatment && <p className="text-sm text-gray-600"><strong>Treatment:</strong> {symptom.treatment}</p>}
                            </div>
                        )) : <p className="text-gray-500">No specific symptoms listed.</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};


interface AllergyWikiProps {
    allergens: Allergen[];
    symptoms: Symptom[];
}

export const AllergyWiki = ({ allergens, symptoms}: AllergyWikiProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState<Allergen[]>([]);
    const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null);

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setSearchResults([]);
            return;
        }
        
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        const results = allergens.filter(allergen => 
            allergen.name.toLowerCase().includes(lowercasedSearchTerm) ||
            allergen.description.toLowerCase().includes(lowercasedSearchTerm)
        );
        setSearchResults(results);
    }, [searchTerm, allergens]);

    const handleSelectAllergen = (allergen: Allergen) => {
        setSelectedAllergen(allergen);
    };
    
    const handleCloseModal = () => {
        setSelectedAllergen(null);
    };

    return (
        <>
            <div className="w-full max-w-4xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Allergy Wiki</h2>
                <input
                    type="text"
                    placeholder="Search for allergens by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 mb-4"
                />
                <div className="space-y-3">
                    {searchResults.length > 0 ? searchResults.map((allergen) => (
                        <div 
                            key={String(allergen.id)} 
                            className="p-4 border border-gray-200 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                            onClick={() => handleSelectAllergen(allergen)}
                        >
                            <h3 className="font-bold text-lg text-gray-800">{allergen.name}</h3>
                            <p className="text-sm text-gray-500 truncate">{allergen.description || 'No description available.'}</p>
                        </div>
                    )) : (
                        <p className="text-gray-500">
                            {searchTerm.trim() === '' ? 'Start typing to search for allergens.' : 'No allergens found for your search term.'}
                        </p>
                    )}
                </div>
            </div>

            {selectedAllergen && (
                <AllergenDetailModal 
                    allergen={selectedAllergen}
                    allSymptoms={symptoms}
                    onClose={handleCloseModal}
                />
            )}
        </>
    );
};