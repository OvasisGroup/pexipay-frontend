import Select from "react-select";
import { useEffect, useCallback, useRef, useState } from "react";
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
  const { countries, fetchCountries, updateSearch } = useCountry({
    limit: 50,
  });

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // Add state for inputValue
  const [inputValue, setInputValue] = useState("");

  // Debounced search handler
  const handleInputChange = useCallback(
    (inputValue: string) => {
      setInputValue(inputValue);
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        updateSearch(inputValue);
        fetchCountries();
      }, 300);
      return inputValue;
    },
    [updateSearch, fetchCountries]
  );

  useEffect(() => {
    if (!value) {
      onChange("KE");
    }
  }, []);

  useEffect(() => {
    fetchCountries(); // Fetch all on mount
  }, [fetchCountries]);

  const options = countries.map((country) => ({
    value: country.id,
    label: `${country.name} (${country.code})`,
  }));

  const selectedOption =
    options.find((option) => option.value === value) || null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(option) => {
        onChange(option ? option.value : "");
        setInputValue(""); // Clear input after selection
      }}
      placeholder={placeholder}
      isSearchable
      inputValue={inputValue}
      onInputChange={handleInputChange}
      classNamePrefix="react-select"
      styles={{ container: (base) => ({ ...base, width: "100%" }) }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
        }
      }}
    />
  );
}
