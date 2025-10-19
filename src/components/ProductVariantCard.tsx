import { Product } from "@/types/product";
import { StoreCard } from "./StoreCard";
import { Package } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ProductVariantCardProps {
  product: Product;
}

export function ProductVariantCard({ product }: ProductVariantCardProps) {
  const lowestPrice = Math.min(...product.stores.map((s) => s.price));

  return (
    <div className="space-y-4">
      <Card className="bg-gradient-card p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Package className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {product.brand && `${product.brand} - `}
              {product.name}
              {product.size && ` (${product.size})`}
            </h3>
            <p className="text-sm text-muted-foreground">
              From ${lowestPrice.toFixed(2)} • {product.stores.length} store{product.stores.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </Card>
      
      <div className="space-y-3 pl-4 border-l-2 border-primary/20">
        {product.stores.map((store) => (
          <StoreCard key={store.id} store={store} lowestPrice={lowestPrice} product={product} />
        ))}
      </div>
    </div>
  );
}
