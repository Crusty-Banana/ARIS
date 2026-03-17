import { Button } from "@/components/ui/button";

// Define a type for your feature items
interface Feature {
  label: string;
  onClick?: () => void;
}

interface BetaMenuProps {
  features: Feature[];
}

export default function BetaMenu({ features }: BetaMenuProps) {
  return (
    <div className="bg-blue-600 w-full max-w-md p-8 rounded-2xl shadow-2xl text-white">
      <h2 className="text-2xl font-bold mb-6 text-center">Beta Features</h2>
      <div className="grid gap-4">
        {features.map((feature, index) => (
          <Button key={index} variant="secondary" onClick={feature.onClick}>
            {feature.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
