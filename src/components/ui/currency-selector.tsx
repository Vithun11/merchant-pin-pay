import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Currency {
  code: string;
  name: string;
  symbol: string;
  flag: string;
}

const currencies: Currency[] = [
  { code: "INR", name: "Indian Rupee", symbol: "₹", flag: "🇮🇳" },
  { code: "USD", name: "US Dollar", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "GBP", name: "British Pound", symbol: "£", flag: "🇬🇧" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥", flag: "🇯🇵" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$", flag: "🇦🇺" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$", flag: "🇨🇦" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$", flag: "🇸🇬" },
  { code: "AED", name: "UAE Dirham", symbol: "د.إ", flag: "🇦🇪" },
];

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
}

export const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  value,
  onValueChange
}) => {
  const selectedCurrency = currencies.find(c => c.code === value) || currencies[0];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue>
          <div className="flex items-center space-x-2">
            <span className="text-lg">{selectedCurrency.flag}</span>
            <span className="font-medium">{selectedCurrency.symbol} {selectedCurrency.code}</span>
            <span className="text-muted-foreground text-sm">{selectedCurrency.name}</span>
          </div>
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {currencies.map((currency) => (
          <SelectItem key={currency.code} value={currency.code}>
            <div className="flex items-center space-x-2">
              <span className="text-lg">{currency.flag}</span>
              <span className="font-medium">{currency.symbol} {currency.code}</span>
              <span className="text-muted-foreground">{currency.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};