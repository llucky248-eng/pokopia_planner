export type ItemCategory = "buildings" | "decorations" | "terrain" | "habitats";

export interface CatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  emoji: string;
  color: string;
}

export interface PlacedItem {
  instanceId: string;
  itemId: string;
  row: number;
  col: number;
}

export interface GridState {
  size: number;
  placements: PlacedItem[];
}

export interface SerializedGrid {
  s: number;
  p: [string, number, number][];
}

export interface ChecklistEntry {
  id: string;
  label: string;
  category: string;
  checked: boolean;
}

export interface ChecklistState {
  entries: ChecklistEntry[];
}
