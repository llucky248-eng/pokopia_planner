import { CatalogItem } from "@/types";

export const CATALOG_ITEMS: CatalogItem[] = [
  // ---------- Buildings (real Pokopia building kits) ----------
  { id: "den", name: "Den", category: "buildings", emoji: "🛖", color: "bg-amber-200" },
  { id: "hut", name: "Hut", category: "buildings", emoji: "🏚️", color: "bg-orange-200" },
  { id: "cottage", name: "Cottage", category: "buildings", emoji: "🏡", color: "bg-yellow-200" },
  { id: "house", name: "House", category: "buildings", emoji: "🏠", color: "bg-green-200" },
  { id: "gray-hut", name: "Gray Hut", category: "buildings", emoji: "🏚️", color: "bg-gray-300" },
  { id: "orange-hut", name: "Orange Hut", category: "buildings", emoji: "🏠", color: "bg-orange-300" },
  { id: "pink-hut", name: "Pink Hut", category: "buildings", emoji: "🏠", color: "bg-pink-300" },
  { id: "yellow-hut", name: "Yellow Hut", category: "buildings", emoji: "🏠", color: "bg-yellow-300" },
  { id: "pokecenter", name: "Pokemon Center", category: "buildings", emoji: "🏥", color: "bg-red-300" },
  { id: "wind-generator", name: "Wind Generator", category: "buildings", emoji: "🌬️", color: "bg-sky-200" },
  { id: "water-generator", name: "Water Generator", category: "buildings", emoji: "💧", color: "bg-blue-300" },
  { id: "fire-generator", name: "Fire Generator", category: "buildings", emoji: "🔥", color: "bg-red-400" },

  // ---------- Blocks (walls, floors, roof materials) ----------
  { id: "wood-plank", name: "Wood Plank", category: "blocks", emoji: "🟫", color: "bg-amber-300" },
  { id: "stone-brick", name: "Stone Brick", category: "blocks", emoji: "🧱", color: "bg-stone-300" },
  { id: "brick-block", name: "Brick Block", category: "blocks", emoji: "🧱", color: "bg-red-300" },
  { id: "glass-pane", name: "Glass Pane", category: "blocks", emoji: "🪟", color: "bg-sky-100" },
  { id: "concrete-block", name: "Concrete", category: "blocks", emoji: "⬜", color: "bg-slate-200" },
  { id: "iron-block", name: "Iron Block", category: "blocks", emoji: "⬛", color: "bg-gray-400" },
  { id: "copper-block", name: "Copper Block", category: "blocks", emoji: "🟧", color: "bg-orange-300" },
  { id: "gold-block", name: "Gold Block", category: "blocks", emoji: "🟨", color: "bg-yellow-400" },
  { id: "cloud-block", name: "Cloud Block", category: "blocks", emoji: "☁️", color: "bg-slate-100" },
  { id: "crystal-block", name: "Crystal Block", category: "blocks", emoji: "💎", color: "bg-cyan-300" },

  // ---------- Roads & Paths ----------
  { id: "cobblestone-road", name: "Cobblestone", category: "roads", emoji: "🪨", color: "bg-stone-400" },
  { id: "wooden-boardwalk", name: "Wooden Boardwalk", category: "roads", emoji: "🪵", color: "bg-amber-300" },
  { id: "brick-road", name: "Brick Road", category: "roads", emoji: "🧱", color: "bg-red-300" },
  { id: "sand-path", name: "Sand Path", category: "roads", emoji: "🟨", color: "bg-yellow-200" },
  { id: "asphalt-road", name: "Asphalt Road", category: "roads", emoji: "⬛", color: "bg-gray-500" },
  { id: "mosaic-path", name: "Mosaic Path", category: "roads", emoji: "🔶", color: "bg-purple-200" },
  { id: "wooden-path", name: "Wooden Path", category: "roads", emoji: "🟫", color: "bg-amber-200" },
  { id: "stylish-steps", name: "Stylish Steps", category: "roads", emoji: "🪜", color: "bg-stone-300" },

  // ---------- Nature (terrain & plants) ----------
  { id: "grass-patch", name: "Grass Patch", category: "nature", emoji: "🟩", color: "bg-green-300" },
  { id: "flower-bed", name: "Flower Bed", category: "nature", emoji: "🌸", color: "bg-pink-200" },
  { id: "tree-sapling", name: "Tree Sapling", category: "nature", emoji: "🌳", color: "bg-green-500" },
  { id: "berry-bush", name: "Berry Bush", category: "nature", emoji: "🫐", color: "bg-purple-300" },
  { id: "mushroom-patch", name: "Mushroom Patch", category: "nature", emoji: "🍄", color: "bg-red-200" },
  { id: "vine-wall", name: "Vine Wall", category: "nature", emoji: "🌿", color: "bg-emerald-300" },
  { id: "pond", name: "Pond", category: "nature", emoji: "💧", color: "bg-blue-300" },
  { id: "waterfall", name: "Waterfall", category: "nature", emoji: "🌊", color: "bg-blue-400" },

  // ---------- Outdoor (utility items & decor) ----------
  { id: "campfire", name: "Campfire", category: "outdoor", emoji: "🔥", color: "bg-orange-300" },
  { id: "smelting-furnace", name: "Smelting Furnace", category: "outdoor", emoji: "🏭", color: "bg-stone-400" },
  { id: "workbench", name: "Workbench", category: "outdoor", emoji: "🔨", color: "bg-amber-300" },
  { id: "fence", name: "Fence", category: "outdoor", emoji: "🚧", color: "bg-stone-300" },
  { id: "lamp-post", name: "Lamp Post", category: "outdoor", emoji: "🏮", color: "bg-yellow-200" },
  { id: "sign-post", name: "Sign Post", category: "outdoor", emoji: "🪧", color: "bg-emerald-100" },
  { id: "bridge", name: "Bridge", category: "outdoor", emoji: "🌉", color: "bg-stone-200" },
  { id: "gravestone", name: "Gravestone", category: "outdoor", emoji: "🪦", color: "bg-gray-400" },

  // ---------- Habitats (real Pokopia habitat types) ----------
  { id: "forest-grove", name: "Forest Grove", category: "habitats", emoji: "🌲", color: "bg-green-400" },
  { id: "flower-meadow", name: "Flower Meadow", category: "habitats", emoji: "🌻", color: "bg-lime-200" },
  { id: "tall-grass", name: "Tall Grass", category: "habitats", emoji: "🌿", color: "bg-lime-300" },
  { id: "campfire-habitat", name: "Campfire Habitat", category: "habitats", emoji: "🔥", color: "bg-red-300" },
  { id: "pond-habitat", name: "Pond Habitat", category: "habitats", emoji: "🐟", color: "bg-blue-300" },
  { id: "cave-habitat", name: "Cave", category: "habitats", emoji: "🕳️", color: "bg-gray-400" },
  { id: "electric-field", name: "Electric Field", category: "habitats", emoji: "⚡", color: "bg-yellow-400" },
  { id: "fairy-garden", name: "Fairy Garden", category: "habitats", emoji: "🧚", color: "bg-pink-300" },
  { id: "spooky-hollow", name: "Spooky Hollow", category: "habitats", emoji: "👻", color: "bg-purple-300" },
  { id: "rocky-den", name: "Rocky Den", category: "habitats", emoji: "⛰️", color: "bg-stone-400" },
];

export function getItemById(id: string): CatalogItem | undefined {
  return CATALOG_ITEMS.find((item) => item.id === id);
}

export function getItemsByCategory(category: CatalogItem["category"]): CatalogItem[] {
  return CATALOG_ITEMS.filter((item) => item.category === category);
}
