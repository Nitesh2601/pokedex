'use client';

import { useState } from 'react';
import { TextField, Button, Container, Typography, Paper } from '@mui/material';
import PokemonRow from '@/components/PokemonRow';
import { trpc } from '@/utils/trpc';

export default function PokedexPage() {
  const [name, setName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Only run the query when submitted and with the fixed searchTerm
  const pokemonQuery = trpc.pokemon.getByName.useQuery(
    { name: searchTerm },
    {
      enabled: submitted && searchTerm.length > 0,
      // Add retry to handle potential network issues
      retry: 1,
      // Add a longer staleTime to prevent unnecessary refetches
      staleTime: 300000, // 5 minutes
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm(name.trim()); // Save the trimmed search term
    setSubmitted(true);
  };

  const handleReset = () => {
    setName('');
    setSearchTerm('');
    setSubmitted(false);
  };

  const hasValidData =
    pokemonQuery.data &&
    typeof pokemonQuery.data === 'object' &&
    'id' in pokemonQuery.data &&
    'name' in pokemonQuery.data &&
    'types' in pokemonQuery.data &&
    'sprite' in pokemonQuery.data;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Pokédex Lookup
      </Typography>

      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <TextField
          label="Enter Pokémon Name"
          variant="outlined"
          value={name}
          onChange={(e) => setName(e.target.value)}
          helperText="Enter name like 'charmander' or 'Pikachu'"
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!name.trim() || pokemonQuery.isFetching}
        >
          Search
        </Button>
        {submitted && (
          <Button variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        )}
      </form>

      {pokemonQuery.isLoading && <Typography>Loading...</Typography>}

      {pokemonQuery.isError && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
          <Typography color="error">
            Error: {pokemonQuery.error?.message || 'Unknown error'}
          </Typography>
        </Paper>
      )}

      {pokemonQuery.isSuccess && !hasValidData && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff9c4' }}>
          <Typography color="warning.dark">No Pokémon found with name "{searchTerm}"</Typography>
        </Paper>
      )}

      {hasValidData && <PokemonRow pokemon={pokemonQuery.data} />}
    </Container>
  );
}