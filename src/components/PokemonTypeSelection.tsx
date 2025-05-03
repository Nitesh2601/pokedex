// src/components/PokemonTypeSelection.tsx
'use client';

import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from '@mui/material';

interface PokemonTypeSelectionProps {
  selectedType: string | undefined;
  selectType: (type: string | undefined) => void;
  types: string[];
}

const PokemonTypeSelection: React.FC<PokemonTypeSelectionProps> = ({ 
  selectedType, 
  selectType,
  types 
}) => {
  const handleChange = (event: SelectChangeEvent<string>) => {
    const value = event.target.value;
    selectType(value === 'all' ? undefined : value);
  };

  return (
    <FormControl fullWidth sx={{ mb: 3 }}>
      <InputLabel id="type-select-label">Filter by Type</InputLabel>
      <Select
        labelId="type-select-label"
        value={selectedType || 'all'}
        label="Filter by Type"
        onChange={handleChange}
      >
        <MenuItem value="all">All Types</MenuItem>
        {types.map((type) => (
          <MenuItem key={type} value={type}>
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default PokemonTypeSelection;