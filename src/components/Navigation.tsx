// src/components/Navigation.tsx
'use client';

import { AppBar, Toolbar, Button, Box } from '@mui/material';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Navigation: React.FC = () => {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
          <Button 
            component={Link}
            href="/"
            color="inherit" 
            variant={isActive('/') ? 'outlined' : 'text'}
          >
            Single Pokémon
          </Button>
          
          <Button 
            component={Link}
            href="/multiple"
            color="inherit" 
            variant={isActive('/multiple') ? 'outlined' : 'text'}
          >
            Multiple Pokémon
          </Button>
          
          <Button 
            component={Link}
            href="/filterable"
            color="inherit" 
            variant={isActive('/filterable') ? 'outlined' : 'text'}
          >
            Filterable Pokédex
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;