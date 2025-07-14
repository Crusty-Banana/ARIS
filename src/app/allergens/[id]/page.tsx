"use client";

import { useState, useEffect, useCallback } from "react";
import { Allergen, PAP } from "@/lib/schema";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

export default function AllergenDetailsPage() {
    const { data: session } = useSession();
    const [allergen, setAllergen] = useState<Allergen | null>(null);
    const [pap, setPap] = useState<PAP | null>(null);
    const router = useRouter();
    const params = useParams<{ id: string }>();

    const fetchAllergen = useCallback(async () => {
        try {
            const response = await fetch(`/api/allergens/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setAllergen(data.allergen);
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
                const response = await fetch("/api/pap");
                if (response.ok) {
                    const data = await response.json();
                    setPap(data);
                } else {
                    console.error("Failed to fetch PAP");
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
                { allergenId: allergen._id, degree: 1 },
            ];
            try {
                const response = await fetch("/api/pap", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        ...pap,
                        allergens: updatedAllergens,
                    }),
                });
                if (response.ok) {
                    fetchPap();
                } else {
                    console.error("Failed to update PAP");
                }
            } catch (error) {
                console.error("An error occurred while updating PAP:", error);
            }
        }
    };

    const isAllergenInPap = () => {
        return pap?.allergens.some((a) => a.allergenId === allergen?._id);
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

