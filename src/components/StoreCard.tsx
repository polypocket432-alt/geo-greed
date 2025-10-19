import { MapPin, Store, Tag } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StorePrice } from "@/types/product";

interface StoreCardProps {
  store: StorePrice;
  lowestPrice: number;
}

export function StoreCard({ store, lowestPrice }: StoreCardProps) {
  const isLowestPrice = store.price === lowestPrice;
  const savings = store.price - lowestPrice;

  return (
    <Card className="hover:shadow-hover transition-all duration-300 bg-gradient-card">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <Store className="h-6 w-6 text-primary" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="font-semibold text-lg truncate">{store.storeName}</h3>
                <div className="flex gap-2 flex-shrink-0">
                  {isLowestPrice && (
                    <Badge variant="success">
                      Best Price
                    </Badge>
                  )}
                  {store.discount && (
                    <Badge variant="destructive" className="bg-destructive/90">
                      {store.discount}% OFF
                    </Badge>
                  )}
                </div>
              </div>
              
              {store.dealText && (
                <div className="flex items-center gap-1.5 mb-2 text-sm font-medium text-primary">
                  <Tag className="h-4 w-4" />
                  <span>{store.dealText}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                <MapPin className="h-4 w-4" />
                <span>{store.distance} km away</span>
              </div>
              
              <p className="text-sm text-muted-foreground truncate">{store.address}</p>
              
              {!store.inStock && (
                <Badge variant="destructive" className="mt-2">
                  Out of Stock
                </Badge>
              )}
            </div>
          </div>

          <div className="text-right flex-shrink-0">
            <div className="text-3xl font-bold text-primary">
              ${store.price.toFixed(2)}
            </div>
            {!isLowestPrice && savings > 0 && (
              <div className="text-sm text-muted-foreground mt-1">
                +${savings.toFixed(2)}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
