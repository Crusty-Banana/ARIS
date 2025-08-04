'use client'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useState } from "react";
import { useRouter } from "next/navigation";


type Locale = 'vi' | 'en'

const locales = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
] as const

const getInitialLocale = (): Locale => {
    if (typeof document === 'undefined') return 'en'
    const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
    return (match && (match[1] === 'en' || match[1] === 'vi')) ? match[1] as Locale : 'en';
}

export default function LocaleDropdown() {
    const [currentLocale, setCurrentLocale] = useState<Locale>(getInitialLocale())
    const router = useRouter()

    const changeLanguage = (locale: Locale) => {
        document.cookie = `locale=${locale}; path=/; max-age=${60 * 60 * 24 * 365}`;
        setCurrentLocale(locale);
        router.refresh(); // This will trigger a soft refresh of the page
    }

    return (
        <Select value={currentLocale} onValueChange={(value: Locale) => changeLanguage(value)}>
            <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
                {locales.map((loc) => (
                    <SelectItem key={loc.code} value={loc.code}>
                        <div className="flex items-center gap-2">
                            <span>{loc.flag}</span>
                            <span>{loc.name}</span>
                        </div>
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    )
}