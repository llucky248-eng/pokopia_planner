import { CatalogItem } from "@/types";

export const CATALOG_ITEMS: CatalogItem[] = [
  // Buildings
  { id: "pokecenter", name: "Poke Center", category: "buildings", emoji: "🏥", color: "bg-red-200" },
  { id: "pokemart", name: "Poke Mart", category: "buildings", emoji: "🏪", color: "bg-blue-200" },
  { id: "berry-farm", name: "Berry Farm", category: "buildings", emoji: "🌾", color: "bg-green-200" },
  { id: "daycare", name: "Daycare", category: "buildings", emoji: "🏠", color: "bg-yellow-200" },
  { id: "gym", name: "Gym", category: "buildings", emoji: "🏟️", color: "bg-orange-200" },
  { id: "contest-hall", name: "Contest Hall", category: "buildings", emoji: "🎪", color: "bg-purple-200" },
  { id: "observatory", name: "Observatory", category: "buildings", emoji: "🔭", color: "bg-indigo-200" },
  { id: "lighthouse", name: "Lighthouse", category: "buildings", emoji: "🗼", color: "bg-amber-200" },
  { id: "workshop", name: "Workshop", category: "buildings", emoji: "🔨", color: "bg-stone-200" },

  // Decorations
  { id: "fountain", name: "Fountain", category: "decorations", emoji: "⛲", color: "bg-cyan-200" },
  { id: "lamp-post", name: "Lamp Post", category: "decorations", emoji: "🏮", color: "bg-yellow-100" },
  { id: "flower-bed", name: "Flower Bed", category: "decorations", emoji: "🌸", color: "bg-pink-200" },
  { id: "bench", name: "Bench", category: "decorations", emoji: "🪑", color: "bg-amber-100" },
  { id: "statue", name: "Statue", category: "decorations", emoji: "🗿", color: "bg-gray-200" },
  { id: "mailbox", name: "Mailbox", category: "decorations", emoji: "📮", color: "bg-red-100" },
  { id: "sign-post", name: "Sign Post", category: "decorations", emoji: "🪧", color: "bg-emerald-100" },
  { id: "wind-chime", name: "Wind Chime", category: "decorations", emoji: "🎐", color: "bg-sky-100" },
  { id: "swing", name: "Swing", category: "decorations", emoji: "🎠", color: "bg-rose-100" },

  // Terrain
  { id: "grass", name: "Grass", category: "terrain", emoji: "🟩", color: "bg-green-300" },
  { id: "water", name: "Water", category: "terrain", emoji: "🟦", color: "bg-blue-300" },
  { id: "sand", name: "Sand", category: "terrain", emoji: "🟨", color: "bg-yellow-300" },
  { id: "stone-path", name: "Stone Path", category: "terrain", emoji: "🪨", color: "bg-stone-300" },
  { id: "cloud-puff", name: "Cloud Puff", category: "terrain", emoji: "☁️", color: "bg-slate-100" },
  { id: "rainbow-bridge", name: "Rainbow Bridge", category: "terrain", emoji: "🌈", color: "bg-violet-200" },
  { id: "flower-field", name: "Flower Field", category: "terrain", emoji: "🌻", color: "bg-lime-200" },

  // Habitats
  { id: "fire-den", name: "Fire Den", category: "habitats", emoji: "🔥", color: "bg-red-300" },
  { id: "water-pool", name: "Water Pool", category: "habitats", emoji: "💧", color: "bg-blue-400" },
  { id: "grass-nest", name: "Grass Nest", category: "habitats", emoji: "🌿", color: "bg-green-400" },
  { id: "electric-field", name: "Electric Field", category: "habitats", emoji: "⚡", color: "bg-yellow-400" },
  { id: "fairy-garden", name: "Fairy Garden", category: "habitats", emoji: "🧚", color: "bg-pink-300" },
  { id: "dragon-cave", name: "Dragon Cave", category: "habitats", emoji: "🐉", color: "bg-purple-300" },
  { id: "ice-cave", name: "Ice Cave", category: "habitats", emoji: "🧊", color: "bg-cyan-300" },
  { id: "flying-perch", name: "Flying Perch", category: "habitats", emoji: "🪶", color: "bg-sky-200" },
];

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG_ITEMS.find((item) => item.id === id);
}

export function getItemsByCategory(category: CatalogItem["category"]): CatalogItem[] {
  return CATALOG_ITEMS.filter((item) => item.category === category);
}
