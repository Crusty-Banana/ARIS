import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

interface SearchBarProps {
  value: string;
  setValue: (value: string) => void;
  delay?: number;
  searchPlaceholder?: string;
  className?: string;
}

export function SearchBar({
  value, // parent's value
  setValue, // parent's setter
  delay = 300,
  searchPlaceholder = "Search...",
  className,
}: SearchBarProps) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  // parent clears form
  useEffect(() => {
    setDebouncedValue(value);
  }, [value]);

  useEffect(() => {
    if (debouncedValue === value) return; // prevent loop, TODO: check this logic

    const handler = setTimeout(() => {
      setValue(debouncedValue);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, delay, setValue, value]);

  return (
    <div className={className}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      <Input
        value={debouncedValue}
        onChange={(e) => setDebouncedValue(e.target.value)}
        placeholder={searchPlaceholder}
        className="pl-10 border-cyan-300 focus:border-cyan-500"
      />
    </div>
  );
}
