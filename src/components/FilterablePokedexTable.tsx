// src/components/FilterablePokedexTable.tsx
'use client';

import { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import PokemonTypeSelection from './PokemonTypeSelection';
import PokedexTable from './PokedexTable';
import { trpc } from '@/utils/trpc';

const FilterablePokedexTable: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string | undefined>(undefined);
  
  const typesQuery = trpc.pokemon.getAllTypes.useQuery();
  const pokemonQuery = trpc.pokemon.getByType.useQuery({ type: selectedType });

  if (typesQuery.isLoading || pokemonQuery.isLoading) {
    return <CircularProgress />;
  }

  if (typesQuery.isError) {
    return <Typography color="error">Error loading Pokémon types.</Typography>;
  }

  if (pokemonQuery.isError) {
    return <Typography color="error">Error loading Pokémon data.</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Filterable Pokédex
      </Typography>
      
      <PokemonTypeSelection 
        selectedType={selectedType} 
        selectType={setSelectedType} 
        types={typesQuery.data || []}
      />
      
      <PokedexTable pokemons={pokemonQuery.data || []} />
    </Box>
  );
};

export default FilterablePokedexTable;