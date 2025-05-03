'use client';

import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Chip,
  Stack,
  Alert,
  CircularProgress,
  Paper
} from '@mui/material';
import PokedexTable from '@/components/PokedexTable';
import { trpc } from '@/utils/trpc';

export default function MultiplePokemonPage() {
  const [inputName, setInputName] = useState('');
  const [pokemonNames, setPokemonNames] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  
  const pokemonQuery = trpc.pokemon.getMultiple.useQuery(
    { names: pokemonNames },
    { 
      enabled: submitted && pokemonNames.length > 0,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      retry: 1,
      staleTime: 300000 // 5 minutes cache like in the single page
    }
  );

  // Reset submitted state when pokemon names array changes
  useEffect(() => {
    if (submitted && pokemonNames.length === 0) {
      setSubmitted(false);
    }
  }, [pokemonNames, submitted]);

  const handleAddPokemon = () => {
    if (!inputName.trim()) return;
    
    // Check if a similar name already exists (case-insensitive)
    const normalizedInput = inputName.trim().toLowerCase();
    const exists = pokemonNames.some(name => name.toLowerCase() === normalizedInput);
    
    if (!exists) {
      setPokemonNames(prevNames => [...prevNames, inputName.trim()]);
      setInputName('');
    } else {
      // Clear input when duplicate is found
      setInputName('');
    }
  };

  const handleRemovePokemon = (nameToRemove: string) => {
    setPokemonNames(prevNames => prevNames.filter(name => name !== nameToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add current input if not empty before submitting
    if (inputName.trim()) {
      const normalizedInput = inputName.trim().toLowerCase();
      const exists = pokemonNames.some(name => name.toLowerCase() === normalizedInput);
      
      if (!exists) {
        setPokemonNames(prevNames => [...prevNames, inputName.trim()]);
      }
      setInputName('');
    }
    
    // Only trigger search if we have Pokemon names
    if (pokemonNames.length > 0 || inputName.trim()) {
      setSubmitted(true);
    }
  };

  const handleReset = () => {
    setPokemonNames([]);
    setInputName('');
    setSubmitted(false);
  };

  // Example pokemon list for testing
  const addExamplePokemon = () => {
    setPokemonNames(['Pikachu', 'Charmander', 'Bulbasaur']);
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Multiple Pokémon Lookup
      </Typography>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <Box sx={{ display: 'flex', gap: '1rem', mb: 2 }}>
          <TextField
            label="Enter Pokémon Name"
            variant="outlined"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            fullWidth
            helperText="Enter names like 'charmander' or 'Pikachu'"
          />
          <Button
            type="button"
            variant="outlined"
            onClick={handleAddPokemon}
            disabled={!inputName.trim()}
          >
            Add
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={(pokemonNames.length === 0 && !inputName.trim()) || pokemonQuery.isFetching}
          >
            {pokemonQuery.isFetching ? (
              <>
                <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                Searching...
              </>
            ) : 'Search All'}
          </Button>
        </Box>
        
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          {pokemonNames.map((name) => (
            <Chip
              key={name}
              label={name}
              onDelete={() => handleRemovePokemon(name)}
              sx={{ mb: 1 }}
            />
          ))}
        </Stack>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
          {pokemonNames.length === 0 && (
            <Button 
              variant="outlined" 
              color="secondary" 
              onClick={addExamplePokemon}
            >
              Add Example Pokémon
            </Button>
          )}
          
          {submitted && pokemonNames.length > 0 && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleReset}
            >
              Reset
            </Button>
          )}
        </Box>
      </form>

      {/* Display loading state */}
      {pokemonQuery.isFetching && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      
      {/* Error state */}
      {pokemonQuery.isError && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#ffebee' }}>
          <Typography color="error">
            Error: {pokemonQuery.error?.message || "Unknown error"}
          </Typography>
        </Paper>
      )}
      
      {/* Results - show when we have data */}
      {!pokemonQuery.isLoading && pokemonQuery.data && pokemonQuery.data.length > 0 && (
        <PokedexTable pokemons={pokemonQuery.data} />
      )}
      
      {/* No results found state */}
      {!pokemonQuery.isLoading && submitted && pokemonQuery.data && pokemonQuery.data.length === 0 && (
        <Paper sx={{ p: 2, mb: 2, bgcolor: '#fff9c4' }}>
          <Typography color="warning.dark">
            No Pokémon found with the specified names. Try checking your spelling or search for a different Pokémon.
          </Typography>
        </Paper>
      )}
    </Container>
  );
}