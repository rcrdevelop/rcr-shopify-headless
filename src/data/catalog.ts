export type Category = "Hombre" | "Mujer" | "Calzado" | "Accesorios";

export interface Variant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  compareAt?: number | undefined;
  rating: number;
  reviews: number;
  image: string;
  variants: Variant[];
  tags: string[];
  description: string;
}

export interface CartLine {
  productId: string;
  variantId: string;
  qty: number;
}

export interface Order {
  id: string;
  number: string;
  createdAt: string;
  items: { name: string; variant: string; qty: number; price: number }[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: "Pagado" | "Preparando" | "Enviado" | "Entregado";
  customer: { name: string; email: string; address: string; city: string };
  shippingMethod: string;
}

/** Ilustración SVG de producto como data-uri. */
export function prodImage(kind: string, c1: string, c2: string): string {
  const shapes: Record<string, string> = {
    shoe: `<path d="M60 130 q30 -55 85 -45 q20 5 25 25 q30 5 70 15 q35 10 35 35 l0 20 -215 0 z" fill="${c1}"/><path d="M60 160 l215 0 0 16 -215 0 z" fill="${c2}"/><path d="M95 105 l14 14 M110 98 l14 14 M125 96 l14 14" stroke="#fff" stroke-width="4" fill="none"/>`,
    shirt: `<path d="M110 60 l30 -14 q30 18 60 0 l30 14 34 34 -22 22 -14 -10 0 78 -136 0 0 -78 -14 10 -22 -22 z" fill="${c1}"/><path d="M140 50 q30 20 60 0" stroke="${c2}" stroke-width="5" fill="none"/>`,
    bag: `<rect x="110" y="80" width="120" height="105" rx="14" fill="${c1}"/><path d="M140 80 q30 -45 60 0" stroke="${c2}" stroke-width="10" fill="none"/><circle cx="150" cy="120" r="8" fill="${c2}"/><circle cx="190" cy="120" r="8" fill="${c2}"/>`,
    watch: `<rect x="145" y="50" width="50" height="70" rx="8" fill="${c2}"/><rect x="145" y="170" width="50" height="70" rx="8" fill="${c2}"/><circle cx="170" cy="145" r="48" fill="${c1}"/><circle cx="170" cy="145" r="38" fill="#fff"/><path d="M170 145 L170 118 M170 145 L190 150" stroke="${c2}" stroke-width="5"/>`,
    glasses: `<path d="M80 130 q10 -30 40 -22 M260 130 q-10 -30 -40 -22" stroke="${c2}" stroke-width="7" fill="none"/><rect x="95" y="115" width="60" height="45" rx="16" fill="${c1}"/><rect x="185" y="115" width="60" height="45" rx="16" fill="${c1}"/><rect x="155" y="130" width="30" height="8" fill="${c2}"/>`,
    hoodie: `<path d="M120 75 q50 -40 100 0 l30 15 30 35 -25 20 -15 -12 0 72 -140 0 0 -72 -15 12 -25 -20 30 -35 z" fill="${c1}"/><path d="M140 70 q30 30 60 0" stroke="${c2}" stroke-width="6" fill="none"/><rect x="140" y="140" width="60" height="40" rx="8" fill="${c2}" opacity="0.5"/>`,
    cap: `<path d="M95 140 q0 -70 75 -70 q75 0 75 70 z" fill="${c1}"/><path d="M60 140 l220 0 q10 22 -55 28 -120 8 -165 -28 z" fill="${c2}"/>`
  };
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 340 240"><rect width="340" height="240" fill="#f7f4fb"/><ellipse cx="170" cy="210" rx="120" ry="14" fill="#e9e0f4"/>${shapes[kind] ?? shapes["shirt"] ?? ""}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SIZES = ["XS", "S", "M", "L", "XL"];
const SHOE_SIZES = ["38", "39", "40", "41", "42", "43"];

function variants(sizes: string[], colors: string[]): Variant[] {
  const out: Variant[] = [];
  let i = 0;
  for (const c of colors)
    for (const s of sizes)
      out.push({
        id: `v${++i}`,
        size: s,
        color: c,
        stock: [0, 3, 7, 12, 20][(i * 7) % 5] ?? 0
      });
  return out;
}

export function seedProducts(): Product[] {
  const mk = (
    i: number,
    name: string,
    category: Category,
    price: number,
    kind: string,
    c1: string,
    c2: string,
    sizes: string[],
    colors: string[],
    compareAt?: number
  ): Product => ({
    id: `p-${i}`,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    name,
    category,
    price,
    compareAt,
    rating: Math.round((3.6 + ((i * 37) % 14) / 10) * 10) / 10,
    reviews: 12 + ((i * 53) % 240),
    image: prodImage(kind, c1, c2),
    variants: variants(sizes, colors),
    tags: [category.toLowerCase(), kind],
    description: `${name} — prenda de la colección demo. Materiales premium, envío en 24-48h y devoluciones gratuitas durante 30 días.`
  });

  return [
    mk(
      1,
      "Sneakers Urban Runner",
      "Calzado",
      89.9,
      "shoe",
      "#1d4ed8",
      "#0f172a",
      SHOE_SIZES,
      ["Azul", "Negro"],
      119.9
    ),
    mk(
      2,
      "Camiseta Essential",
      "Hombre",
      24.9,
      "shirt",
      "#0ea5e9",
      "#0369a1",
      SIZES,
      ["Blanco", "Negro", "Azul"]
    ),
    mk(
      3,
      "Bolso Milano",
      "Mujer",
      149.0,
      "bag",
      "#b45309",
      "#78350f",
      ["Única"],
      ["Camel", "Negro"]
    ),
    mk(
      4,
      "Reloj Minimal Steel",
      "Accesorios",
      199.0,
      "watch",
      "#0f172a",
      "#64748b",
      ["Única"],
      ["Plata"],
      259.0
    ),
    mk(
      5,
      "Gafas Riviera",
      "Accesorios",
      79.9,
      "glasses",
      "#111827",
      "#374151",
      ["Única"],
      ["Negro", "Carey"],
      99.9
    ),
    mk(
      6,
      "Hoodie North",
      "Hombre",
      59.9,
      "hoodie",
      "#334155",
      "#1e293b",
      SIZES,
      ["Gris", "Negro", "Verde"]
    ),
    mk(
      7,
      "Gorra Classic",
      "Accesorios",
      19.9,
      "cap",
      "#dc2626",
      "#7f1d1d",
      ["Única"],
      ["Rojo", "Azul", "Negro"]
    ),
    mk(
      8,
      "Sneakers Cloud Walk",
      "Calzado",
      109.9,
      "shoe",
      "#059669",
      "#064e3b",
      SHOE_SIZES,
      ["Verde", "Blanco"]
    ),
    mk(
      9,
      "Camisa Oxford Mujer",
      "Mujer",
      44.9,
      "shirt",
      "#f472b6",
      "#9d174d",
      SIZES,
      ["Rosa", "Blanco"]
    ),
    mk(
      10,
      "Mochila Trail 30L",
      "Accesorios",
      69.9,
      "bag",
      "#166534",
      "#052e16",
      ["Única"],
      ["Verde", "Negro"],
      89.9
    ),
    mk(
      11,
      "Sneakers Retro 90s",
      "Calzado",
      99.9,
      "shoe",
      "#7c3aed",
      "#4c1d95",
      SHOE_SIZES,
      ["Violeta", "Blanco"],
      129.9
    ),
    mk(
      12,
      "Hoodie Oversize W",
      "Mujer",
      64.9,
      "hoodie",
      "#f59e0b",
      "#92400e",
      SIZES,
      ["Mostaza", "Crudo"]
    )
  ];
}
