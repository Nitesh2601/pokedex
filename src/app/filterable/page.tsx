// src/app/filterable/page.tsx
'use client';

import { Container } from '@mui/material';
import FilterablePokedexTable from '@/components/FilterablePokedexTable';

export default function FilterablePokemonPage() {
  return (
    <Container sx={{ mt: 4 }}>
      <FilterablePokedexTable />
    </Container>
  );
}