// src/components/PokedexTable.tsx
'use client';

import { Box, Typography } from '@mui/material';
import PokemonRow from './PokemonRow';

interface Pokemon {
  id: number;
  name: string;
  types: string[];
  sprite: string;
}

interface PokedexTableProps {
  pokemons: Pokemon[];
}

const PokedexTable: React.FC<PokedexTableProps> = ({ pokemons }) => {
  if (!pokemons || pokemons.length === 0) {
    return <Typography>No Pokémon found.</Typography>;
  }

  return (
    <Box>
      {pokemons.map((pokemon) => (
        <PokemonRow key={pokemon.id} pokemon={pokemon} />
      ))}
    </Box>
  );
};

export default PokedexTable;