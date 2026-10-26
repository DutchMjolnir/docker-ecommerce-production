import type { ApiResponse, Product } from "@/lib/types";

const fallbackProducts: Product[] = [
  {
    id: 1,
    name: "Auriculares Studio Pro",
    description:
      "Sonido envolvente, cancelación de ruido adaptativa y 40 horas de batería para acompañarte a todas partes.",
    price: 189.9,
    stock: 18,
    is_active: true,
    category: "Audio",
    badge: "Más vendido",
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 2,
    name: "Cámara instantánea Mini",
    description:
      "Captura tus momentos favoritos con color analógico y un diseño compacto que querrás llevar siempre.",
    price: 129,
    stock: 12,
    is_active: true,
    category: "Fotografía",
    badge: "Nuevo",
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 3,
    name: "Smartwatch Active",
    description:
      "Tu bienestar de un vistazo: GPS integrado, métricas de salud y una semana completa de autonomía.",
    price: 219.5,
    stock: 24,
    is_active: true,
    category: "Wearables",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 4,
    name: "Altavoz portátil Move",
    description:
      "Un sonido sorprendentemente potente, resistente al agua y listo para poner banda sonora a tus planes.",
    price: 89.9,
    stock: 30,
    is_active: true,
    category: "Audio",
    badge: "Favorito",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 5,
    name: "Teclado mecánico Key",
    description:
      "Escritura precisa y silenciosa en un teclado inalámbrico minimalista, pensado para tu escritorio.",
    price: 114,
    stock: 9,
    is_active: true,
    category: "Accesorios",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: 6,
    name: "Cámara compacta Lens",
    description:
      "Imágenes llenas de detalle en un cuerpo ligero, con estabilización inteligente para cada aventura.",
    price: 349,
    stock: 7,
    is_active: true,
    category: "Fotografía",
    image:
      "https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=900&q=85",
  },
];

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
    image: product.image ?? fallbackProducts.find((item) => item.id === product.id)?.image,
    category:
      product.category ??
      fallbackProducts.find((item) => item.id === product.id)?.category ??
      "Tecnología",
  };
}

async function requestProducts(path: string): Promise<Product[] | null> {
  const apiUrl = process.env.API_URL;
  if (!apiUrl) return null;

  try {
    const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
      cache: "no-store",
    });
    if (!response.ok) return null;
    const result = (await response.json()) as ApiResponse<Product[] | Product>;
    if (!result.success) return null;
    const data = Array.isArray(result.data) ? result.data : [result.data];
    return data.map(normalizeProduct);
  } catch {
    return null;
  }
}

export async function getProducts(): Promise<Product[]> {
  const products = await requestProducts("/products");
  return (products?.filter((product) => product.is_active) ?? fallbackProducts).map(
    normalizeProduct,
  );
}

export async function getProduct(id: number): Promise<Product | undefined> {
  const products = await requestProducts(`/products/${id}`);
  return products?.[0] ?? fallbackProducts.find((product) => product.id === id);
}

export function getFallbackProduct(id: number): Product | undefined {
  return fallbackProducts.find((product) => product.id === id);
}
