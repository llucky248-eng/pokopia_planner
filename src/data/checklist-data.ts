import { ChecklistEntry } from "@/types";

export const DEFAULT_CHECKLIST: ChecklistEntry[] = [
  // Buildings to Construct — based on actual Pokopia building system
  { id: "b1", label: "Build your first Den (smallest house)", category: "Buildings to Construct", checked: false },
  { id: "b2", label: "Upgrade to a Hut", category: "Buildings to Construct", checked: false },
  { id: "b3", label: "Build a Cottage", category: "Buildings to Construct", checked: false },
  { id: "b4", label: "Build a full-size House", category: "Buildings to Construct", checked: false },
  { id: "b5", label: "Build the Wasteland Pokemon Center", category: "Buildings to Construct", checked: false },
  { id: "b6", label: "Build the Bleak Beach Pokemon Center", category: "Buildings to Construct", checked: false },
  { id: "b7", label: "Build the Rocky Ridges Pokemon Center", category: "Buildings to Construct", checked: false },
  { id: "b8", label: "Build the Sparkling Skylands Pokemon Center", category: "Buildings to Construct", checked: false },
  { id: "b9", label: "Build a Wind Generator", category: "Buildings to Construct", checked: false },
  { id: "b10", label: "Build a Water Generator", category: "Buildings to Construct", checked: false },
  { id: "b11", label: "Build a Fire Generator", category: "Buildings to Construct", checked: false },
  { id: "b12", label: "Set up a Workbench", category: "Buildings to Construct", checked: false },

  // Materials to Gather — real Pokopia materials
  { id: "m1", label: "Gather Stone (smash rocks & boulders)", category: "Materials to Gather", checked: false },
  { id: "m2", label: "Gather Small Logs (chop trees)", category: "Materials to Gather", checked: false },
  { id: "m3", label: "Process Lumber (Chop specialty Pokemon)", category: "Materials to Gather", checked: false },
  { id: "m4", label: "Gather Squishy Clay (dig near water)", category: "Materials to Gather", checked: false },
  { id: "m5", label: "Process Brick (Burn specialty Pokemon)", category: "Materials to Gather", checked: false },
  { id: "m6", label: "Gather Limestone (light-colored rocks)", category: "Materials to Gather", checked: false },
  { id: "m7", label: "Process Concrete (Crush specialty Pokemon)", category: "Materials to Gather", checked: false },
  { id: "m8", label: "Gather Vine Rope (cut hanging vines)", category: "Materials to Gather", checked: false },
  { id: "m9", label: "Obtain Twine (from Spinarak or Cut vines)", category: "Materials to Gather", checked: false },
  { id: "m10", label: "Gather Iron Ore", category: "Materials to Gather", checked: false },
  { id: "m11", label: "Smelt Iron Ingots", category: "Materials to Gather", checked: false },
  { id: "m12", label: "Gather Sea Glass (Bleak Beach)", category: "Materials to Gather", checked: false },
  { id: "m13", label: "Process Glass", category: "Materials to Gather", checked: false },
  { id: "m14", label: "Find Glowing Mushrooms (dark caves)", category: "Materials to Gather", checked: false },
  { id: "m15", label: "Obtain Honey (Vespiquen or flower habitats)", category: "Materials to Gather", checked: false },

  // Habitats to Build — based on actual Pokopia habitats
  { id: "h1", label: "Build a Tall Grass habitat (Mossgrove Meadow)", category: "Habitats to Build", checked: false },
  { id: "h2", label: "Build a Forest Grove habitat (attracts 18 species)", category: "Habitats to Build", checked: false },
  { id: "h3", label: "Build a Flower Meadow habitat (attracts 15 species)", category: "Habitats to Build", checked: false },
  { id: "h4", label: "Build a Campfire habitat (Fire-types)", category: "Habitats to Build", checked: false },
  { id: "h5", label: "Build a Pond habitat (Water-types)", category: "Habitats to Build", checked: false },
  { id: "h6", label: "Build a Spooky Hollow (Ghost/Dark-types)", category: "Habitats to Build", checked: false },
  { id: "h7", label: "Build an Electric Field (Electric-types)", category: "Habitats to Build", checked: false },
  { id: "h8", label: "Build a Cave habitat", category: "Habitats to Build", checked: false },
  { id: "h9", label: "Build a Fairy Garden (Fairy-types)", category: "Habitats to Build", checked: false },

  // Cloud Island Goals
  { id: "c1", label: "Create your first Cloud Island", category: "Cloud Island Goals", checked: false },
  { id: "c2", label: "Share your Cloud Island code with a friend", category: "Cloud Island Goals", checked: false },
  { id: "c3", label: "Visit another player's Cloud Island", category: "Cloud Island Goals", checked: false },
  { id: "c4", label: "Build with 4 players on a Cloud Island", category: "Cloud Island Goals", checked: false },
  { id: "c5", label: "Visit the Developer's Island (code: PXQC G03S)", category: "Cloud Island Goals", checked: false },
  { id: "c6", label: "Learn a recipe on a Cloud Island (transfers to main game)", category: "Cloud Island Goals", checked: false },
  { id: "c7", label: "Build a floating structure (blocks don't fall!)", category: "Cloud Island Goals", checked: false },
  { id: "c8", label: "Visit a Dream Island via Drifloon", category: "Cloud Island Goals", checked: false },

  // Pokemon to Befriend — using specialty Pokemon
  { id: "p1", label: "Befriend Scyther (Chop specialty — processes Lumber)", category: "Pokemon to Befriend", checked: false },
  { id: "p2", label: "Befriend a Burn specialty Pokemon (Torchic/Flareon/Arcanine)", category: "Pokemon to Befriend", checked: false },
  { id: "p3", label: "Befriend a Crush specialty Pokemon (Conkeldurr/Onix/Golem)", category: "Pokemon to Befriend", checked: false },
  { id: "p4", label: "Befriend Spinarak (drops Twine)", category: "Pokemon to Befriend", checked: false },
  { id: "p5", label: "Befriend Vespiquen (produces Honey)", category: "Pokemon to Befriend", checked: false },
  { id: "p6", label: "Befriend Cacturne (drops Sturdy Sticks)", category: "Pokemon to Befriend", checked: false },
  { id: "p7", label: "Befriend a Litter specialty Pokemon (Bellsprout/Weepinbell)", category: "Pokemon to Befriend", checked: false },
  { id: "p8", label: "Fill 50 entries in the Habitat Dex (of 209+ habitats)", category: "Pokemon to Befriend", checked: false },
  { id: "p9", label: "Catch 100 of the 300 Pokemon in the Pokedex", category: "Pokemon to Befriend", checked: false },
];

export function getChecklistCategories(): string[] {
  return [...new Set(DEFAULT_CHECKLIST.map((e) => e.category))];
}
