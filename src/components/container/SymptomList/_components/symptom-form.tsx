import { GradientSlider } from "@/components/gradient-slider";
import { LanguageDropdown } from "@/components/language-dropdown";
import { NameInput } from "@/components/name-input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, X } from "lucide-react";
import { DisplayString, Language } from "@/modules/business-types";
import { useTranslations } from "next-intl";
import { useRef } from "react";

interface SymptomFormProps {
  selectedLanguage: Language;
  setSelectedLanguage: (language: Language) => void;
  name: DisplayString;
  handleNameChange: (value: string) => void;
  severity: number;
  setSeverity: (value: number) => void;
  prevalence: number;
  setPrevalence: (value: number) => void;
  treatment: DisplayString;
  handleTreatmentChange: (value: string) => void;
  media: string[];
  onMediaAdd: (files: FileList) => void;
  onMediaRemove: (url: string) => void;
}

export function SymptomForm(
  {
    selectedLanguage,
    setSelectedLanguage,
    name,
    handleNameChange,
    severity,
    setSeverity,
    prevalence,
    setPrevalence,
    treatment,
    handleTreatmentChange,
    media,
    onMediaAdd,
    onMediaRemove,
  } : SymptomFormProps
) {
  const t = useTranslations('common');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onMediaAdd(e.target.files);
    }
  };
  const isVideo = (url: string) => /\.(mp4|webm|ogg)$/i.test(url) || url.startsWith("blob:");

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <NameInput name={name} selectedLanguage={selectedLanguage} handleNameChange={handleNameChange} />
        <LanguageDropdown selectedLanguage={selectedLanguage} setSelectedLanguage={setSelectedLanguage} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <GradientSlider value={[severity]} onValueChange={value => setSeverity(value[0])} min={1} max={3} label={t('detailModals.severityLabel')} />
        <GradientSlider value={[prevalence]} onValueChange={value => setPrevalence(value[0])} min={1} max={5} label={t('detailModals.prevalenceLabel')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {t("treatment")} ({selectedLanguage === "en" ? "English" : "Tiếng Việt"})
        </label>
        <Textarea
          value={treatment[selectedLanguage]}
          onChange={(e) => handleTreatmentChange(e.target.value)}
          placeholder={t('detailModals.treatmentPlaceholder')}
          required
          className="border-cyan-300 focus:border-cyan-500 min-h-[80px]" />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          {t('mediaLabel')}
        </label>
        <div className="p-2 border border-dashed border-cyan-300 rounded-md space-y-3">
          <div className="grid grid-cols-3 gap-2">
            {(media || []).map((url, index) => (
              <div key={index} className="relative group aspect-square">
                {isVideo(url) ? (
                  <video src={url} controls className="w-full h-full object-cover rounded" />
                ) : (
                  <img src={url} alt={`Symptom media ${index + 1}`} className="w-full h-full object-cover rounded" />
                )}
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => onMediaRemove(url)}
                  className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Input
            type="file"
            multiple
            accept="image/*,video/*"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            className="w-full flex items-center gap-2"
          >
            <Upload className="h-4 w-4" />
            <span>{t('uploadMediaPlaceholder')}</span>
          </Button>
        </div>
      </div>
    </>
  )
}