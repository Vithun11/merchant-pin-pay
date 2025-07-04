import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Country {
  code: string;
  name: string;
  flag: string;
  dialCode: string;
}

const countries: Country[] = [
  { code: "IN", name: "India", flag: "🇮🇳", dialCode: "+91" },
  { code: "US", name: "United States", flag: "🇺🇸", dialCode: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dialCode: "+44" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dialCode: "+1" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dialCode: "+61" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dialCode: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dialCode: "+33" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dialCode: "+81" },
  { code: "SG", name: "Singapore", flag: "🇸🇬", dialCode: "+65" },
  { code: "AE", name: "UAE", flag: "🇦🇪", dialCode: "+971" },
];

interface CountrySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onValueChange
}) => {
  const selectedCountry = countries.find(c => c.dialCode === value) || countries[0];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedCountry.flag}</span>
            <span className="font-medium">{selectedCountry.dialCode}</span>
            <span className="text-muted-foreground text-sm">{selectedCountry.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {countries.map((country) => (
          <SelectItem key={country.code} value={country.dialCode}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{country.flag}</span>
              <span className="font-medium">{country.dialCode}</span>
              <span className="text-muted-foreground">{country.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};