export type ItemCategory =
  | "buildings"
  | "blocks"
  | "nature"
  | "outdoor"
  | "furniture"
  | "utilities"
  | "materials"
  | "food"
  | "misc"
  | "kits"
  | "key-items"
  | "other"
  | "lost-relics-l"
  | "lost-relics-s"
  | "fossils";

export interface CatalogItem {
  id: string;
  name: string;
  category: ItemCategory;
  emoji: string;
  color: string;
  /** Footprint width in cells. Defaults to 1 when omitted. */
  sizeW?: number;
  /** Footprint height in cells. Defaults to 1 when omitted. */
  sizeH?: number;
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
