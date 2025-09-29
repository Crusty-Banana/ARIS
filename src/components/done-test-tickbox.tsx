import { useTranslations } from "next-intl";
import { Checkbox } from "./ui/checkbox";

interface DoneTestTickboxProb {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function DoneTestTickbox({
  checked,
  onCheckedChange,
}: DoneTestTickboxProb) {
  const t = useTranslations("addAllergenModal");
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="already-tested"
          checked={checked}
          onCheckedChange={onCheckedChange}
        />
        <label
          htmlFor="already-tested"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {t("doneTest")}
        </label>
      </div>
    </div>
  );
}
