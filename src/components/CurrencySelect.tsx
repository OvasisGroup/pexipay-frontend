import Select from "react-select";
import { useEffect } from "react";
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
  const { currencies, fetchCurrencies } = useCurrency({ limit: 50 });

  useEffect(() => {
    fetchCurrencies();
  }, [fetchCurrencies]);

  const options = currencies.map((currency) => ({
    value: currency.code,
    label: `${currency.name} (${currency.code})`,
  }));

  const selectedOption =
    options.find((option) => option.value === value) || null;

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(option) => onChange(option ? option.value : "")}
      placeholder={placeholder}
      isSearchable
      classNamePrefix="react-select"
      styles={{ container: (base) => ({ ...base, width: "100%" }) }}
    />
  );
}
