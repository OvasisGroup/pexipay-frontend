import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState, useEffect } from "react";
import { useCurrency } from "@/hooks/useCurrency";

interface CurrencySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CurrencySelect({
  value,
  onChange,
  placeholder = "Select currency...",
}: CurrencySelectProps) {
  const [open, setOpen] = useState(false);
  const { currencies, fetchCurrencies, updateSearch } = useCurrency({
    limit: 50,
  });

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? currencies.find((currency) => currency.code === value)?.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search currencies..."
            onValueChange={updateSearch}
          />
          <CommandEmpty>No currency found.</CommandEmpty>
          <CommandGroup>
            {currencies.map((currency) => (
              <CommandItem
                key={currency.id}
                value={currency.code}
                onSelect={() => {
                  onChange(currency.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === currency.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {currency.name} ({currency.code})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
