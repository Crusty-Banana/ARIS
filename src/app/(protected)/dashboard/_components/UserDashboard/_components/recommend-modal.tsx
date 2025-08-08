"use-client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddRecommendation$Params } from "@/modules/commands/AddRecommendation/typing"
import { RecommendationType } from "@/modules/business-types"
import { Input } from "@/components/ui/input"
import { httpPost$AddRecommendation } from "@/modules/commands/AddRecommendation/fetcher"


interface RecommendModalProps {
    open: boolean
    onClose: () => void
}

export function RecommendModal({
    open,
    onClose,
}: RecommendModalProps) {
    const [type, setType] = useState<RecommendationType>("");
    const [content, setContent] = useState<string>("");

    const handleAddRecommendation = async (rec: AddRecommendation$Params) => {
        const data = await httpPost$AddRecommendation('/api/recommendations', rec);
        if (!data.success) {
            console.error(data.message);
        }
    }

    const handleSubmit = () => {
        if (!type || !content) return;

        handleAddRecommendation({
            type,
            content
        });

        setType("");
        setContent("");
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="">
                <DialogHeader>
                    <DialogTitle className="text-cyan-800">{"Add Recommendation"}</DialogTitle>
                </DialogHeader>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-h-[70vh] overflow-y-auto">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{"Recommendation Type"}</label>
                        <Select value={type} onValueChange={(value) => setType(value as RecommendationType)}>
                            <SelectTrigger className="border-cyan-300 focus:border-cyan-500">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Allergen Suggestion">{"Allergen Suggestion"}</SelectItem>
                                <SelectItem value="General Feedback">{"General Feedback"}</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">{"Content"}</label>
                        <Input
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={"Your recommendation..."}
                            required
                            className="border-cyan-300 focus:border-cyan-500"
                        />
                    </div>
                </div>


                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={!type || !content}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                        {"Submit"}
                    </Button>
                    
                    <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
                        {"Cancel"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}