'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Allergen, PAP } from '@/modules/business-types';
import {Eye, EyeOff, AlertTriangle} from 'lucide-react';
import { httpGet$GetAllergens } from '@/modules/commands/GetAllergens/fetcher';
import { httpPut$UpdatePAP } from '@/modules/commands/UpdatePAP/fetcher';
import { httpGet$GetPAP } from '@/modules/commands/GetPAP/fetcher';

type DiscoveryMethod = "Clinical symptoms" | "Paraclinical tests";

// Allergy Profile Component
export default function AllergyProfile() {
    const { data: session } = useSession();
    const [pap, setPap] = useState<PAP | null>(null);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [crossAllergens, setCrossAllergens] = useState<Allergen[]>([]);
    const [isPublicView, setIsPublicView] = useState(false);
    const [selectedAllergen, setSelectedAllergen] = useState<Allergen | null>(null);

    const fetchPap = useCallback(async () => {
      if (session) {
        try {
          const { pap, message } = await httpGet$GetPAP('/api/pap');
          if (pap) {
            setPap(pap);
          } else {
            console.error('Cannot fetch PAP.', message);
          }
        } catch (error) {
          console.error('An error occurred while fetching PAP:', error);
        }
      }
    }, [session]);

    const fetchAllergens = async () => {
      try {
        const { allergens } = await httpGet$GetAllergens('/api/allergens', {});
        setAllergens(allergens);
      } catch (error) {
        console.error('An error occurred while fetching allergens:', error);
      }
    };

    const fetchCrossAllergens = async () => {
      try {
        const response = await fetch('/api/cross');
        if (response.ok) {
          const data = await response.json();
          setCrossAllergens(data);
        } else {
          console.error('Failed to fetch cross allergens');
        }
      } catch (error) {
        console.error('An error occurred while fetching cross allergens:', error);
      }
    };

    useEffect(() => {
      fetchPap();
      fetchAllergens();
      fetchCrossAllergens();
    }, [fetchPap]);

    const handleAddToPap = async (allergenId: string) => {
        if (pap && session) {
            console.log("ALLERGENS", pap.allergens)
            const updatedAllergens = [
                ...pap.allergens,
                { 
                    allergenId: allergenId,
                    discoveryDate: 1753502456,
                    discoveryMethod: "Paraclinical tests" as DiscoveryMethod,
                    severity: 1,
                    symptomsId: ["6884b5063ca95cfdf500239b"] as Array<string> 
                },
            ];
            console.log("ALLERGENS", updatedAllergens)
            try {
                await httpPut$UpdatePAP(
                    '/api/pap',
                    { allergens: updatedAllergens },
                )
                fetchPap();
                fetchCrossAllergens();
            } catch (error) {
                console.error('An error occurred while updating PAP:', error);
            }
        }
    };

    const handleRemoveFromPap = async (allergenId: string) => {
        if (pap && session) {
            const updatedAllergens = pap.allergens.filter(
                (allergen) => String(allergen.allergenId) !== String(allergenId)
            );
            try {
                await httpPut$UpdatePAP(
                    '/api/pap',
                    { allergens: updatedAllergens },
                )
                fetchPap();
                fetchCrossAllergens();
            } catch (error) {
                console.error('An error occurred while updating PAP:', error);
            }
        }
    };

    const handleShowAllergenDetails = (allergen: Allergen) => {
        setSelectedAllergen(allergen);
    };

    const handleCloseModal = () => {
        setSelectedAllergen(null);
    };


    return (
        <div className="w-full max-w-6xl min-h-screen p-8 space-y-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold text-gray-700">My Profile</h2>
                <button onClick={() => setIsPublicView(!isPublicView)} className="flex items-center space-x-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg px-4 py-2 hover:bg-gray-50 transition">
                    {isPublicView ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    <span>{isPublicView ? 'Switch to Private View' : 'Switch to Public View'}</span>
                </button>
            </div>
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-md mb-6" role="alert">
                <p className="font-bold flex items-center"><AlertTriangle className="w-5 h-5 mr-2"/>{isPublicView ? 'Public View' : 'Private View'}</p>
                <p className="text-sm">{isPublicView ? 'This is how others see your profile. It only shows symptoms and first aid information.' : 'This is your private view. It includes all details about your allergies.'}</p>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                    {pap && (
                        <PatientAllergyList
                            pap={pap}
                            allergens={allergens}
                            isPublicView={isPublicView}
                            onRemove={handleRemoveFromPap}
                            onUpdate={fetchPap}
                        />
                    )}
                </div>
                <div>
                    <AddAllergySection
                        pap={pap}
                        allergens={allergens}
                        onAdd={handleShowAllergenDetails}
                    />
                    <CrossAllergySection crossAllergens={crossAllergens} isPublicView={isPublicView} onAdd={handleAddToPap} />
                </div>
                
            </div>
            {selectedAllergen && (
                <AllergenDetailsModal
                    allergen={selectedAllergen}
                    onClose={handleCloseModal}
                    onAdd={handleAddToPap}
                />
            )}
        </div>
    );
};


// Patient's Allergy List
const PatientAllergyList = ({ pap, allergens, isPublicView, onRemove}: { pap: PAP, allergens: Allergen[], isPublicView: boolean, onRemove: (allergenId: string) => void, onUpdate: () => void}, ) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">My Known Allergies</h3>
            <div className="space-y-4">
                {pap.allergens.length > 0 ? pap.allergens.map((userAllergen) => {
                    const allergenDetails = allergens.find(
                        (a) => a.id === String(userAllergen.allergenId)
                    );
                    if (!allergenDetails) return null;

                    return (
                        <div key={userAllergen.allergenId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-blue-600 text-lg">{allergenDetails.name}</h4>
                                {!isPublicView && (
                                    <button onClick={() => onRemove(userAllergen.allergenId)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                                )}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-800">Symptoms:</strong> {allergenDetails.symptomsId.join(', ')}</p>
                                <p className={isPublicView ? 'mt-1' : 'hidden'}><strong className="font-medium text-gray-800">Causes Symptom:</strong> {allergenDetails.name}</p>
                                {/* <p className="mt-1"><strong className="font-medium text-gray-800">{isPublicView ? 'First Aid' : 'Treatment'}:</strong> {isPublicView ? userAllergen. : allergenDetails.treatment}</p> */}
                            </div>
                            {!isPublicView && (
                                <div className="mt-2">
                                    <label>Severity:</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="5"
                                        value={userAllergen.severity}
                                        // onChange={(e) =>
                                        //     handleSeverityChange(
                                        //         userAllergen.allergenId,
                                        //         parseInt(e.target.value)
                                        //     )
                                        // }
                                        className="w-full"
                                    />
                                    <span>{userAllergen.severity}</span>
                                </div>
                            )}
                        </div>
                    );
                }) : <p className="text-gray-500">You haven&apos;t added any allergies yet.</p>}
            </div>
        </div>
    );
};

const CrossAllergySection = ({ crossAllergens, isPublicView, onAdd}: { crossAllergens: Allergen[], isPublicView: boolean, onAdd: (allergenId: string) => void  }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Potential Cross-Allergens</h3>
            {crossAllergens.length > 0 ? (
                <>
                    <p className="text-sm text-gray-600 mb-2">Based on your allergies, you might be sensitive to:</p>
                    <div className="space-y-4">
                        {crossAllergens.map((allergen) => <div key={allergen.id} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-blue-600 text-lg">{allergen.name}</h4>
                                {!isPublicView && allergen.id && (<button onClick={() => onAdd(allergen.id!)} 
                                    className="text-green-500 hover:text-green-700 text-sm font-medium">Add</button>
                                )}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-800">Symptoms:</strong> {allergen.symptomsId.join(', ')}</p>
                                <p className={isPublicView ? 'mt-1' : 'hidden'}><strong className="font-medium text-gray-800">Causes Symptom:</strong> {allergen.name}</p>
                                {/* <p className="mt-1"><strong className="font-medium text-gray-800">{isPublicView ? 'First Aid' : 'Treatment'}:</strong> {isPublicView ? allergen.firstAid : allergen.treatment}</p> */}
                            </div>
                        </div>)}
                    </div>
                </>
            ) : <p className="text-gray-500">No potential cross-allergens found.</p>}
        </div>
    );
};

// Section to Add Allergies (for Patient) with Autocomplete
const AddAllergySection = ({ pap, allergens, onAdd }: { pap: PAP | null, allergens: Allergen[], onAdd: (allergen: Allergen) => void }) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Allergen[]>([]);
    const wrapperRef = useRef(null);

    const availableAllergies = allergens.filter(dbAllergy =>
        !pap?.allergens.some(myAllergy => String(myAllergy.allergenId) === dbAllergy.id)
    );

    // Close suggestions when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !(wrapperRef.current as any).contains(event.target)) {
                setSuggestions([]);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setInputValue(value);
        if (value.trim().length > 0) {
            const filteredSuggestions = availableAllergies.filter(allergen =>
                allergen.name.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    };

    const handleSelectAllergy = (allergen: Allergen) => {
        onAdd(allergen);
        setInputValue('');
        setSuggestions([]);
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Add Allergy to Profile</h3>
            <div className="relative" ref={wrapperRef}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Type to search for an allergy..."
                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                />
                {suggestions.length > 0 && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-200 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-lg">
                        {suggestions.map(allergen => (
                            <li
                                key={allergen.id}
                                onClick={() => handleSelectAllergy(allergen)}
                                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm text-gray-700"
                            >
                                {allergen.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
             {availableAllergies.length === 0 && (
                <p className="text-gray-500 text-sm mt-4">All available allergies have been added to your profile.</p>
            )}
        </div>
    );
};

const AllergenDetailsModal = ({ allergen, onClose, onAdd }: { allergen: Allergen, onClose: () => void, onAdd: (allergenId: string) => void }) => {
    const handleAddClick = () => {
        if (allergen.id) {
            onAdd(allergen.id);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-gray-800/25 flex items-center justify-center z-50" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{allergen.name}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">&times;</button>
                </div>
                <div className="text-sm text-gray-600 space-y-2">
                    <p><strong className="font-medium text-gray-800">Symptoms:</strong> {allergen.symptomsId.join(', ')}</p>
                    <p><strong className="font-medium text-gray-800">Type:</strong> {allergen.type}</p>
                    <p><strong className="font-medium text-gray-800">Description:</strong> {allergen.description}</p>
                    <p><strong className="font-medium text-gray-800">Description:</strong> {allergen.description}</p>
                </div>
                <div className="mt-6 flex justify-end">
                    <button onClick={handleAddClick} className="px-6 py-2 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Add to My Profile</button>
                </div>
            </div>
        </div>
    );
};



