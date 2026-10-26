import { getProducts } from "@/lib/products";
import { ProductCard } from "@/app/components/ProductCard";

export async function ProductCatalog() {
  const products = await getProducts();
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
