export interface GuideSection {
  id: string;
  title: string;
  icon: string;
  content: GuideEntry[];
}

export interface GuideEntry {
  heading: string;
  text: string;
}

export const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "overview",
    title: "Game Overview",
    icon: "🎮",
    content: [
      {
        heading: "What is Pokemon Pokopia?",
        text: "Pokemon Pokopia is a relaxing life-sim for Nintendo Switch 2 where you play as a Ditto on an island that was once home to Pokemon and humans. Professor Tangrowth asks for your help to rebuild the town by mimicking the abilities of wild Pokemon to cultivate areas and attract Pokemon back to their natural habitats.",
      },
      {
        heading: "Core Gameplay Loop",
        text: "Explore the island, gather raw materials, process them using befriended Pokemon with specialties (Chop, Burn, Crush, Litter), craft buildings and habitats at the Workbench, and attract wild Pokemon to your island. The game features 300 Pokemon to discover across 209+ habitat types.",
      },
      {
        heading: "Voxel Building System",
        text: "Pokopia uses a voxel-based building system — think digital LEGO bricks. Every wall, floor, and ceiling is made of individual blocks that snap together on a 3D grid. Each cell can hold one block. There are 45+ construction kits and 714 crafting recipes to discover.",
      },
    ],
  },
  {
    id: "cloud-islands",
    title: "Cloud Islands",
    icon: "☁️",
    content: [
      {
        heading: "What Are Cloud Islands?",
        text: "Cloud Islands are separate online worlds you can create, customize, and share with other players. Each Cloud Island generates a random terrain layout with all biomes and materials from the main game, giving you a blank canvas to build without restrictions.",
      },
      {
        heading: "Multiplayer",
        text: "Up to 4 players can be on a single Cloud Island at the same time. There's no limit to how many different players can visit across separate sessions — a popular island code can see hundreds of visitors.",
      },
      {
        heading: "Sharing & Codes",
        text: "Each Cloud Island has an address code for sharing and a Magic Number that functions as a seed for generating identical layouts. Share your code with friends so they can visit even when you're offline. Developer's Island code: PXQC G03S.",
      },
      {
        heading: "Dream Islands",
        text: "A friendly Drifloon can transport you to Dream Islands — special islands rich with building materials, items, and habitat suggestions. These are great for gathering specific material types quickly.",
      },
      {
        heading: "Recipes Transfer",
        text: "Recipes you learn on Cloud Islands are permanently kept in your main game. This is one of the most valuable reasons to visit other players' islands!",
      },
    ],
  },
  {
    id: "buildings",
    title: "Buildings & Construction",
    icon: "🏠",
    content: [
      {
        heading: "43 Building Types",
        text: "Pokopia features 43 buildings across residential, utility, commercial, and legendary categories. Houses come in four sizes: Den (smallest), Hut, Cottage, and House (largest). There are also Pokemon Centers, power generators, and more.",
      },
      {
        heading: "House Capacity",
        text: "Each block house can hold up to 4 Pokemon. Habitats placed inside houses do NOT count toward this cap, so you can fit even more Pokemon per structure with smart interior design.",
      },
      {
        heading: "Building Rules",
        text: "You need a minimum of 2 blocks in width AND height to create a functional building with a door and furniture inside. Building blocks come from crafting — Lumber, Stone, and Iron Ore are your essentials.",
      },
      {
        heading: "Floating Structures",
        text: "Blocks in Pokopia don't fall when you remove supporting blocks underneath. Build a roof, remove the scaffolding, and everything stays in place. Use this for floating structures, bridges, and overhangs!",
      },
      {
        heading: "Pokemon Centers",
        text: "There are 5 Pokemon Centers, one per area. Each requires different materials: Wasteland (Lumber, Stones, Leaves, Vines), Bleak Beach (Twine, Bricks, Sea Glass, Iron Ore), Rocky Ridges (Stones, Iron Ingots, Copper Ingots, Crystal Fragments), Sparkling Skylands (Poketal Ingots, Concrete, Glass, Gold).",
      },
      {
        heading: "Power Generators",
        text: "Three types of generators provide power: Wind Generators (wind energy), Water Generators (hydro power), and Fire Generators (burn fuel). Place them strategically to power your island.",
      },
    ],
  },
  {
    id: "materials",
    title: "Materials & Crafting",
    icon: "🪨",
    content: [
      {
        heading: "Raw Materials",
        text: "Found around the overworld (press Y to pick up): Stone (rocks/boulders), Small Log (chop small trees), Sturdy Stick (chop medium trees), Leaf (chop bushes), Vine Rope (cut hanging vines), Squishy Clay (dig near water/riverbanks), Limestone (light-colored rocks), Iron Ore, Sea Glass (Bleak Beach), Glowing Mushroom (dark caves), Honey (Vespiquen/flower habitats).",
      },
      {
        heading: "Processed Materials",
        text: "Require Pokemon with specialties to process: Lumber (logs via Chop), Brick (clay via Burn), Concrete (limestone via Crush), Twine (vines or from Spinarak), Iron Ingots, Copper Ingots, Glass, Paint, Poketal Ingots, and Gold.",
      },
      {
        heading: "Pokemon Specialties",
        text: "Chop: Scyther processes logs into Lumber. Burn: Torchic, Flareon, Arcanine, Ninetales, Charmander process clay into Brick. Crush: Conkeldurr, Onix, Steelix, Metagross, Tyranitar, Golem, Rampardos process limestone into Concrete. Litter: Bellsprout, Weepinbell leave Vine Rope near habitats.",
      },
      {
        heading: "Crafting System",
        text: "Crafting is the backbone of Pokopia. Every habitat, furniture piece, and decorative element starts at the Workbench. There are 714 crafting recipes across all categories: Furniture, Outdoor, Utilities, Buildings, Nature, Blocks, Kits, Food, Materials, Key Items, and more.",
      },
    ],
  },
  {
    id: "habitats",
    title: "Habitats & Pokemon",
    icon: "🌿",
    content: [
      {
        heading: "209+ Habitat Types",
        text: "There are over 209 habitats in Pokopia (not counting event habitats). Every Pokemon is associated with at least one habitat type — build the right habitat to attract specific Pokemon.",
      },
      {
        heading: "Top Habitats",
        text: "Forest Grove attracts 18 different species (most diverse). Flower Meadow is second with 15 species. Build these early for maximum Pokemon variety.",
      },
      {
        heading: "Habitat Types by Pokemon Type",
        text: "Campfire habitats attract Fire-types. Pond habitats attract Water-types. Flower Meadow attracts Bug-types and pollinators. Spooky Hollow draws Ghost and Dark-types. Electric Field attracts Electric-types. Fairy Garden attracts Fairy-types.",
      },
      {
        heading: "Weather & Time Effects",
        text: "Roughly a third of all Pokemon have weather or time-of-day requirements. A Pokemon might only appear during rain, at night, or during a snowstorm. Check back at different times to find rare species!",
      },
      {
        heading: "Comfort Levels",
        text: "Talk to any befriended Pokemon and ask 'How's your comfort level?' to get direct feedback on their habitat. They'll tell you what's missing or what could be improved, giving clear direction on what items to place nearby.",
      },
      {
        heading: "Pokedex",
        text: "300 Pokemon in the standard Pokedex (plus event Pokemon). Tend to the environment to attract Pokemon back to their natural habitats and fill your Pokedex.",
      },
    ],
  },
  {
    id: "tips",
    title: "Beginner Tips",
    icon: "💡",
    content: [
      {
        heading: "1. Progress the Story First",
        text: "Don't spend too much time building early towns. Many important building items, tools, and abilities unlock later in the story. Progress main quests first to get more options and avoid rebuilding everything later.",
      },
      {
        heading: "2. Keep Berries in Your Inventory",
        text: "Always keep berries stocked so PP fatigue never slows you down at a critical moment. Berries are essential for maintaining your energy while exploring and building.",
      },
      {
        heading: "3. Focus on Key Pokemon Early",
        text: "Befriend Scyther (Chop), a Fire-type with Burn (like Torchic), and a Crush Pokemon (like Onix) as soon as possible. These three specialties let you process the core building materials: Lumber, Brick, and Concrete.",
      },
      {
        heading: "4. Habitats Before Decorations",
        text: "Focus on getting a few Pokemon comfortable in solid habitats before expanding aggressively. A happy Pokemon provides more help than a pretty-but-empty town.",
      },
      {
        heading: "5. Use Floating Blocks Creatively",
        text: "Since blocks don't fall when you remove supports, you can build scaffolding up, place your roof or bridge, then remove the scaffolding. Great for dramatic floating structures and skyways.",
      },
      {
        heading: "6. Visit Cloud Islands for Recipes",
        text: "Any recipe you learn on a Cloud Island permanently transfers to your main game. Visit other players' islands to discover new recipes you haven't found yet!",
      },
      {
        heading: "7. Check Weather & Time",
        text: "About a third of Pokemon only appear under specific weather or time conditions. If you're hunting a rare Pokemon, try visiting its habitat at night, during rain, or in other weather conditions.",
      },
      {
        heading: "8. Ask Pokemon for Feedback",
        text: "Talk to befriended Pokemon and ask about their comfort level. They'll tell you exactly what their habitat needs, saving you guesswork on what to place nearby.",
      },
      {
        heading: "9. Interior Habitats Don't Count",
        text: "Habitats placed inside houses don't count toward the 4-Pokemon-per-house cap. Use this to pack more Pokemon into each structure with clever interior design.",
      },
      {
        heading: "10. Dream Islands for Fast Materials",
        text: "When you need specific materials fast, visit a Dream Island via Drifloon. These special islands are loaded with building materials and can save you hours of gathering.",
      },
    ],
  },
  {
    id: "areas",
    title: "Island Areas",
    icon: "🗺️",
    content: [
      {
        heading: "Mossgrove Meadow",
        text: "A lush green area with abundant Grass-type and Bug-type Pokemon. Great for gathering Leaves and Small Logs. Home to the Tall Grass habitat, one of the first habitats you'll build.",
      },
      {
        heading: "Wasteland",
        text: "A dry, rugged area. The Wasteland Pokemon Center requires Lumber, Stones, Leaves, and Vines. Good source of Stone and basic materials early on.",
      },
      {
        heading: "Bleak Beach",
        text: "A coastal area where you'll find Sea Glass and Water-type Pokemon. The Pokemon Center here needs Twine, Bricks, Sea Glass, and Iron Ore.",
      },
      {
        heading: "Rocky Ridges",
        text: "A mountainous region rich in minerals. Find Iron Ore, Copper, and Crystal Fragments here. The Pokemon Center requires Stones, Iron Ingots, Copper Ingots, and Crystal Fragments.",
      },
      {
        heading: "Sparkling Skylands",
        text: "The highest area with rare materials. The Pokemon Center requires the most advanced materials: Poketal Ingots, Concrete, Glass, and Gold. Home to rare Flying-type and Fairy-type Pokemon.",
      },
    ],
  },
];
