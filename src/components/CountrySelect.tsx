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
import { useCountry } from "@/hooks/useCountry";

interface CountrySelectProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function CountrySelect({
  value = "KE",
  onChange,
  placeholder = "Select country...",
}: CountrySelectProps) {
  const [open, setOpen] = useState(false);
  const { countries, fetchCountries, updateSearch } = useCountry({ limit: 50 });

  useEffect(() => {
    if (!value) {
      onChange("KE");
    }
  }, []);

  useEffect(() => {
    fetchCountries();
  }, [fetchCountries]);

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
            ? countries.find((country) => country.code === value)?.name
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Search countries..."
            onValueChange={updateSearch}
          />
          <CommandEmpty>No country found.</CommandEmpty>
          <CommandGroup>
            {countries.map((country) => (
              <CommandItem
                key={country.id}
                value={country.code}
                onSelect={() => {
                  onChange(country.code);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.code ? "opacity-100" : "opacity-0"
                  )}
                />
                {country.name} ({country.code})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
