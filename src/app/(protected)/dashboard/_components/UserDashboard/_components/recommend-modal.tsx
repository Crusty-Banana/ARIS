"use-client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AddRecommendation$Params } from "@/modules/commands/AddRecommendation/typing"
import { RecommendationType } from "@/modules/business-types"
import { httpPost$AddRecommendation } from "@/modules/commands/AddRecommendation/fetcher"
import { Textarea } from "@/components/ui/textarea"


interface AddRecommendationModalProps {
    open: boolean
    onClose: () => void
}

export function AddRecommendationModal({
    open,
    onClose,
}: AddRecommendationModalProps) {
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

    const handleCancel = () => {
        setType("");
        setContent("");
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleCancel}>
            <DialogContent className="flex flex-col h-[60vh] min-w-[40vw]">
                <DialogHeader>
                    <DialogTitle className="text-cyan-800">{"Add Recommendation"}</DialogTitle>
                </DialogHeader>


                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">{"Recommendation Type"}</label>
                    <Select value={type} onValueChange={(value) => setType(value as RecommendationType)}>
                        <SelectTrigger className="w-[250px] border-cyan-300 focus:border-cyan-500">
                            <SelectValue placeholder="Select a recommendation type..."/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Allergen Suggestion">{"Allergen Suggestion"}</SelectItem>
                            <SelectItem value="General Feedback">{"General Feedback"}</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <label className="text-wrap max-w-full text-sm font-medium text-gray-700 mb-1">{"Content"}</label>
                    <Textarea
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder={"Your recommendation..."}
                            required
                            className="border-cyan-300 focus:border-cyan-500 resize-none flex-grow"
                    />
                </div>



                <div className="flex gap-2 pt-4 border-t">
                    <Button
                        onClick={handleSubmit}
                        disabled={!type || !content}
                        className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
                    >
                        {"Submit"}
                    </Button>
                    
                    <Button variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                        {"Cancel"}
                    </Button>
                </div>

            </DialogContent>
        </Dialog>
    )
}