export interface Shelf {
  y: number;
  x1: number;
  x2: number;
}

export const SHELVES_STORAGE_KEY = 'neco-shelves';
export const SHELVES_CHANGED_EVENT = 'neco-shelves-changed';
export const EDGE_SNAP_PX = 15;

export function snapShelfToEdges(shelf: Shelf, viewportWidth: number): Shelf {
  const x1 = shelf.x1 <= EDGE_SNAP_PX ? 0 : shelf.x1;
  const x2 =
    shelf.x2 >= viewportWidth - EDGE_SNAP_PX ? viewportWidth : shelf.x2;
  return { ...shelf, x1, x2 };
}

// Named anchor Y values for key layout boundaries
const HERO_SHELF_Y    = 373;   // shelf in hero section
const QUOTE_TOP_Y     = 788;   // top border of quote divider
const QUOTE_BOTTOM_Y  = 944;   // bottom border of quote divider
const REPO_TOP_Y      = QUOTE_BOTTOM_Y + 0;   // repo section top (same as quote bottom)
const REPO_SHELF_Y    = QUOTE_BOTTOM_Y + 479;  // 1423 — shelf across repo grid
const REPO_MID_Y      = REPO_SHELF_Y  + 145;  // 1568 — narrow shelf in repo grid
const ABOUT_TOP_Y     = REPO_MID_Y   + 69;   // 1637 — shelf at about section top

export const BASELINE_SHELVES: Shelf[] = [
  { y: HERO_SHELF_Y,   x1: 499, x2: 899  },
  { y: QUOTE_TOP_Y,    x1: 0,   x2: 1400 },
  { y: QUOTE_BOTTOM_Y, x1: 0,   x2: 1400 },
  { y: REPO_TOP_Y,     x1: 131, x2: 1265 },
  { y: REPO_SHELF_Y,   x1: 133, x2: 1267 },
  { y: REPO_MID_Y,     x1: 640, x2: 756  },
  { y: ABOUT_TOP_Y,    x1: 432, x2: 967  },
];

export function loadShelves(): Shelf[] {
  if (typeof window === 'undefined') return BASELINE_SHELVES;
  try {
    const raw = localStorage.getItem(SHELVES_STORAGE_KEY);
    if (raw === null) return BASELINE_SHELVES;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return BASELINE_SHELVES;
  } catch {
    return BASELINE_SHELVES;
  }
}
