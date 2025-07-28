'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Allergen, PAP, Symptom } from '@/modules/business-types';
import {Eye, EyeOff, AlertTriangle} from 'lucide-react';
import { httpGet$GetAllergens } from '@/modules/commands/GetAllergens/fetcher';
import { httpGet$GetSymptoms } from '@/modules/commands/GetSymptoms/fetcher';
import { httpPut$UpdatePAP } from '@/modules/commands/UpdatePAP/fetcher';
import { httpGet$GetPAP } from '@/modules/commands/GetPAP/fetcher';

type DiscoveryMethod = "Clinical symptoms" | "Paraclinical tests";

// Data structure for adding a new allergy to the user's profile
interface NewUserAllergyData {
    allergenId: string;
    discoveryDate: number;
    discoveryMethod: DiscoveryMethod;
    symptomsId: string[];
    severity: number;
}


// Allergy Profile Component
export default function AllergyProfile() {
    const { data: session } = useSession();
    const [pap, setPap] = useState<PAP | null>(null);
    const [allergens, setAllergens] = useState<Allergen[]>([]);
    const [symptoms, setSymptoms] = useState<Symptom[]>([]);
    const [crossAllergens, setCrossAllergens] = useState<Allergen[]>([]);
    const [isPublicView, setIsPublicView] = useState(false);
    // State to manage the allergen being added and the modal's visibility
    const [allergenToAdd, setAllergenToAdd] = useState<Allergen | null>(null);

    const fetchPap = useCallback(async () => {
      if (session) {
        try {
          const { pap: fetchedPap, message } = await httpGet$GetPAP('/api/pap');
          if (fetchedPap) {
            setPap(fetchedPap);
          } else {
            console.error('Cannot fetch PAP.', message);
          }
        } catch (error) {
          console.error('An error occurred while fetching PAP:', error);
        }
      }
    }, [session]);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                // Fetch all static data concurrently
                const [allergenData, symptomData] = await Promise.all([
                    httpGet$GetAllergens('/api/allergens', {}),
                    httpGet$GetSymptoms('/api/symptoms', {})
                ]);
                setAllergens(allergenData.allergens);
                setSymptoms(symptomData.symptoms);
            } catch (error) {
                console.error('An error occurred while fetching initial data:', error);
            }
        };

        fetchAllData();
    }, []);

    useEffect(() => {
        const fetchDynamicData = async () => {
            if (session) {
                await fetchPap();
            }
        };
        fetchDynamicData();
    }, [session, fetchPap]);

    useEffect(() => {
        // Fetches cross allergens whenever the user's PAP changes
        const fetchCrossAllergens = async () => {
          if (pap) {
            try {
              const response = await fetch('/api/cross'); // This API should internally use the user's PAP
              if (response.ok) {
                const data = await response.json();
                setCrossAllergens(data);
              } else {
                console.error('Failed to fetch cross allergens');
              }
            } catch (error) {
              console.error('An error occurred while fetching cross allergens:', error);
            }
          }
        };

        fetchCrossAllergens();
    }, [pap]);


    // This function now opens the modal to collect details
    const handleInitiateAdd = (allergen: Allergen) => {
        setAllergenToAdd(allergen);
    };

    // This function receives the detailed data from the modal and updates the PAP
    const handleConfirmAddToPap = async (newData: NewUserAllergyData) => {
        if (pap && session) {
            const updatedAllergens = [...pap.allergens, newData];
            try {
                await httpPut$UpdatePAP(
                    '/api/pap',
                    { allergens: updatedAllergens },
                );
                fetchPap(); // Refetch to update the UI
            } catch (error) {
                console.error('An error occurred while updating PAP:', error);
            }
        }
        setAllergenToAdd(null); // Close the modal on success
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
            } catch (error) {
                console.error('An error occurred while updating PAP:', error);
            }
        }
    };

    const handleCloseModal = () => {
        setAllergenToAdd(null);
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
                            symptoms={symptoms}
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
                        onAdd={handleInitiateAdd} // Changed to open modal
                    />
                    <CrossAllergySection 
                        crossAllergens={crossAllergens}
                        symptoms={symptoms} 
                        isPublicView={isPublicView} 
                        onAdd={handleInitiateAdd} // Changed to open modal
                    />
                </div>
            </div>

            {/* Render the new modal for adding an allergen */}
            {allergenToAdd && (
                <AddAllergyModal
                    allergen={allergenToAdd}
                    allSymptoms={symptoms}
                    onClose={handleCloseModal}
                    onSubmit={handleConfirmAddToPap}
                />
            )}
        </div>
    );
};

// --- Child Components remain largely the same, but with updated props ---

// Patient's Allergy List (No major changes needed)
const PatientAllergyList = ({ pap, allergens, symptoms, isPublicView, onRemove}: { pap: PAP, allergens: Allergen[], symptoms: Symptom[], isPublicView: boolean, onRemove: (allergenId: string) => void, onUpdate: () => void}, ) => {

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">My Known Allergies</h3>
            <div className="space-y-4">
                {pap.allergens.length > 0 ? pap.allergens.map((userAllergen) => {
                    const allergenDetails = allergens.find(
                        (a) => a.id === String(userAllergen.allergenId)
                    );
                    if (!allergenDetails) return null;
                    const symptomDetails = userAllergen.symptomsId.map((symptomID) => {
                        return symptoms.find((a) => a.id === String(symptomID))
                    })

                    return (
                        <div key={userAllergen.allergenId} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-blue-600 text-lg">{allergenDetails.name}</h4>
                                {!isPublicView && (
                                    <button onClick={() => onRemove(userAllergen.allergenId)} className="text-red-500 hover:text-red-700 text-sm font-medium">Remove</button>
                                )}
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p className="space-y-2">
                                    <strong className="font-medium text-gray-800">Symptoms:</strong>
                                    {symptomDetails.map((symptomDetail) => (
                                        <div key={symptomDetail!.id} className="border border-gray-200 rounded-lg p-4 ">
                                            <p className="mt-1"><strong className="font-medium text-gray-800">{'Name'}:</strong> {symptomDetail!.name}</p>
                                            <p className="mt-1"><strong className="font-medium text-gray-800">{'Treatment'}:</strong> {symptomDetail!.treatment}</p>
                                        </div>
                                    ))}
                                </p>
                                <p className={isPublicView ? 'mt-1' : 'hidden'}>
                                    <strong className="font-medium text-gray-800">Causes Symptom:</strong> {allergenDetails.name}
                                </p>
                                <p className={isPublicView ? 'hidden' : 'mt-1'}>
                                    <strong className="font-medium text-gray-800">Prevalence:</strong> {allergenDetails.prevalence}/5 <br />
                                    <strong className="font-medium text-gray-800">Discovery Date:</strong> {new Date(userAllergen.discoveryDate * 1000).toLocaleDateString()} <br />
                                    <strong className="font-medium text-gray-800">Discovery Method:</strong> {userAllergen.discoveryMethod} <br />
                                </p>
                            </div>
                            {!isPublicView && (
                                <div className="mt-2">
                                    <label>Severity:</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="3"
                                        value={userAllergen.severity}
                                        readOnly
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

// Cross Allergy Section (No major changes needed)
const CrossAllergySection = ({ crossAllergens, symptoms, isPublicView, onAdd}: { crossAllergens: Allergen[], symptoms: Symptom[], isPublicView: boolean, onAdd: (allergen: Allergen) => void  }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800">Potential Cross-Allergens</h3>
            {crossAllergens.length > 0 ? (
                <>
                    <p className="text-sm text-gray-600 mb-2">Based on your allergies, you might be sensitive to:</p>
                    <div className="space-y-4">
                        {crossAllergens.map((allergen) => {
                            const possibleSymptomNames = allergen.symptomsId.map((symptomID) => {
                                const result = symptoms.find((a) => a.id === String(symptomID))
                                return result ? result.name : ""
                            })
                            return <div key={allergen.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-semibold text-blue-600 text-lg">{allergen.name}</h4>
                                    {!isPublicView && allergen.id && (<button onClick={() => onAdd(allergen)} 
                                        className="text-green-500 hover:text-green-700 text-sm font-medium">Add</button>
                                    )}
                                </div>
                                <div className="mt-2 text-sm text-gray-600">
                                    <p><strong className="font-medium text-gray-800">Possible symptoms:</strong> {possibleSymptomNames.join(', ')}</p>
                                    <p className={isPublicView ? 'mt-1' : 'hidden'}><strong className="font-medium text-gray-800">Causes Symptom:</strong> {allergen.name}</p>
                                </div>
                            </div>
                        }
                        )}
                    </div>
                </>
            ) : <p className="text-gray-500">No potential cross-allergens found.</p>}
        </div>
    );
};


// AddAllergySection (No major changes needed)
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
        onAdd(allergen); // Trigger the modal in the parent
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

const AddAllergyModal = ({ allergen, allSymptoms, onClose, onSubmit }: {
    allergen: Allergen;
    allSymptoms: Symptom[];
    onClose: () => void;
    onSubmit: (data: NewUserAllergyData) => void;
}) => {
    const [discoveryDate, setDiscoveryDate] = useState('');
    const [discoveryMethod, setDiscoveryMethod] = useState<DiscoveryMethod>('Clinical symptoms');
    const [selectedSymptomIds, setSelectedSymptomIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);

    // Filter allSymptoms to only include those relevant to the current allergen
    const relevantSymptoms = allSymptoms.filter(symptom => 
        allergen.symptomsId.includes(symptom.id!)
    );

    const handleSymptomChange = (symptomId: string) => {
        setSelectedSymptomIds(prev =>
            prev.includes(symptomId)
                ? prev.filter(id => id !== symptomId)
                : [...prev, symptomId]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!discoveryDate || selectedSymptomIds.length === 0) {
            setError("Please provide a discovery date and select at least one observed symptom.");
            return;
        }

        const selectedSymptoms = allSymptoms.filter(s => selectedSymptomIds.includes(s.id!));
        const maxSeverity = Math.max(...selectedSymptoms.map(s => s.severity), 1);
        const discoveryTimestamp = Math.floor(new Date(discoveryDate).getTime() / 1000);

        onSubmit({
            allergenId: allergen.id!,
            discoveryDate: discoveryTimestamp,
            discoveryMethod,
            symptomsId: selectedSymptomIds,
            severity: maxSeverity,
        });
    };

    return (
        <div className="fixed inset-0 bg-gray-800/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white p-8 rounded-xl shadow-2xl max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Add <span className="text-blue-600">{allergen.name}</span> to Profile</h2>
                        <button type="button" onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">&times;</button>
                    </div>
                    
                    <div className="space-y-6">
                        {/* Discovery Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                             <div>
                                <label htmlFor="discoveryDate" className="block text-sm font-medium text-gray-700 mb-1">Discovery Date</label>
                                <input
                                    id="discoveryDate"
                                    type="date"
                                    value={discoveryDate}
                                    onChange={(e) => setDiscoveryDate(e.target.value)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="discoveryMethod" className="block text-sm font-medium text-gray-700 mb-1">Discovery Method</label>
                                <select
                                    id="discoveryMethod"
                                    value={discoveryMethod}
                                    onChange={(e) => setDiscoveryMethod(e.target.value as DiscoveryMethod)}
                                    className="w-full p-2.5 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option>Clinical symptoms</option>
                                    <option>Paraclinical tests</option>
                                </select>
                            </div>
                        </div>

                        {/* Symptom Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Observed Symptoms</label>
                            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {relevantSymptoms.map(symptom => ( // Changed to iterate over relevantSymptoms
                                    <div key={symptom.id} className="flex items-center">
                                        <input
                                            id={`symptom-${symptom.id}`}
                                            type="checkbox"
                                            checked={selectedSymptomIds.includes(symptom.id!)}
                                            onChange={() => handleSymptomChange(symptom.id!)}
                                            className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                        />
                                        <label htmlFor={`symptom-${symptom.id}`} className="ml-3 text-sm text-gray-600">{symptom.name}</label>
                                    </div>
                                ))}
                                {relevantSymptoms.length === 0 && (
                                    <p className="text-gray-500 text-sm col-span-full">No potential symptoms are listed for this allergen.</p>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                    <div className="mt-8 flex justify-end space-x-4">
                         <button type="button" onClick={onClose} className="px-6 py-2 font-semibold text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors">Cancel</button>
                        <button type="submit" className="px-6 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors">Add to My Profile</button>
                    </div>
                </form>
            </div>
        </div>
    );
};