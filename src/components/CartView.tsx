import { useCart } from "@/contexts/CartContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MapPin, Minus, Plus, Trash2, Store } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export function CartView() {
  const { getStoreGroups, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const storeGroups = getStoreGroups();

  if (storeGroups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Store className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-sm text-muted-foreground">
          Add items from stores to create your shopping list
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 py-6">
      {storeGroups.map((group) => (
        <Card key={group.storeId} className="bg-gradient-card">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <CardTitle className="text-lg">{group.storeName}</CardTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3 w-3" />
                  <span>{group.distance} km away</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{group.address}</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-primary">
                  ${group.total.toFixed(2)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {group.items.length} item{group.items.length !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {group.items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">
                    {item.product.brand && `${item.product.brand} `}
                    {item.product.name}
                    {item.product.size && ` (${item.product.size})`}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    ${item.store.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center font-semibold">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      <Separator />

      <div className="space-y-4">
        <div className="flex items-center justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${getTotalPrice().toFixed(2)}</span>
        </div>

        <Button
          variant="destructive"
          className="w-full"
          onClick={clearCart}
        >
          Clear All
        </Button>
      </div>
    </div>
  );
}
