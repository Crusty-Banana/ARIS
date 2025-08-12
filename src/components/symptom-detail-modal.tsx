import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Symptom } from "@/modules/business-types";
import { useTranslations } from "next-intl";

interface SymptomDetailModalProps {
    symptom: Symptom | null;
    onOpenChange: () => void;
};

export function SymptomDetailModal({ symptom, onOpenChange }: SymptomDetailModalProps) {
    
    const t = useTranslations('wikiLists');
    
    return (
        <Dialog open={!!symptom} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
            {symptom && (
                <>
                <DialogHeader>
                    <DialogTitle className="text-cyan-800">{t('symptomDetails')}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('name')}</label>
                    <div className="p-2 bg-gray-50 rounded">{symptom.name}</div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('severity')}</label>
                        <Badge
                        className={`${symptom.severity === 1 ? "bg-green-500" : symptom.severity === 2 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                        >
                        {t('severity')}: {symptom.severity}
                        </Badge>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{t('prevalence')}</label>
                        <Badge
                        className={`${symptom.prevalence <= 2 ? "bg-green-500" : symptom.prevalence <= 3 ? "bg-yellow-500" : "bg-red-500"} text-white`}
                        >
                        {t('prevalence')}: {symptom.prevalence}
                        </Badge>
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('treatment')}</label>
                    <div className="p-2 bg-gray-50 rounded min-h-[100px]">{symptom.treatment}</div>
                    </div>
                </div>
                </>
            )}
            </DialogContent>
        </Dialog>
    )
};