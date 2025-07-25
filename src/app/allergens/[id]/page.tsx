"use client";

import { useState, useEffect, useCallback } from "react";
import { Allergen, PAP } from "@/modules/business-types";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import { httpGet$GetAllergens } from "@/modules/commands/GetAllergens/fetcher";
import { httpGet$GetPAP } from "@/modules/commands/GetPAP/fetcher";
import { httpPut$UpdatePAP } from "@/modules/commands/UpdatePAP/fetcher";

export default function AllergenDetailsPage() {
    const { data: session } = useSession();
    const [allergen, setAllergen] = useState<Allergen | null>(null);
    const [pap, setPap] = useState<PAP | null>(null);
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const fetchAllergen = useCallback(async () => {
        try {
            const {allergens} = await httpGet$GetAllergens(`/api/allergens/${params.id}`, {});
            if (allergens) {
                setAllergen(allergens[0]);
            } else {
                console.error("Failed to fetch allergen");
            }
        } catch (error) {
            console.error("An error occurred while fetching allergen:", error);
        }
    }, [params.id]);

    const fetchPap = useCallback(async () => {
        if (session) {
            try {
                const { pap, message } = await httpGet$GetPAP("/api/pap");
                if (pap) {
                    setPap(pap);
                } else {
                    console.error("Failed to fetch PAP", message);
                }
            } catch (error) {
                console.error("An error occurred while fetching PAP:", error);
            }
        }
    }, [session]);

    useEffect(() => {
        fetchAllergen();
        fetchPap();
    }, [fetchAllergen, fetchPap]);

    const handleAddToPap = async () => {
        if (allergen && pap && session) {
            const updatedAllergens = [
                ...pap.allergens,
                { allergenId: allergen.id, degree: 1 },
            ];
            try {
                await httpPut$UpdatePAP("/api/pap", {
                    allergens: updatedAllergens,
                });
                fetchPap();
            } catch (error) {
                console.error("An error occurred while updating PAP:", error);
            }
        }
    };

    const isAllergenInPap = () => {
        return pap?.allergens.some((a) => a.allergenId === allergen?.id);
    };

    if (!allergen) {
        return <div>Loading...</div>;
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
                <button
                    onClick={() => router.back()}
                    className="px-4 py-2 font-bold text-white bg-gray-500 rounded-md hover:bg-gray-600"
                >
                    Back
                </button>
                <h1 className="text-3xl font-bold">{allergen.name}</h1>
                <p>
                    <strong>Symptoms:</strong> {allergen.symptoms.join(", ")}
                </p>
                <p>
                    <strong>Treatment:</strong> {allergen.treatment}
                </p>
                <p>
                    <strong>First Aid:</strong> {allergen.firstAid}
                </p>
                <button
                    onClick={handleAddToPap}
                    disabled={isAllergenInPap()}
                    className="w-full px-4 py-2 mt-4 font-bold text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {isAllergenInPap()
                        ? "Already in your PAP"
                        : "Add to my Personal Allergy Profile"}
                </button>
            </div>
        </div>
    );
}

