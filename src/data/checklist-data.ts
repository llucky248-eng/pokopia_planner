import { ChecklistEntry } from "@/types";

export const DEFAULT_CHECKLIST: ChecklistEntry[] = [
  // Buildings to Unlock
  { id: "b1", label: "Build a Poke Center", category: "Buildings to Unlock", checked: false },
  { id: "b2", label: "Build a Poke Mart", category: "Buildings to Unlock", checked: false },
  { id: "b3", label: "Build a Berry Farm", category: "Buildings to Unlock", checked: false },
  { id: "b4", label: "Build a Daycare", category: "Buildings to Unlock", checked: false },
  { id: "b5", label: "Build a Gym", category: "Buildings to Unlock", checked: false },
  { id: "b6", label: "Build a Contest Hall", category: "Buildings to Unlock", checked: false },
  { id: "b7", label: "Build an Observatory", category: "Buildings to Unlock", checked: false },
  { id: "b8", label: "Build a Lighthouse", category: "Buildings to Unlock", checked: false },
  { id: "b9", label: "Build a Workshop", category: "Buildings to Unlock", checked: false },

  // Resources to Gather
  { id: "r1", label: "Collect 50 Cloud Essence", category: "Resources to Gather", checked: false },
  { id: "r2", label: "Collect 30 Stardust", category: "Resources to Gather", checked: false },
  { id: "r3", label: "Collect 100 Berries", category: "Resources to Gather", checked: false },
  { id: "r4", label: "Collect 20 Rainbow Shards", category: "Resources to Gather", checked: false },
  { id: "r5", label: "Collect 40 Sky Stones", category: "Resources to Gather", checked: false },
  { id: "r6", label: "Collect 10 Thunder Crystals", category: "Resources to Gather", checked: false },
  { id: "r7", label: "Collect 25 Dew Drops", category: "Resources to Gather", checked: false },

  // Island Goals
  { id: "g1", label: "Place 10 decorations", category: "Island Goals", checked: false },
  { id: "g2", label: "Build all habitat types", category: "Island Goals", checked: false },
  { id: "g3", label: "Create a path connecting all buildings", category: "Island Goals", checked: false },
  { id: "g4", label: "Reach Island Level 5", category: "Island Goals", checked: false },
  { id: "g5", label: "Unlock the Rainbow Bridge", category: "Island Goals", checked: false },
  { id: "g6", label: "Fill 50% of the island grid", category: "Island Goals", checked: false },
  { id: "g7", label: "Create a garden area with 5+ flowers", category: "Island Goals", checked: false },

  // Pokemon to Attract
  { id: "p1", label: "Attract a Fire-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p2", label: "Attract a Water-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p3", label: "Attract a Grass-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p4", label: "Attract an Electric-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p5", label: "Attract a Fairy-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p6", label: "Attract a Dragon-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p7", label: "Attract a Flying-type Pokemon", category: "Pokemon to Attract", checked: false },
  { id: "p8", label: "Attract an Ice-type Pokemon", category: "Pokemon to Attract", checked: false },
];

export function getChecklistCategories(): string[] {
  return [...new Set(DEFAULT_CHECKLIST.map((e) => e.category))];
}
