import { Card, CardContent } from "@/components/ui/card";
import { RelatedProduct } from "@/types/product";
import { Package } from "lucide-react";

interface RelatedProductsProps {
  products: RelatedProduct[];
  onProductClick: (productName: string) => void;
}

export function RelatedProducts({ products, onProductClick }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">You might also like</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((product) => (
            <Card
              key={product.id}
              className="cursor-pointer hover:shadow-hover transition-all duration-300 bg-gradient-card"
              onClick={() => onProductClick(product.name)}
            >
              <CardContent className="p-4">
                <div className="w-full h-32 rounded-lg bg-secondary flex items-center justify-center mb-3">
                  <Package className="h-12 w-12 text-primary" />
                </div>
                
                <h3 className="font-semibold mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">From</span>
                  <span className="text-lg font-bold text-primary">
                    ${product.lowestPrice.toFixed(2)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
