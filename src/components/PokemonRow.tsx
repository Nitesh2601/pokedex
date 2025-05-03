//PokemonRow.tsx

import { Card, CardContent, Typography, Box, Avatar } from '@mui/material';

interface PokemonProps {
  pokemon: {
    id: number;
    name: string;
    types: string[];
    sprite: string;
  };
}

const PokemonRow: React.FC<PokemonProps> = ({ pokemon }) => {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar src={pokemon.sprite} alt={pokemon.name} sx={{ width: 56, height: 56 }} />
        <Box>
          <Typography variant="h6">#{pokemon.id} {pokemon.name}</Typography>
          <Typography variant="body2">Types: {pokemon.types.join(', ')}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PokemonRow;
