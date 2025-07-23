'use client';

import { useSession, signOut,} from 'next-auth/react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Allergen, PublicPAP } from '@/lib/schema';
import { useParams } from "next/navigation";

// Allergy Profile Component
export default function AllergyProfile() {
    const { data: session } = useSession();
    const [pap, setPap] = useState<PublicPAP | null>(null);
    // const [crossAllergens, setCrossAllergens] = useState<Allergen[]>([]);
    const params = useParams<{ publicId: string }>();
    

    const fetchPap = useCallback(async () => {
    {
        try {
          const response = await fetch(`/api/pap/public/${params.publicId}`);
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

    // const fetchCrossAllergens = async () => {
    //   try {
    //     const response = await fetch('/api/cross');
    //     if (response.ok) {
    //       const data = await response.json();
    //       setCrossAllergens(data);
    //     } else {
    //       console.error('Failed to fetch cross allergens');
    //     }
    //   } catch (error) {
    //     console.error('An error occurred while fetching cross allergens:', error);
    //   }
    // };

    useEffect(() => {
      fetchPap();
    //   fetchCrossAllergens();
    }, [fetchPap]);
    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="flex flex-col items-center justify-start bg-gray-100 p-4 min-h-screen">
                <div className="w-full max-w-6xl min-h-screen p-8 space-y-6 bg-white rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-700">User{params.publicId}'s Profile</h2>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-3">
                            {pap && (
                                <PatientAllergyList
                                    pap={pap}
                                />
                            )}
                        </div>
                        <div>
                            {/* <CrossAllergySection 
                                crossAllergens={crossAllergens} 
                            /> */}
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
        
    );
};


// Patient's Allergy List
const PatientAllergyList = ({ pap, }: { pap: PublicPAP, }) => {
    console.log("PAP:", pap) 
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="font-bold text-lg mb-4 text-gray-800">This User's Known Allergies</h3>
            <div className="space-y-4">
                {pap.allergens!.length > 0 ? pap.allergens!.map((userAllergen) => {
                    return (
                        <div key={String(userAllergen.name)} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
                            <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-blue-600 text-lg">{userAllergen.name}</h4>
                            </div>
                            <div className="mt-2 text-sm text-gray-600">
                                <p><strong className="font-medium text-gray-800">Symptoms:</strong> {userAllergen.symptoms.join(', ')}</p>
                                <p className={'mt-1'}><strong className="font-medium text-gray-800">Causes Symptom:</strong> {userAllergen.name}</p>
                                <p className="mt-1"><strong className="font-medium text-gray-800">{'First Aid'}:</strong> {userAllergen.firstAid}</p>
                            </div>
                        </div>
                    );
                }) : <p className="text-gray-500">This user haven't added any allergies yet.</p>}
            </div>
        </div>
    );
};

// const CrossAllergySection = ({ crossAllergens}: { crossAllergens: Allergen[]}) => {
//     return (
//         <div className="bg-white p-6 rounded-xl shadow-lg mt-8">
//             <h3 className="font-bold text-lg mb-4 text-gray-800">Potential Cross-Allergens</h3>
//             {crossAllergens.length > 0 ? (
//                 <>
//                     <p className="text-sm text-gray-600 mb-2">Based on this user's allergies, they might be sensitive to:</p>
//                     <div className="space-y-4">
//                         {crossAllergens.map((allergen) => <div key={String(allergen._id)} className="border border-gray-200 rounded-lg p-4 cursor-pointer hover:bg-gray-50">
//                             <div className="flex justify-between items-start">
//                                 <h4 className="font-semibold text-blue-600 text-lg">{allergen.name}</h4>
//                             </div>
//                             <div className="mt-2 text-sm text-gray-600">
//                                 <p><strong className="font-medium text-gray-800">Symptoms:</strong> {allergen.symptoms.join(', ')}</p>
//                                 <p className={'mt-1'}><strong className="font-medium text-gray-800">Causes Symptom:</strong> {allergen.name}</p>
//                                 <p className="mt-1"><strong className="font-medium text-gray-800">{'First Aid'}:</strong> {allergen.firstAid}</p>
//                             </div>
//                         </div>)}
//                     </div>
//                 </>
//             ) : <p className="text-gray-500">No potential cross-allergens found.</p>}
//         </div>
//     );
// };
