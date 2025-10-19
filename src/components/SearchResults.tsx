import { Product } from "@/types/product";
import { ProductVariantCard } from "./ProductVariantCard";
import { TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  product: Product[] | null;
  searchQuery: string;
}

export function SearchResults({ product, searchQuery }: SearchResultsProps) {
  if (!searchQuery) return null;

  if (!product) {
    return (
      <section className="py-12 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center py-12">
            <AlertCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              We couldn't find "{searchQuery}". Try searching for "milk", "bread", "eggs", "chicken", or "rice".
            </p>
          </div>
        </div>
      </section>
    );
  }

  const allPrices = product.flatMap(p => p.stores.map(s => s.price));
  const lowestPrice = Math.min(...allPrices);
  const highestPrice = Math.max(...allPrices);
  const potentialSavings = highestPrice - lowestPrice;
  const totalStores = product.reduce((sum, p) => sum + p.stores.length, 0);

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {product[0].name}
                </h2>
                <Badge variant="secondary">{product[0].category}</Badge>
              </div>
              
              {potentialSavings > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-success mb-1">
                    <TrendingDown className="h-5 w-5" />
                    <span className="font-semibold">Save up to</span>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    £{potentialSavings.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground">
              Found {product.length} variant{product.length !== 1 ? 's' : ''} across {totalStores} store listing{totalStores !== 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-6">
            {product.map((variant) => (
              <ProductVariantCard key={variant.id} product={variant} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
