// src/server/trpc/router/pokemon.ts
import { type Pokemon } from '@prisma/client'; // at the top

import { z } from 'zod';
import { router, publicProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const pokemonRouter = router({
  getByName: publicProcedure
  .input(z.object({ name: z.string() }))
  .query(async ({ ctx, input }) => {
    // Trim and lowercase the name to avoid case sensitivity issues
    const normalizedName = input.name.trim().toLowerCase();
    
    console.log("Searching for Pokemon:", normalizedName);
    console.log("Database connection status:", !!ctx.prisma);
    
    try {
      // DEBUG: Print all Pokemon in the database
      console.log("DEBUG: Checking all Pokemon in database");
      const allPokemon = await ctx.prisma.pokemon.findMany();
      console.log("Pokemon in database:", allPokemon.map((p: { name: string }) => p.name));

      
      // First try exact match with lowercase
      let found = await ctx.prisma.pokemon.findFirst({
        where: { 
          name: normalizedName
        },
      });
      
      // If exact match fails, try case-insensitive search
      if (!found) {
        console.log("No exact match, trying case-insensitive search");
        found = await ctx.prisma.pokemon.findFirst({
          where: { 
            name: { 
              equals: normalizedName,
              mode: 'insensitive'
            } 
          },
        });
      }
      
      // If that still fails, try to find by similar name
      if (!found) {
        console.log("No matching Pokemon found, trying to find by prefix");
        found = await ctx.prisma.pokemon.findFirst({
          where: { 
            name: { 
              startsWith: normalizedName.substring(0, 3),
              mode: 'insensitive'
            } 
          },
        });
      }
      
      console.log("Database query result:", found);
      
      if (!found) {
        console.log("No pokemon found in database");
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `Pokemon '${input.name}' not found in our database`,
        });
      }
      
      // Return the data directly - types is already an array in the database
      const result = {
        id: found.id,
        name: found.name,
        types: found.types, // No need to split, it's already an array
        sprite: found.sprite,
      };
      
      console.log("Returning data:", result);
      return result;
    } catch (error) {
      console.error("Error in getByName procedure:", error);
      if (error instanceof TRPCError) {
        throw error;
      }
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: `Failed to fetch Pokemon: ${(error as Error).message}`,
        cause: error,
      });
    }
  }),

  getMultiple: publicProcedure
    .input(z.object({ names: z.array(z.string()) }))
    .query(async ({ ctx, input }) => {
      console.log("Searching for multiple Pokemon with names:", input.names);
      
      // Handle empty inputs
      if (input.names.length === 0) {
        console.log("Empty names array, returning empty result");
        return [];
      }
      
      try {
        const results = [];
        
        // Process each name individually, similar to how getByName works
        for (const name of input.names) {
          const normalizedName = name.trim().toLowerCase();
          
          if (!normalizedName) continue; // Skip empty names
          
          // Try exact match
          let found = await ctx.prisma.pokemon.findFirst({
            where: { 
              name: normalizedName
            },
          });
          
          // Try case-insensitive match
          if (!found) {
            found = await ctx.prisma.pokemon.findFirst({
              where: { 
                name: { 
                  equals: normalizedName,
                  mode: 'insensitive'
                } 
              },
            });
          }
          
          // Try prefix match with first 3 characters
          if (!found && normalizedName.length >= 3) {
            found = await ctx.prisma.pokemon.findFirst({
              where: { 
                name: { 
                  startsWith: normalizedName.substring(0, 3),
                  mode: 'insensitive'
                } 
              },
            });
          }
          
          // Add found Pokemon to results
          if (found) {
            results.push({
              id: found.id,
              name: found.name,
              types: found.types,
              sprite: found.sprite
            });
          }
        }
        
        console.log(`Found ${results.length} Pokemon out of ${input.names.length} requested`);
        return results;
      } catch (error) {
        console.error("Error in getMultiple procedure:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch multiple Pokemon: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),





  getByType: publicProcedure
    .input(z.object({ type: z.string().optional() }))
    .query(async ({ ctx, input }) => {
      console.log("Filtering by type:", input.type);
      
      try {
        // If no type is provided, return all pokemon
        if (!input.type) {
          const allPokemon = await ctx.prisma.pokemon.findMany();
          console.log("Returning all Pokemon count:", allPokemon.length);
          
          return allPokemon.map((pokemon: Pokemon) => ({
            id: pokemon.id,
            name: pokemon.name,
            types: pokemon.types,
            sprite: pokemon.sprite,
          }));
        }
        
        const normalizedType = input.type.trim().toLowerCase();
        
        // For array fields in Prisma, we need to use the 'has' operator
        const pokemonWithType = await ctx.prisma.pokemon.findMany({
          where: {
            types: {
              has: normalizedType,
            },
          },
        });
        
        console.log("Filtered Pokemon by type count:", pokemonWithType.length);
        
        return pokemonWithType.map((pokemon: Pokemon) => ({
          id: pokemon.id,
          name: pokemon.name,
          types: pokemon.types, // Already an array
          sprite: pokemon.sprite,
        }));
      } catch (error) {
        console.error("Error in getByType procedure:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch Pokemon by type: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),

  getAllTypes: publicProcedure
    .query(async ({ ctx }) => {
      try {
        // Using Prisma's distinct on array elements
        const pokemons = await ctx.prisma.pokemon.findMany({
          select: { types: true },
        });
        
        // Extract all unique types from the pokemons
        const allTypes = new Set<string>();
        pokemons.forEach((pokemon: { types: string[] }) => {
          pokemon.types.forEach((type: string) => {
            allTypes.add(type);
          });
        });
        
        const types = Array.from(allTypes).sort();
        console.log("All Pokemon types count:", types.length);
        
        return types;
      } catch (error) {
        console.error("Error in getAllTypes procedure:", error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Failed to fetch Pokemon types: ${(error as Error).message}`,
          cause: error,
        });
      }
    }),
});