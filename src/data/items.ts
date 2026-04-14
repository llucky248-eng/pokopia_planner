import { CatalogItem } from "@/types";

export const CATALOG_ITEMS: CatalogItem[] = [
  // Buildings — based on actual Pokopia building kits
  { id: "den", name: "Den", category: "buildings", emoji: "🛖", color: "bg-amber-200" },
  { id: "hut", name: "Hut", category: "buildings", emoji: "🏚️", color: "bg-orange-200" },
  { id: "cottage", name: "Cottage", category: "buildings", emoji: "🏡", color: "bg-yellow-200" },
  { id: "house", name: "House", category: "buildings", emoji: "🏠", color: "bg-green-200" },
  { id: "pokecenter", name: "Pokemon Center", category: "buildings", emoji: "🏥", color: "bg-red-200" },
  { id: "wind-generator", name: "Wind Generator", category: "buildings", emoji: "🌬️", color: "bg-sky-200" },
  { id: "water-generator", name: "Water Generator", category: "buildings", emoji: "💧", color: "bg-blue-200" },
  { id: "fire-generator", name: "Fire Generator", category: "buildings", emoji: "🔥", color: "bg-red-300" },
  { id: "workbench", name: "Workbench", category: "buildings", emoji: "🔨", color: "bg-stone-200" },

  // Decorations
  { id: "fountain", name: "Fountain", category: "decorations", emoji: "⛲", color: "bg-cyan-200" },
  { id: "lamp-post", name: "Lamp Post", category: "decorations", emoji: "🏮", color: "bg-yellow-100" },
  { id: "flower-bed", name: "Flower Bed", category: "decorations", emoji: "🌸", color: "bg-pink-200" },
  { id: "bench", name: "Bench", category: "decorations", emoji: "🪑", color: "bg-amber-100" },
  { id: "fence", name: "Fence", category: "decorations", emoji: "🚧", color: "bg-stone-300" },
  { id: "sign-post", name: "Sign Post", category: "decorations", emoji: "🪧", color: "bg-emerald-100" },
  { id: "wind-chime", name: "Wind Chime", category: "decorations", emoji: "🎐", color: "bg-sky-100" },
  { id: "bridge", name: "Bridge", category: "decorations", emoji: "🌉", color: "bg-stone-200" },
  { id: "statue", name: "Statue", category: "decorations", emoji: "🗿", color: "bg-gray-200" },

  // Terrain — based on Pokopia biomes
  { id: "grass", name: "Grass", category: "terrain", emoji: "🟩", color: "bg-green-300" },
  { id: "water", name: "Water", category: "terrain", emoji: "🟦", color: "bg-blue-300" },
  { id: "sand", name: "Sand (Beach)", category: "terrain", emoji: "🟨", color: "bg-yellow-300" },
  { id: "stone-path", name: "Stone Path", category: "terrain", emoji: "🪨", color: "bg-stone-300" },
  { id: "cloud-puff", name: "Cloud (Skylands)", category: "terrain", emoji: "☁️", color: "bg-slate-100" },
  { id: "wasteland", name: "Wasteland", category: "terrain", emoji: "🏜️", color: "bg-amber-300" },
  { id: "rocky-ridge", name: "Rocky Ridge", category: "terrain", emoji: "⛰️", color: "bg-gray-300" },

  // Habitats — based on actual Pokopia habitat types
  { id: "forest-grove", name: "Forest Grove", category: "habitats", emoji: "🌲", color: "bg-green-400" },
  { id: "flower-meadow", name: "Flower Meadow", category: "habitats", emoji: "🌻", color: "bg-lime-200" },
  { id: "tall-grass", name: "Tall Grass", category: "habitats", emoji: "🌿", color: "bg-green-300" },
  { id: "campfire-habitat", name: "Campfire", category: "habitats", emoji: "🔥", color: "bg-red-300" },
  { id: "pond-habitat", name: "Pond", category: "habitats", emoji: "🐟", color: "bg-blue-300" },
  { id: "cave-habitat", name: "Cave", category: "habitats", emoji: "🕳️", color: "bg-gray-400" },
  { id: "electric-field", name: "Electric Field", category: "habitats", emoji: "⚡", color: "bg-yellow-400" },
  { id: "fairy-garden", name: "Fairy Garden", category: "habitats", emoji: "🧚", color: "bg-pink-300" },
  { id: "spooky-hollow", name: "Spooky Hollow", category: "habitats", emoji: "👻", color: "bg-purple-300" },
];

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG_ITEMS.find((item) => item.id === id);
}

export function getItemsByCategory(category: CatalogItem["category"]): CatalogItem[] {
  return CATALOG_ITEMS.filter((item) => item.category === category);
}
