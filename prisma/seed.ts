import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.pokemon.createMany({
    data: [
      {
        name: 'Bulbasaur',
        types: ['grass', 'poison'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      },
      {
        name: 'Charmander',
        types: ['fire'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/4.png',
      },
      {
        name: 'Squirtle',
        types: ['water'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/7.png',
      },
      {
        name: 'Pikachu',
        types: ['electric'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png',
      },
      {
        name: 'Jigglypuff',
        types: ['normal', 'fairy'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/39.png',
      },
      {
        name: 'Meowth',
        types: ['normal'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/52.png',
      },
      {
        name: 'Psyduck',
        types: ['water'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/54.png',
      },
      {
        name: 'Machop',
        types: ['fighting'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/66.png',
      },
      {
        name: 'Geodude',
        types: ['rock', 'ground'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/74.png',
      },
      {
        name: 'Gengar',
        types: ['ghost', 'poison'], // Array of types
        sprite: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/94.png',
      },
    ],
    skipDuplicates: true, // Prevents error if some Pokémon already exist
  });

  console.log('Seeded more Pokémon!');
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
