import { Product } from "@/types/product";
import { StoreCard } from "./StoreCard";
import { TrendingDown, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchResultsProps {
  product: Product | null;
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
              We couldn't find "{searchQuery}". Try searching for "organic milk", "bread", or "eggs".
            </p>
          </div>
        </div>
      </section>
    );
  }

  const lowestPrice = Math.min(...product.stores.map((s) => s.price));
  const highestPrice = Math.max(...product.stores.map((s) => s.price));
  const potentialSavings = highestPrice - lowestPrice;

  return (
    <section className="py-12 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
                <Badge variant="secondary">{product.category}</Badge>
              </div>
              
              {potentialSavings > 0 && (
                <div className="text-right">
                  <div className="flex items-center gap-2 text-success mb-1">
                    <TrendingDown className="h-5 w-5" />
                    <span className="font-semibold">Save up to</span>
                  </div>
                  <div className="text-2xl font-bold text-success">
                    ${potentialSavings.toFixed(2)}
                  </div>
                </div>
              )}
            </div>
            
            <p className="text-muted-foreground">
              Showing {product.stores.length} stores near you, sorted by price
            </p>
          </div>

          <div className="space-y-4">
            {product.stores.map((store) => (
              <StoreCard key={store.id} store={store} lowestPrice={lowestPrice} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
