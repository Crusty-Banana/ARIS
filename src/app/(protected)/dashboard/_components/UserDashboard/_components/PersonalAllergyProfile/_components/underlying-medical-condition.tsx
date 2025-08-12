import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ClipboardList, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface UnderlyingMedicalConditionsCardProps {
    conditions: string[];
    onUpdate: (newConditions: string[]) => void;
}

export function UnderlyingMedicalConditionsCard({ conditions, onUpdate }: UnderlyingMedicalConditionsCardProps) {
    const t = useTranslations('personalAllergyProfile');
    const [newCondition, setNewCondition] = useState("");

    const handleAddCondition = () => {
        if (newCondition.trim() === "") return;
        const updatedConditions = [...(conditions || []), newCondition.trim()];
        onUpdate(updatedConditions);
        setNewCondition(""); // Clear the input field
    };

    const handleRemoveCondition = (indexToRemove: number) => {
        if (confirm(t('removeConditionConfirmation'))) {
            const updatedConditions = (conditions || []).filter((_, index) => index !== indexToRemove);
            onUpdate(updatedConditions);
        }
    };

    return (
        <Card className="bg-gradient-to-br from-cyan-50 to-blue-50 border-cyan-200">
            <CardHeader>
                <CardTitle className="text-cyan-800 flex items-center gap-2">
                    <ClipboardList className="h-5 w-5" />
                    {t('underlyingMedicalConditions')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {(conditions && conditions.length > 0) ? (
                        conditions.map((condition, index) => (
                            <div key={index} className="flex items-center justify-between bg-white/70 p-2 rounded-md border border-cyan-200">
                                <span className="text-sm text-gray-800">{condition}</span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveCondition(index)}
                                    className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-600"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-center text-gray-500 py-3">{t('noConditionsListed')}</p>
                    )}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t border-cyan-200">
                    <Input
                        placeholder={t('addConditionPlaceholder')}
                        value={newCondition}
                        onChange={(e) => setNewCondition(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddCondition()}
                        className="border-cyan-300 focus:border-cyan-500 bg-white/100"
                    />
                    <Button onClick={handleAddCondition} size="sm" variant="outline">
                        {t('add')}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}